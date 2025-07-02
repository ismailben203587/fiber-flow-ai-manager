
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
      <Card className="bg-slate-800/50 border-blue-600/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Équipements PCO</CardTitle>
          <Network className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-100">
            {pcoLoading ? "..." : activePCO}
          </div>
          <p className="text-xs text-blue-300">
            {pcoLoading ? "Chargement..." : `${activePCO} actifs sur ${pcoEquipment.length} total`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-blue-600/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-200">Équipements MSAN</CardTitle>
          <Router className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-100">
            {msanLoading ? "..." : activeMSAN}
          </div>
          <p className="text-xs text-blue-300">
            {msanLoading ? "Chargement..." : `${activeMSAN} actifs sur ${msanEquipment.length} total`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-orange-600/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-200">Études Techniques</CardTitle>
          <Activity className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-100">
            {ordersLoading ? "..." : technicalOrders}
          </div>
          <p className="text-xs text-orange-300">
            {ordersLoading ? "Chargement..." : "En cours d'analyse"}
          </p>
          <div className="flex gap-1 mt-2">
            <Badge variant="secondary" className="text-xs bg-orange-500/20 text-orange-200">
              Prioritaire
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800/50 border-red-600/20 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-200">Incidents Critiques</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-100">
            {complaintsLoading ? "..." : criticalIssues}
          </div>
          <p className="text-xs text-red-300">
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
