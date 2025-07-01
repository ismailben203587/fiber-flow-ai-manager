
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/DashboardStats";
import EquipmentManagement from "@/components/EquipmentManagement";
import TicketManagement from "@/components/TicketManagement";
import EquipmentMap from "@/components/EquipmentMap";
import CommandModule from "@/components/CommandModule";
import FeasibilityAssessment from "@/components/FeasibilityAssessment";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-telecom bg-clip-text text-transparent mb-2">
            FTTH Manager
          </h1>
          <p className="text-gray-600">
            Plateforme intelligente de gestion et supervision d'un réseau FTTH
          </p>
        </div>

        <DashboardStats />

        <Tabs defaultValue="assessment" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
            <TabsTrigger value="assessment">Évaluation IA</TabsTrigger>
            <TabsTrigger value="equipment">Équipements</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
            <TabsTrigger value="map">Cartographie</TabsTrigger>
            <TabsTrigger value="commands">Commandes</TabsTrigger>
            <TabsTrigger value="reports">Rapports</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="space-y-6">
            <FeasibilityAssessment />
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

          <TabsContent value="commands" className="space-y-6">
            <CommandModule />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Module Rapports</h3>
              <p className="text-gray-600">Génération de rapports détaillés - À venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
