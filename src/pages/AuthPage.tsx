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
  const [creatingUsers, setCreatingUsers] = useState(false);
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

  const createDemoUsers = async () => {
    setCreatingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-demo-users');
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: 'Impossible de créer les utilisateurs de démonstration.',
        });
      } else {
        toast({
          title: 'Succès',
          description: 'Utilisateurs de démonstration créés/mis à jour avec succès.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
      });
    } finally {
      setCreatingUsers(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-neural-darker via-neural-dark to-neural-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* AI Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${aiBackground})` }}
      />
      
      {/* Neural Network Background */}
      <NeuralNetworkBackground />
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-neural-blue/5 via-transparent to-neural-cyan/5" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-neural-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-neural-cyan/10 rounded-full blur-3xl" />
      
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
          <h1 className="text-2xl font-bold text-neural-blue mb-2">
            NeuraCom
          </h1>
          <p className="text-neural-blue/70 text-sm">
            Connectez-vous pour accéder à votre espace de travail
          </p>
        </div>

        <Card className="border border-neural-blue/20 bg-neural-dark/50 backdrop-blur-xl shadow-2xl shadow-neural-blue/10">
          <CardContent className="p-6">
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
                
                <div className="mt-4 pt-4 border-t border-neural-blue/20">
                  <Button 
                    onClick={createDemoUsers}
                    variant="outline"
                    className="w-full border-neural-blue/30 text-neural-blue hover:bg-neural-blue/10" 
                    disabled={creatingUsers}
                  >
                    {creatingUsers ? 'Création...' : 'Créer les utilisateurs de démonstration'}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Demo credentials */}
            <Card className="mt-4 border border-neural-blue/20 bg-neural-dark/30 backdrop-blur-xl">
              <CardContent className="p-4">
                <h3 className="text-neural-blue font-medium mb-3 text-sm">Identifiants de démonstration :</h3>
                <div className="space-y-2 text-xs text-neural-blue/70">
                  <div>• Admin : admin@ftth.ma / password123</div>
                  <div>• Commercial : commercial@ftth.ma / password123</div>
                  <div>• Service Technique : tech@ftth.ma / password123</div>
                  <div>• Technicien : supervisor@ftth.ma / password123</div>
                </div>
              </CardContent>
            </Card>

      </div>
    </div>
  );
}