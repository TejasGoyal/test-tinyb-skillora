import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/logo';
import { useBranding } from '@/contexts/BrandingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { tenant } = useBranding();
  const { signIn, user, profile, profileError, refreshProfile } = useAuth() as any;

  // Debug: Log current CSS variable values for school branding
  useEffect(() => {
    const root = document.documentElement;
    const schoolPrimary = getComputedStyle(root).getPropertyValue('--school-primary');
    const schoolSecondary = getComputedStyle(root).getPropertyValue('--school-secondary');
    console.log('DEBUG: --school-primary:', schoolPrimary);
    console.log('DEBUG: --school-secondary:', schoolSecondary);
  }, []);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && profile) {
      switch (profile.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'teacher':
          navigate('/teacher/dashboard');
          break;
        case 'parent':
          navigate('/parent/dashboard');
          break;
        default:
          navigate('/');
      }
    }
  }, [user, profile, navigate]);

  // Redirect to school code page if no tenant is selected
  useEffect(() => {
    if (!tenant) {
      navigate('/');
    }
  }, [tenant, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        setError(signInError.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!tenant) {
    return null; // Will redirect to school code page
  }

  return (
    <div className="min-h-screen hero-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo 
              src={tenant.logo_url} 
              size="xl" 
              fallback={tenant.school_name.substring(0, 2).toUpperCase()}
              className="shadow-glow"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {tenant.school_name}
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back! Please sign in to continue
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="card-professional">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  autoComplete="email"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {profileError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    Profile load error: {profileError.message || JSON.stringify(profileError)}
                    <div className="mt-2">
                      <Button variant="ghost" onClick={() => refreshProfile()}>Retry</Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to School Selection
          </Button>
          <div className="mt-4 text-sm text-left">
            <div className="font-medium">Debug</div>
            <div className="flex gap-2 justify-center mt-2">
              <Button variant="outline" onClick={async () => {
                // Try to get session via client and raw fetch to profiles endpoint
                const sess = await (window as any).supabase?.auth?.getSession?.() || null;
                // show in console
                console.log('DEBUG session (window.supabase):', sess);
                try {
                  const token = sess?.data?.session?.access_token;
                  const res = await fetch(`${(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ufgtbltzgpqfvuupiujg.supabase.co')}/rest/v1/profiles?select=*&user_id=eq.${(window as any).supabase?.auth?.user()?.id || ''}`, {
                    headers: {
                      'apikey': (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ3RibHR6Z3BxZnZ1dXBpdWpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMzA5MTYsImV4cCI6MjA2OTcwNjkxNn0.m4Umtbc8cDH-11oIh5nwxR_O2lemOMLaxK8Ga85YnDY'),
                      'Authorization': token ? `Bearer ${token}` : ''
                    }
                  });
                  const text = await res.text();
                  console.log('RAW profiles fetch', res.status, res.statusText, text);
                } catch (e) {
                  console.error('RAW fetch error', e);
                }
              }}>Raw profile fetch</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}