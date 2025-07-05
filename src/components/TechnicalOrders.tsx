
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { useFTTHOrders, useUpdateFTTHOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";
import { filterTechnicalOrders } from "./technical-orders/utils";
import { OrderCard } from "./technical-orders/OrderCard";

const TechnicalOrders = () => {
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();
  const updateOrder = useUpdateFTTHOrder();
  const { toast } = useToast();

  const technicalOrders = filterTechnicalOrders(orders);

  const handleApproveOrder = async (orderId: string) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        feasibility_status: 'approved',
        status: 'feasible'
      });
      
      toast({
        title: "✅ Commande approuvée",
        description: "L'étude technique a validé la faisabilité",
      });
    } catch (error) {
      console.error('Erreur approbation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await updateOrder.mutateAsync({
        id: orderId,
        feasibility_status: 'rejected',
        status: 'rejected'
      });
      
      toast({
        title: "❌ Commande rejetée",
        description: "L'étude technique a confirmé la non-faisabilité",
      });
    } catch (error) {
      console.error('Erreur rejet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-orange-600/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            Commandes Nécessitant une Étude Technique
            <Badge variant="outline" className="ml-2">
              {technicalOrders.length} commande(s)
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-8 text-blue-200">Chargement des commandes...</div>
          ) : technicalOrders.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-blue-300 mb-4">
                Aucune commande nécessitant une étude technique
              </div>
              <div className="text-sm text-blue-400">
                Total des commandes: {orders.length}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {technicalOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onApprove={handleApproveOrder}
                  onReject={handleRejectOrder}
                  isUpdating={updateOrder.isPending}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalOrders;
