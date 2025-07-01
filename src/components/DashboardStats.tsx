
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Router, Users, AlertCircle } from "lucide-react";
import { usePCOEquipment, useMSANEquipment } from "@/hooks/useEquipment";
import { useFTTHOrders } from "@/hooks/useOrders";
import { useCustomerComplaints } from "@/hooks/useComplaints";

const DashboardStats = () => {
  const { data: pcoEquipment = [], isLoading: pcoLoading } = usePCOEquipment();
  const { data: msanEquipment = [], isLoading: msanLoading } = useMSANEquipment();
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();
  const { data: complaints = [], isLoading: complaintsLoading } = useCustomerComplaints();

  // Calculate active equipment
  const activePCO = pcoEquipment.filter(p => p.status === 'active').length;
  const activeMSAN = msanEquipment.filter(m => m.status === 'active').length;

  // Calculate order statistics
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const feasibleOrders = orders.filter(o => o.feasibility_status === 'approved').length;

  // Calculate complaint statistics
  const openComplaints = complaints.filter(c => c.status === 'open').length;
  const criticalComplaints = complaints.filter(c => c.priority === 'critical').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="gradient-telecom text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Équipements PCO</CardTitle>
          <Network className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {pcoLoading ? "..." : activePCO}
          </div>
          <p className="text-xs opacity-90">
            {pcoLoading ? "Chargement..." : `${activePCO} actifs sur ${pcoEquipment.length} total`}
          </p>
        </CardContent>
      </Card>

      <Card className="gradient-success text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Équipements MSAN</CardTitle>
          <Router className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {msanLoading ? "..." : activeMSAN}
          </div>
          <p className="text-xs opacity-90">
            {msanLoading ? "Chargement..." : `${activeMSAN} actifs sur ${msanEquipment.length} total`}
          </p>
        </CardContent>
      </Card>

      <Card className="gradient-warning text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Commandes FTTH</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ordersLoading ? "..." : pendingOrders}
          </div>
          <p className="text-xs opacity-90">
            {ordersLoading ? "Chargement..." : `${feasibleOrders} faisables`}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs">
              En attente
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-danger text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Réclamations</CardTitle>
          <AlertCircle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {complaintsLoading ? "..." : openComplaints}
          </div>
          <p className="text-xs opacity-90">
            {complaintsLoading ? "Chargement..." : `${criticalComplaints} critiques`}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="destructive" className="text-xs">
              Ouvertes
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
