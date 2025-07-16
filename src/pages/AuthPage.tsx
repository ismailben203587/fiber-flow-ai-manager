import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Wifi, Shield, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ email: '', password: '', fullName: '' });
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion',
          description: error.message,
        });
      } else {
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signUp(signupForm.email, signupForm.password, signupForm.fullName);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur d\'inscription',
          description: error.message,
        });
      } else {
        toast({
          title: 'Inscription réussie',
          description: 'Vérifiez votre email pour confirmer votre compte.',
        });
        setSignupForm({ email: '', password: '', fullName: '' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { name: 'Neural Admin', email: 'admin@ftth.ma', role: 'admin', color: 'from-neural-pink to-neural-purple' },
    { name: 'Commerce AI', email: 'commercial@ftth.ma', role: 'commercial', color: 'from-neural-cyan to-neural-blue' },
    { name: 'Tech Matrix', email: 'tech@ftth.ma', role: 'tech', color: 'from-neural-green to-neural-cyan' },
    { name: 'Cyber Supervisor', email: 'supervisor@ftth.ma', role: 'technicien', color: 'from-neural-purple to-neural-pink' }
  ];

  const handleDemoLogin = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await signIn(email, 'password123');
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur de connexion démo',
          description: 'Compte de démonstration non trouvé. Veuillez créer le compte d\'abord.',
        });
      } else {
        toast({
          title: 'Connexion démo réussie',
          description: 'Vous êtes connecté avec un compte de démonstration.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDemoUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://erpeahzfckyuxxbywgmc.supabase.co/functions/v1/create-demo-users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVycGVhaHpmY2t5dXh4Ynl3Z21jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzODIwMTUsImV4cCI6MjA2Njk1ODAxNX0.cELgbitmfYSht0S8Bk7yq3QEnvQtzO1uccTfZ1LSbrw`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Comptes créés avec succès',
          description: 'Les comptes de démonstration ont été créés. Vous pouvez maintenant vous connecter.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur de création',
          description: result.error || 'Impossible de créer les comptes de démonstration.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite lors de la création des comptes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-darker via-neural-dark to-neural-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-neural-blue/5 via-transparent to-neural-cyan/5" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-neural-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-neural-cyan/10 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header with icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-neural-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-neural-blue/25">
            <Wifi className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neural-blue mb-2">
            Tableau de Bord
          </h1>
          <p className="text-neural-blue/70 text-sm">
            Connectez-vous pour accéder à votre espace de travail
          </p>
        </div>

        <Card className="border border-neural-blue/20 bg-neural-dark/50 backdrop-blur-xl shadow-2xl shadow-neural-blue/10">
          <CardContent className="p-6">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 bg-neural-darker/50 border border-neural-blue/20">
                <TabsTrigger 
                  value="login" 
                  className="text-neural-blue/70 data-[state=active]:bg-neural-blue/20 data-[state=active]:text-neural-blue data-[state=active]:border-neural-blue/30"
                >
                  Connexion
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="text-neural-blue/70 data-[state=active]:bg-neural-blue/20 data-[state=active]:text-neural-blue data-[state=active]:border-neural-blue/30"
                >
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-neural-blue/90 text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="bg-neural-darker/60 border-neural-blue/30 text-neural-blue placeholder-neural-blue/50 focus:border-neural-cyan focus:ring-neural-cyan/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-neural-blue/90 text-sm font-medium">
                      Mot de passe
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="bg-neural-darker/60 border-neural-blue/30 text-neural-blue placeholder-neural-blue/50 focus:border-neural-cyan focus:ring-neural-cyan/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neural-blue to-neural-cyan hover:from-neural-cyan hover:to-neural-blue text-white font-medium py-3 transition-all duration-300 shadow-lg shadow-neural-blue/25" 
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-neural-blue/90 text-sm font-medium">
                      Nom complet
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Jean Dupont"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                      required
                      className="bg-neural-darker/60 border-neural-blue/30 text-neural-blue placeholder-neural-blue/50 focus:border-neural-cyan focus:ring-neural-cyan/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-neural-blue/90 text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                      className="bg-neural-darker/60 border-neural-blue/30 text-neural-blue placeholder-neural-blue/50 focus:border-neural-cyan focus:ring-neural-cyan/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-neural-blue/90 text-sm font-medium">
                      Mot de passe
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                      className="bg-neural-darker/60 border-neural-blue/30 text-neural-blue placeholder-neural-blue/50 focus:border-neural-cyan focus:ring-neural-cyan/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-neural-blue to-neural-cyan hover:from-neural-cyan hover:to-neural-blue text-white font-medium py-3 transition-all duration-300 shadow-lg shadow-neural-blue/25" 
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isLoading ? 'Inscription...' : 'S\'inscrire'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Accounts Section */}
        <div className="mt-8 text-center">
          <p className="text-neural-blue/60 text-sm mb-4 border-t border-neural-blue/10 pt-4">
            Comptes de démonstration quantique :
          </p>
          <div className="grid grid-cols-2 gap-3">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                onClick={() => handleDemoLogin(account.email)}
                disabled={isLoading}
                variant="outline"
                className={`bg-gradient-to-r ${account.color} border-0 text-white font-medium text-xs p-3 h-auto flex flex-col items-center space-y-1 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50`}
              >
                <span className="font-semibold">{account.name}</span>
                <span className="text-xs opacity-80">{account.email}</span>
              </Button>
            ))}
          </div>
          
          {/* Create Demo Users Button */}
          <div className="mt-4">
            <Button
              onClick={createDemoUsers}
              disabled={isLoading}
              variant="outline"
              className="w-full bg-gradient-to-r from-neural-green to-neural-cyan border-neural-green/30 text-white font-medium text-sm py-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Créer les comptes de démonstration
            </Button>
          </div>
          
          <p className="text-neural-blue/40 text-xs mt-3">
            Code quantique : password123
          </p>
        </div>
      </div>
    </div>
  );
}