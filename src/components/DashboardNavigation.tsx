
import { Button } from "@/components/ui/button";
import { Home, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface DashboardNavigationProps {
  onGoHome: () => void;
}

const DashboardNavigation = ({ onGoHome }: DashboardNavigationProps) => {
  const { user, signOut, getPrimaryRole } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de se déconnecter',
      });
    } else {
      toast({
        title: 'Déconnexion réussie',
        description: 'Vous avez été déconnecté avec succès',
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onGoHome}
        className="flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        Retour à l'accueil
      </Button>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span>{user?.email}</span>
          {getPrimaryRole() && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {getPrimaryRole()}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSignOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
};

export default DashboardNavigation;
