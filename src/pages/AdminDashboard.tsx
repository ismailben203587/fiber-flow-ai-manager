import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardNavigation from '@/components/DashboardNavigation';
import CommercialDashboard from './CommercialDashboard';
import TechnicalDashboard from './TechnicalDashboard';
import MLAddressManager from '@/components/MLAddressManager';
import { Users, Shield, Settings, BarChart3, Database } from 'lucide-react';

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
        
        <div className="text-center space-y-6 animate-fade-in">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground tracking-tight">
              NeuraCom - Administration
            </h1>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Console d'administration système et gestion des modules
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4 mx-auto professional-card">
            <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4" />
              Commercial
            </TabsTrigger>
            <TabsTrigger value="technical" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              Technique
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="w-4 h-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="professional-card cursor-pointer group" onClick={handleGoToCommercial}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Module Commercial</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">Commandes & Clients</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Gestion des commandes FTTH et support client
                  </p>
                </CardContent>
              </Card>

              <Card className="professional-card cursor-pointer group" onClick={handleGoToTechnical}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Module Technique</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">Équipements & Tickets</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Gestion technique et maintenance réseau
                  </p>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-semibold">Gestion des rôles</div>
                  <p className="text-sm text-muted-foreground mt-2">
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
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Administration Système
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Console d'administration pour la gestion des utilisateurs, des rôles et des paramètres système.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Users className="w-4 h-4 mr-2" />
                    Gestion des utilisateurs
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Shield className="w-4 h-4 mr-2" />
                    Gestion des rôles
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <Settings className="w-4 h-4 mr-2" />
                    Paramètres système
                  </Button>
                  <Button variant="outline" className="justify-start hover:bg-primary hover:text-primary-foreground transition-colors">
                    <BarChart3 className="w-4 w-4 mr-2" />
                    Rapports globaux
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Section Gestion des Adresses ML */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Gestion des Adresses ML</h2>
              </div>
              <MLAddressManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;