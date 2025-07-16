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
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestion complète du système et accès à tous les tableaux de bord
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Commercial
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Technique
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={handleGoToCommercial}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dashboard Commercial</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Commandes & Clients</div>
                  <p className="text-xs text-muted-foreground">
                    Gestion des commandes FTTH et support client
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={handleGoToTechnical}>
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

              <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
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
            <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
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
                  <Button variant="outline" className="justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gestion des utilisateurs
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Gestion des rôles
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres système
                  </Button>
                  <Button variant="outline" className="justify-start">
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