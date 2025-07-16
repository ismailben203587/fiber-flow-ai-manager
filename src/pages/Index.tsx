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
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold gradient-neural bg-clip-text text-transparent animate-float">
            Sélection SMART TELECOM
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {hasRole('admin') ? 
              'En tant qu\'administrateur, vous avez accès à tous les tableaux de bord' :
              'Choisissez votre espace de travail'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Commercial Dashboard Card */}
          {(hasRole('admin') || hasRole('commercial')) && (
            <Card 
              className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow"
              onClick={() => setCurrentDashboard('commercial')}
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 gradient-secondary rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Dashboard Commercial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Gestion des commandes FTTH, support client et analyses commerciales
                </p>
                <Button className="w-full gradient-secondary text-white hover:opacity-80 transition-all duration-300">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Technical Dashboard Card */}
          {(hasRole('admin') || hasRole('tech')) && (
            <Card 
              className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow"
              onClick={() => setCurrentDashboard('technical')}
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 gradient-success rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Dashboard Technique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Gestion des équipements, interventions techniques et maintenance réseau
                </p>
                <Button className="w-full gradient-success text-white hover:opacity-80 transition-all duration-300">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Technicien Dashboard Card */}
          {(hasRole('admin') || hasRole('technicien')) && (
            <Card 
              className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow"
              onClick={() => setCurrentDashboard('technicien')}
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 gradient-warning rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Dashboard Technicien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Gestion des interventions et tickets assignés
                </p>
                <Button className="w-full gradient-warning text-white hover:opacity-80 transition-all duration-300">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Admin Dashboard Card */}
          {hasRole('admin') && (
            <Card 
              className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow md:col-span-2 lg:col-span-1"
              onClick={() => setCurrentDashboard('admin')}
            >
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto p-4 gradient-primary rounded-full w-fit group-hover:scale-110 transition-transform duration-300">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  Dashboard Admin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-center">
                  Administration système et accès à tous les dashboards
                </p>
                <Button className="w-full gradient-primary text-white hover:opacity-80 transition-all duration-300">
                  Accéder au Dashboard
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Votre accès est déterminé par votre rôle utilisateur
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;