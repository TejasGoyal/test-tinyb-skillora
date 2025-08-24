import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Logo } from '@/components/ui/logo';
import { useBranding } from '@/contexts/BrandingContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, School } from 'lucide-react';

export default function SchoolCodePage() {
  const [schoolCode, setSchoolCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { applyBranding } = useBranding();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolCode.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data: tenant, error: fetchError } = await supabase
        .from('tenants')
        .select('*')
        .eq('school_code', schoolCode.trim().toUpperCase())
        .maybeSingle();

      if (fetchError) {
        console.error('Supabase error:', fetchError);
        setError('Error connecting to database. Please try again.');
        setIsLoading(false);
        return;
      }

      if (!tenant) {
        setError('School code not found. Please check and try again.');
        setIsLoading(false);
        return;
      }

      // Apply branding
      applyBranding(tenant);
      
      // Navigate to login
      navigate('/login');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen hero-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo size="xl" fallback="SX" className="shadow-glow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              SkilloraX <span className="text-school-primary">TinyBridge</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter your school code to continue
            </p>
          </div>
        </div>

        {/* School Code Form */}
        <Card className="card-professional">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <School className="h-5 w-5 text-school-primary" />
              School Access
            </CardTitle>
            <CardDescription>
              Please enter your unique school code to access your institution's portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter school code"
                  value={schoolCode}
                  onChange={(e) => setSchoolCode(e.target.value)}
                  className="text-center text-lg font-medium tracking-wider"
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !schoolCode.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Need help? Contact your school administrator</p>
        </div>
      </div>
    </div>
  );
}