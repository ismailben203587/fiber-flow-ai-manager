import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, ShoppingCart, CheckCircle } from "lucide-react";
import { useFTTHOrders } from "@/hooks/useOrders";
import { useCustomerComplaints } from "@/hooks/useComplaints";

interface CommercialStatsProps {
  onNavigateToOrders?: () => void;
}

const CommercialStats = ({ onNavigateToOrders }: CommercialStatsProps) => {
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();
  const { data: complaints = [], isLoading: complaintsLoading } = useCustomerComplaints();

  // Calculate commercial statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const approvedOrders = orders.filter(o => o.feasibility_status === 'approved').length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card 
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onNavigateToOrders}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
          <ShoppingCart className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ordersLoading ? "..." : totalOrders}
          </div>
          <p className="text-xs opacity-90">
            {ordersLoading ? "Chargement..." : `${pendingOrders} en attente`}
          </p>
          <p className="text-xs opacity-75 mt-1">
            Cliquez pour voir vos commandes
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commandes Approuvées</CardTitle>
          <CheckCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ordersLoading ? "..." : approvedOrders}
          </div>
          <p className="text-xs opacity-90">
            {ordersLoading ? "Chargement..." : `${((approvedOrders/totalOrders)*100).toFixed(1)}% d'approbation`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ordersLoading ? "..." : `${totalOrders > 0 ? ((completedOrders/totalOrders)*100).toFixed(1) : '0'}%`}
          </div>
          <p className="text-xs opacity-90">
            {ordersLoading ? "Chargement..." : `${completedOrders} terminées`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-slate-500 to-slate-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction Client</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {complaintsLoading ? "..." : `${complaints.length > 0 ? (100 - (complaints.filter(c => c.status === 'open').length / complaints.length * 100)).toFixed(1) : '100'}%`}
          </div>
          <p className="text-xs opacity-90">
            {complaintsLoading ? "Chargement..." : `${complaints.filter(c => c.status === 'resolved').length} résolues`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommercialStats;
