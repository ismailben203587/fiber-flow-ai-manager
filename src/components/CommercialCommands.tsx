
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, CheckCircle, XCircle, AlertTriangle, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { feasibilityService, FeasibilityResult } from "@/services/feasibilityService";
import { useCreateFTTHOrder, useFTTHOrders } from "@/hooks/useOrders";

const CommercialCommands = () => {
  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<FeasibilityResult | null>(null);
  const [formData, setFormData] = useState({
    clientName: "",
    clientAddress: "",
    clientPhone: "",
    clientEmail: "",
  });

  const { toast } = useToast();
  const createOrder = useCreateFTTHOrder();
  const { data: orders = [], isLoading: ordersLoading } = useFTTHOrders();

  const handleAssessment = async () => {
    if (!formData.clientName || !formData.clientAddress) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir au moins le nom et l'adresse du client",
        variant: "destructive",
      });
      return;
    }

    setIsAssessing(true);
    try {
      console.log('🚀 Lancement de l\'évaluation IA...');
      const assessmentResult = await feasibilityService.assessFeasibility(formData.clientAddress);
      setResult(assessmentResult);
      
      toast({
        title: "Évaluation terminée",
        description: `Faisabilité: ${assessmentResult.isFeasible ? "✅ Possible" : "❌ Non recommandée"}`,
      });
    } catch (error) {
      console.error('❌ Erreur lors de l\'évaluation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'évaluer la faisibilité",
        variant: "destructive",
      });
    } finally {
      setIsAssessing(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!result) return;

    try {
      const orderNumber = `FTTH-${Date.now()}`;
      
      await createOrder.mutateAsync({
        order_number: orderNumber,
        client_name: formData.clientName,
        client_address: formData.clientAddress,
        client_phone: formData.clientPhone || null,
        client_email: formData.clientEmail || null,
        feasibility_status: result.isFeasible ? 'approved' : 'rejected',
        status: result.isFeasible ? 'feasible' : 'technical_review',
        assigned_pco_id: result.assignedPCO?.id || null,
        assigned_msan_id: result.assignedMSAN?.id || null,
        distance_to_pco: result.distanceToPCO,
        distance_to_msan: result.distanceToMSAN,
        ai_analysis: result.analysis,
        feasibility_report: {
          assessment_date: new Date().toISOString(),
          ai_score: result.analysis.score,
          factors: result.analysis.factors,
          recommendations: result.analysis.recommendations,
          risk_level: result.analysis.riskLevel,
        },
      });

      // Si le résultat est négatif, notification automatique vers l'équipe technique
      if (!result.isFeasible) {
        toast({
          title: "🔧 Transfert vers l'équipe technique",
          description: `Commande ${orderNumber} transférée pour étude approfondie`,
          variant: "default",
        });
      } else {
        toast({
          title: "✅ Commande approuvée",
          description: `Commande ${orderNumber} prête pour installation`,
        });
      }

      // Reset form
      setFormData({ clientName: "", clientAddress: "", clientPhone: "", clientEmail: "" });
      setResult(null);
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'feasible':
        return <Badge className="bg-green-100 text-green-800">Faisable</Badge>;
      case 'technical_review':
        return <Badge className="bg-blue-100 text-blue-800">Étude technique</Badge>;
      case 'completed':
        return <Badge className="bg-emerald-100 text-emerald-800">Terminée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return <Badge className="bg-green-500">Risque Faible</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Risque Modéré</Badge>;
      case 'high':
        return <Badge variant="destructive">Risque Élevé</Badge>;
      default:
        return <Badge variant="secondary">Non évalué</Badge>;
    }
  };

  return (
    <Tabs defaultValue="new-order" className="space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-emerald-50">
        <TabsTrigger value="new-order" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Commande
        </TabsTrigger>
        <TabsTrigger value="orders-list" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
          <Search className="h-4 w-4 mr-2" />
          Liste des Commandes
        </TabsTrigger>
      </TabsList>

      <TabsContent value="new-order" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulaire de commande avec IA intégrée */}
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-700">
                <MapPin className="h-5 w-5" />
                Nouvelle Commande FTTH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Nom complet du client"
                />
              </div>
              
              <div>
                <Label htmlFor="clientAddress">Adresse d'installation *</Label>
                <Input
                  id="clientAddress"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  placeholder="Adresse complète (rue, ville, code postal)"
                />
              </div>

              <div>
                <Label htmlFor="clientPhone">Téléphone</Label>
                <Input
                  id="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="Numéro de téléphone"
                />
              </div>

              <div>
                <Label htmlFor="clientEmail">Email</Label>
                <Input
                  id="clientEmail"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="Adresse email"
                  type="email"
                />
              </div>

              <Button 
                onClick={handleAssessment}
                disabled={isAssessing}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isAssessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Évaluation IA en cours...
                  </>
                ) : (
                  "Lancer l'évaluation IA"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Résultats IA */}
          <Card className="border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                {result?.isFeasible ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : result && !result.isFeasible ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                )}
                Résultat de l'Évaluation IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!result ? (
                <div className="text-center text-gray-500 py-8">
                  Lancez une évaluation pour voir les résultats
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Score */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Score IA</span>
                      <span className="text-sm text-gray-500">{result.analysis.score}/100</span>
                    </div>
                    <Progress value={result.analysis.score} className="h-2" />
                  </div>

                  {/* Risk Level */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Niveau de Risque</span>
                    {getRiskBadge(result.analysis.riskLevel)}
                  </div>

                  {/* Equipment Assignment */}
                  {result.assignedPCO && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm mb-1">PCO Assigné</h4>
                      <p className="text-sm text-gray-600">{result.assignedPCO.name}</p>
                      <p className="text-xs text-gray-500">
                        Distance: {result.distanceToPCO?.toFixed(2)} km
                      </p>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recommandations IA</h4>
                    <ul className="space-y-1">
                      {result.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={handleCreateOrder}
                    disabled={createOrder.isPending}
                    className={`w-full mt-4 ${result.isFeasible ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {createOrder.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : result.isFeasible ? (
                      "✅ Créer commande (Approuvée)"
                    ) : (
                      "🔧 Transférer vers équipe technique"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="orders-list" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-emerald-700">Liste des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordersLoading ? (
                <div className="text-center py-8">Chargement des commandes...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune commande trouvée</div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">{order.order_number}</p>
                          <p className="text-sm text-gray-600">{order.client_name}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{order.client_address}</p>
                          <p className="text-xs text-gray-500">Créée le {new Date(order.created_at!).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status!)}
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CommercialCommands;
