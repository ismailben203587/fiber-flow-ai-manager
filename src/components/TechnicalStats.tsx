
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Router, AlertTriangle, Activity } from "lucide-react";
import { usePCOEquipment, useMSANEquipment } from "@/hooks/useEquipment";
import { useFTTHOrders } from "@/hooks/useOrders";
import { useCustomerComplaints } from "@/hooks/useComplaints";

const TechnicalStats = () => {
  const { data: pcoEquipment = [], isLoading: pcoLoading } = usePCOEquipment();
  const { data: msanEquipment = [], isLoading: msanLoading } = useMSANEquipment();
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();
  const { data: complaints = [], isLoading: complaintsLoading } = useCustomerComplaints();

  // Calculate technical statistics
  const activePCO = pcoEquipment.filter(p => p.status === 'active').length;
  const activeMSAN = msanEquipment.filter(m => m.status === 'active').length;
  const technicalOrders = orders.filter(o => o.feasibility_status === 'rejected' || o.status === 'technical_review').length;
  const criticalIssues = complaints.filter(c => c.priority === 'critical' && c.status === 'open').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="gradient-primary text-white">
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

      <Card className="gradient-secondary text-white">
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

      <Card className="gradient-success text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Études Techniques</CardTitle>
          <Activity className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ordersLoading ? "..." : technicalOrders}
          </div>
          <p className="text-xs opacity-90">
            {ordersLoading ? "Chargement..." : "En cours d'analyse"}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
              Prioritaire
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="gradient-warning text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Incidents Critiques</CardTitle>
          <AlertTriangle className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {complaintsLoading ? "..." : criticalIssues}
          </div>
          <p className="text-xs opacity-90">
            {complaintsLoading ? "Chargement..." : "Intervention requise"}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-200">
              Urgent
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalStats;
