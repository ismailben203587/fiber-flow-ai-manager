import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Settings, Users, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthPage } from "./AuthPage";
import AIBackground from "@/components/AIBackground";
import CommercialDashboard from "./CommercialDashboard";
import TechnicalDashboard from "./TechnicalDashboard";
import AdminDashboard from "./AdminDashboard";
import TechnicienDashboard from "./TechnicienDashboard";

const Index = () => {
  const [currentDashboard, setCurrentDashboard] = useState<'home' | 'commercial' | 'technical' | 'admin' | 'technicien'>('home');
  const { user, loading, getPrimaryRole, hasRole } = useAuth();

  const handleGoHome = () => {
    setCurrentDashboard('home');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto animate-glow"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show auth page if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Route based on user role or current dashboard selection
  if (currentDashboard === 'commercial' || (currentDashboard === 'home' && getPrimaryRole() === 'commercial')) {
    return <CommercialDashboard onGoHome={handleGoHome} />;
  }

  if (currentDashboard === 'technical' || (currentDashboard === 'home' && getPrimaryRole() === 'tech')) {
    return <TechnicalDashboard onGoHome={handleGoHome} />;
  }

  if (currentDashboard === 'technicien' || (currentDashboard === 'home' && getPrimaryRole() === 'technicien')) {
    return <TechnicienDashboard onGoHome={handleGoHome} />;
  }

  if (currentDashboard === 'admin' || (currentDashboard === 'home' && getPrimaryRole() === 'admin')) {
    return <AdminDashboard onGoHome={handleGoHome} />;
  }

  // Show dashboard selection for admin users or fallback
  return (
    <div className="min-h-screen relative">
      <AIBackground />
      <div className="container mx-auto p-6 space-y-8 relative z-10">
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              NeuraCom
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
            {hasRole('admin') ? 
              'Tableau de bord administrateur - Accès complet aux modules système' :
              'Sélectionnez votre module de travail'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Commercial Dashboard Card */}
          {(hasRole('admin') || hasRole('commercial')) && (
            <Card 
              className="professional-card cursor-pointer group animate-slide-up"
              onClick={() => setCurrentDashboard('commercial')}
            >
              <CardHeader className="text-center space-y-6 pb-4">
                <div className="mx-auto p-6 bg-primary rounded-lg w-fit group-hover:bg-primary/90 transition-colors">
                  <BarChart3 className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Module Commercial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center leading-relaxed">
                  Gestion des commandes FTTH, support client et analyses commerciales
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                  Accéder au module
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Technical Dashboard Card */}
          {(hasRole('admin') || hasRole('tech')) && (
            <Card 
              className="professional-card cursor-pointer group animate-slide-up"
              onClick={() => setCurrentDashboard('technical')}
            >
              <CardHeader className="text-center space-y-6 pb-4">
                <div className="mx-auto p-6 gradient-success rounded-lg w-fit group-hover:opacity-90 transition-opacity">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Module Technique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center leading-relaxed">
                  Gestion des équipements, interventions techniques et maintenance réseau
                </p>
                <Button className="w-full gradient-success text-white hover:opacity-90 transition-opacity">
                  Accéder au module
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Technicien Dashboard Card */}
          {(hasRole('admin') || hasRole('technicien')) && (
            <Card 
              className="professional-card cursor-pointer group animate-slide-up"
              onClick={() => setCurrentDashboard('technicien')}
            >
              <CardHeader className="text-center space-y-6 pb-4">
                <div className="mx-auto p-6 gradient-warning rounded-lg w-fit group-hover:opacity-90 transition-opacity">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Module Technicien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center leading-relaxed">
                  Gestion des interventions et tickets assignés
                </p>
                <Button className="w-full gradient-warning text-white hover:opacity-90 transition-opacity">
                  Accéder au module
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Dashboard Card */}
          {hasRole('admin') && (
            <Card 
              className="professional-card cursor-pointer group animate-slide-up md:col-span-2 lg:col-span-1"
              onClick={() => setCurrentDashboard('admin')}
            >
              <CardHeader className="text-center space-y-6 pb-4">
                <div className="mx-auto p-6 bg-primary rounded-lg w-fit group-hover:bg-primary/90 transition-colors">
                  <ShieldCheck className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  Module Administration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center leading-relaxed">
                  Administration système et accès à tous les modules
                </p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors">
                  Accéder au module
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Accès sécurisé basé sur les permissions utilisateur
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;