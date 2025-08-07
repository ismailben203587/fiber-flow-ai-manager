import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Shield } from 'lucide-react';
import NeuralNetworkBackground from '@/components/NeuralNetworkBackground';
import { supabase } from '@/integrations/supabase/client';
import aiBackground from '@/assets/ai-background.jpg';

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { signIn } = useAuth();
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* AI Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${aiBackground})` }}
      />
      
      {/* Neural Network Background */}
      <NeuralNetworkBackground />
      
      {/* Holographic Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-holographic-pink/10 via-transparent to-holographic-cyan/10" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-holographic-pink/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-holographic-cyan/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-holographic-purple/5 rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-4">
            <img 
              src="/lovable-uploads/1eb6298a-d581-4a12-89d9-94b711f761a7.png" 
              alt="NeuraCom Logo" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-holographic-pink to-holographic-cyan bg-clip-text text-transparent mb-2">
            NeuraCom
          </h1>
          <p className="text-muted-foreground text-sm">
            Connectez-vous pour accéder à votre espace de travail
          </p>
        </div>

        <Card className="holographic-card animate-holographic">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-foreground/90 text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                      className="bg-background/60 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-foreground/90 text-sm font-medium">
                      Mot de passe
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      className="bg-background/60 border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white font-medium py-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105" 
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {isLoading ? 'Connexion...' : 'Se connecter'}
                  </Button>
                </form>
              </CardContent>
            </Card>

      </div>
    </div>
  );
}