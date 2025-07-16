
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicalStats from "@/components/TechnicalStats";
import EquipmentManagement from "@/components/EquipmentManagement";
import TicketManagement from "@/components/TicketManagement";
import EquipmentMap from "@/components/EquipmentMap";
import TechnicalOrders from "@/components/TechnicalOrders";
import TechnicalReports from "@/components/TechnicalReports";
import DashboardNavigation from "@/components/DashboardNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Network, Router, MapPin, AlertCircle, Wrench, FileText } from "lucide-react";

interface TechnicalDashboardProps {
  onGoHome: () => void;
}

const TechnicalDashboard = ({ onGoHome }: TechnicalDashboardProps) => {
  return (
    <div className="min-h-screen">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="container mx-auto p-6">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-success bg-clip-text text-transparent mb-2 animate-float">
            Smart Telecom - Technique
          </h1>
          <p className="text-muted-foreground">
            Plateforme technique de supervision, maintenance et rapports FTTH
          </p>
        </div>

        <TechnicalStats />

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 glass-card">
            <TabsTrigger value="orders" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <Wrench className="h-4 w-4 mr-2" />
              Études
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <Network className="h-4 w-4 mr-2" />
              Équipements
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <AlertCircle className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <MapPin className="h-4 w-4 mr-2" />
              Cartographie
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />
              Rapports
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:gradient-success data-[state=active]:text-white">
              <Router className="h-4 w-4 mr-2" />
              Monitoring
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <TechnicalOrders />
          </TabsContent>

          <TabsContent value="equipment" className="space-y-6">
            <EquipmentManagement />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <TicketManagement />
          </TabsContent>

          <TabsContent value="map" className="space-y-6">
            <EquipmentMap />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <TechnicalReports />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="text-center py-12 glass-card">
              <h3 className="text-xl font-semibold mb-4 text-foreground">Module Monitoring</h3>
              <p className="text-muted-foreground">Surveillance réseau en temps réel - À venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicalDashboard;
