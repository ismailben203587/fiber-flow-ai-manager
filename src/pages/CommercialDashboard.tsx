
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommercialStats from "@/components/CommercialStats";
import CommercialCommands from "@/components/CommercialCommands";
import { Building2, Users, ShoppingCart } from "lucide-react";

const CommercialDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Smart Telecom - Commercial
          </h1>
          <p className="text-gray-600">
            Plateforme de gestion commerciale et commandes FTTH
          </p>
        </div>

        <CommercialStats />

        <Tabs defaultValue="commands" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-emerald-50">
            <TabsTrigger value="commands" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Commandes
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              <Building2 className="h-4 w-4 mr-2" />
              Rapports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-6">
            <CommercialCommands />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Gestion Clients</h3>
              <p className="text-gray-600">Module clients - À venir</p>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Rapports Commerciaux</h3>
              <p className="text-gray-600">Génération de rapports commerciaux - À venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommercialDashboard;
