
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicalStats from "@/components/TechnicalStats";
import EquipmentManagement from "@/components/EquipmentManagement";
import TicketManagement from "@/components/TicketManagement";
import EquipmentMap from "@/components/EquipmentMap";
import TechnicalOrders from "@/components/TechnicalOrders";
import TechnicalReports from "@/components/TechnicalReports";
import DashboardNavigation from "@/components/DashboardNavigation";
import { Network, Router, MapPin, AlertCircle, Wrench, FileText } from "lucide-react";

interface TechnicalDashboardProps {
  onGoHome: () => void;
}

const TechnicalDashboard = ({ onGoHome }: TechnicalDashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-800 to-blue-800">
      <div className="container mx-auto p-6">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-telecom bg-clip-text text-transparent mb-2">
            Smart Telecom - Technique
          </h1>
          <p className="text-blue-200">
            Plateforme technique de supervision, maintenance et rapports FTTH
          </p>
        </div>

        <TechnicalStats />

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-blue-600/20">
            <TabsTrigger value="orders" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
              <Wrench className="h-4 w-4 mr-2" />
              Études
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
              <Network className="h-4 w-4 mr-2" />
              Équipements
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
              <AlertCircle className="h-4 w-4 mr-2" />
              Tickets
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
              <MapPin className="h-4 w-4 mr-2" />
              Cartographie
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
              <FileText className="h-4 w-4 mr-2" />
              Rapports
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
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
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4 text-blue-200">Module Monitoring</h3>
              <p className="text-blue-300">Surveillance réseau en temps réel - À venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TechnicalDashboard;
