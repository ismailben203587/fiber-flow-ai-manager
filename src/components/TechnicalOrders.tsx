
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye, CheckCircle, XCircle } from "lucide-react";
import { useFTTHOrders, useUpdateFTTHOrder } from "@/hooks/useOrders";
import { useToast } from "@/hooks/use-toast";

// Type for AI Analysis structure
interface AIAnalysis {
  score?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  factors?: string[];
  recommendations?: string[];
}

const TechnicalOrders = () => {
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();
  const updateOrder = useUpdateFTTHOrder();
  const { toast } = useToast();

  // Filtrer les commandes nécessitant une étude technique
  const technicalOrders = orders.filter(order => 
    order.feasibility_status === 'rejected' || 
    order.status === 'technical_review'
  );

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
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (order: any) => {
    if (order.feasibility_status === 'rejected' && order.status === 'technical_review') {
      return <Badge className="bg-orange-100 text-orange-800">🔧 Étude en cours</Badge>;
    }
    if (order.feasibility_status === 'approved') {
      return <Badge className="bg-green-100 text-green-800">✅ Approuvée</Badge>;
    }
    if (order.status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">❌ Rejetée</Badge>;
    }
    return <Badge variant="outline">En attente</Badge>;
  };

  const getRiskBadge = (aiAnalysis: any) => {
    if (!aiAnalysis || typeof aiAnalysis !== 'object') return null;
    
    const analysis = aiAnalysis as AIAnalysis;
    const riskLevel = analysis.riskLevel;
    switch (riskLevel) {
      case 'low':
        return <Badge className="bg-green-500/20 text-green-200">Risque Faible</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-200">Risque Modéré</Badge>;
      case 'high':
        return <Badge className="bg-red-500/20 text-red-200">Risque Élevé</Badge>;
      default:
        return null;
    }
  };

  const parseAIAnalysis = (aiAnalysis: any): AIAnalysis | null => {
    if (!aiAnalysis || typeof aiAnalysis !== 'object') return null;
    return aiAnalysis as AIAnalysis;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-orange-600/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-200">
            <AlertTriangle className="h-5 w-5" />
            Commandes Nécessitant une Étude Technique
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="text-center py-8 text-blue-200">Chargement des commandes...</div>
          ) : technicalOrders.length === 0 ? (
            <div className="text-center py-8 text-blue-300">
              Aucune commande en attente d'étude technique
            </div>
          ) : (
            <div className="space-y-4">
              {technicalOrders.map((order) => {
                const aiAnalysis = parseAIAnalysis(order.ai_analysis);
                
                return (
                  <div key={order.id} className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold text-blue-100">{order.order_number}</h3>
                          {getStatusBadge(order)}
                          {getRiskBadge(order.ai_analysis)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-blue-200">
                              <strong>Client:</strong> {order.client_name}
                            </p>
                            <p className="text-blue-300">
                              <strong>Adresse:</strong> {order.client_address}
                            </p>
                            {order.client_phone && (
                              <p className="text-blue-300">
                                <strong>Téléphone:</strong> {order.client_phone}
                              </p>
                            )}
                          </div>
                          
                          <div>
                            {order.distance_to_pco && (
                              <p className="text-blue-300">
                                <strong>Distance PCO:</strong> {order.distance_to_pco.toFixed(2)} km
                              </p>
                            )}
                            {order.distance_to_msan && (
                              <p className="text-blue-300">
                                <strong>Distance MSAN:</strong> {order.distance_to_msan.toFixed(2)} km
                              </p>
                            )}
                            {aiAnalysis?.score && (
                              <p className="text-blue-300">
                                <strong>Score IA:</strong> {aiAnalysis.score}/100
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Analyse IA */}
                        {aiAnalysis && (
                          <div className="mt-4 p-3 bg-slate-600/30 rounded border border-slate-500/30">
                            <h4 className="font-medium text-blue-200 mb-2">Analyse IA</h4>
                            
                            {aiAnalysis.factors && aiAnalysis.factors.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-medium text-yellow-200 mb-1">Facteurs identifiés:</p>
                                <ul className="space-y-1">
                                  {aiAnalysis.factors.map((factor: string, index: number) => (
                                    <li key={index} className="text-xs text-yellow-300 flex items-start gap-1">
                                      <AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                                      {factor}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-green-200 mb-1">Recommandations:</p>
                                <ul className="space-y-1">
                                  {aiAnalysis.recommendations.map((rec: string, index: number) => (
                                    <li key={index} className="text-xs text-green-300 flex items-start gap-1">
                                      <CheckCircle className="h-3 w-3 text-green-400 mt-0.5 flex-shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 pt-4 border-t border-slate-600/50">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600/20 text-blue-200 hover:bg-blue-600/20"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                      
                      <Button
                        onClick={() => handleApproveOrder(order.id)}
                        disabled={updateOrder.isPending}
                        size="sm"
                        className="bg-green-600/20 hover:bg-green-600/30 text-green-200 border-green-600/20"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approuver
                      </Button>
                      
                      <Button
                        onClick={() => handleRejectOrder(order.id)}
                        disabled={updateOrder.isPending}
                        variant="destructive"
                        size="sm"
                        className="bg-red-600/20 hover:bg-red-600/30 text-red-200 border-red-600/20"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalOrders;
