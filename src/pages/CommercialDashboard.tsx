
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommercialStats from "@/components/CommercialStats";
import CommercialCommands from "@/components/CommercialCommands";
import ComplaintForm from "@/components/ComplaintForm";
import ClientSearch from "@/components/ClientSearch";
import OrdersList from "@/components/OrdersList";
import DashboardNavigation from "@/components/DashboardNavigation";
import { Building2, Users, ShoppingCart, Plus, Search, List } from "lucide-react";
import { useState } from "react";

interface CommercialDashboardProps {
  onGoHome: () => void;
}

const CommercialDashboard = ({ onGoHome }: CommercialDashboardProps) => {
  const [activeTab, setActiveTab] = useState("commands");

  const handleNavigateToOrders = () => {
    setActiveTab("orders");
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-secondary bg-clip-text text-transparent mb-2 animate-float">
            NeuraCom - Commercial
          </h1>
          <p className="text-muted-foreground">
            Plateforme de gestion commerciale et création de tickets
          </p>
        </div>

        <CommercialStats onNavigateToOrders={handleNavigateToOrders} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 glass-card">
            <TabsTrigger value="commands" className="data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Nouvelle Commande
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <List className="h-4 w-4 mr-2" />
              Mes Commandes
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Ticket
            </TabsTrigger>
            <TabsTrigger value="search" className="data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <Search className="h-4 w-4 mr-2" />
              Recherche Client
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:gradient-secondary data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />
              Clients
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commands" className="space-y-6">
            <CommercialCommands />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersList />
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <ComplaintForm />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <ClientSearch />
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-4">Gestion Clients</h3>
              <p className="text-gray-600">Module clients - À venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommercialDashboard;
