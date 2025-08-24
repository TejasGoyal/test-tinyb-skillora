import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  tenant_id: string;
  role: 'admin' | 'teacher' | 'parent';
  full_name: string;
  email: string;
  name?: string;
  school_id?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  profileError?: any;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, schoolId: string, role: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile after authentication
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      // Log client-side session/auth info to help diagnose unexpected 406
      try {
        const sess = await supabase.auth.getSession();
        console.debug('supabase.getSession()', sess);
      } catch (e) {
        console.debug('Could not get supabase session:', e);
      }
      const { data, error, status } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      console.debug('fetchUserProfile response', { userId, status, data, error });

      if (error) {
        // Save detailed error for UI/diagnostics
        setProfileError({ message: error.message, details: error.details, hint: error.hint, status });
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      setProfileError(null);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile (exception):', error);
      setProfileError({ message: (error as any)?.message || String(error) });
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { error };
  };

  const signUp = async (email: string, password: string, schoolId: string, role: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          tenant_id: schoolId,
          role: role,
          full_name: email // Will be updated by user later
        }
      }
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider 
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        refreshProfile
  , profileError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}