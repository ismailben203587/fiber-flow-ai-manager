import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNavigation from '@/components/DashboardNavigation';
import CommercialDashboard from './CommercialDashboard';
import TechnicalDashboard from './TechnicalDashboard';
import { Users, Shield, Settings, BarChart3 } from 'lucide-react';

interface AdminDashboardProps {
  onGoHome: () => void;
}

const AdminDashboard = ({ onGoHome }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('overview');

  const handleGoToCommercial = () => setActiveTab('commercial');
  const handleGoToTechnical = () => setActiveTab('technical');

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent animate-float">
            SMART TELECOM Administrateur
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestion complète du système et accès à tous les tableaux de bord
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto glass-card">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2 data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              Commercial
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2 data-[state=active]:gradient-success data-[state=active]:text-white">
              <Settings className="w-4 h-4" />
              Technique
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:gradient-primary data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow" onClick={handleGoToCommercial}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dashboard Commercial</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Commandes & Clients</div>
                  <p className="text-xs text-muted-foreground">
                    Gestion des commandes FTTH et support client
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card hover:scale-105 transition-all duration-300 cursor-pointer group animate-glow" onClick={handleGoToTechnical}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dashboard Technique</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Équipements & Tickets</div>
                  <p className="text-xs text-muted-foreground">
                    Gestion technique et maintenance réseau
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-card animate-glow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Gestion des rôles</div>
                  <p className="text-xs text-muted-foreground">
                    Administration des accès et permissions
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commercial">
            <CommercialDashboard onGoHome={() => setActiveTab('overview')} />
          </TabsContent>

          <TabsContent value="technical">
            <TechnicalDashboard onGoHome={() => setActiveTab('overview')} />
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Administration Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Cette section permet la gestion des utilisateurs, des rôles et des paramètres système.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start hover:gradient-primary hover:text-white border-border">
                    <Users className="w-4 h-4 mr-2" />
                    Gestion des utilisateurs
                  </Button>
                  <Button variant="outline" className="justify-start hover:gradient-primary hover:text-white border-border">
                    <Shield className="w-4 h-4 mr-2" />
                    Gestion des rôles
                  </Button>
                  <Button variant="outline" className="justify-start hover:gradient-primary hover:text-white border-border">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres système
                  </Button>
                  <Button variant="outline" className="justify-start hover:gradient-primary hover:text-white border-border">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Rapports globaux
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;