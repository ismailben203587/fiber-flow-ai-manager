
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, MapPin, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { feasibilityService, FeasibilityResult } from "@/services/feasibilityService";
import { useCreateFTTHOrder } from "@/hooks/useOrders";

const FeasibilityAssessment = () => {
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
        description: "Impossible d'évaluer la faisabilité",
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
        status: result.isFeasible ? 'feasible' : 'rejected',
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

      toast({
        title: "Commande créée",
        description: `Commande ${orderNumber} créée avec succès`,
      });

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Évaluation de Faisabilité IA
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
            className="w-full"
          >
            {isAssessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Évaluation en cours...
              </>
            ) : (
              "Lancer l'évaluation IA"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {result?.isFeasible ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : result && !result.isFeasible ? (
              <XCircle className="h-5 w-5 text-red-500" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-gray-400" />
            )}
            Résultat de l'Évaluation
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
                  <span className="text-sm font-medium">Score de Faisabilité</span>
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

              {result.assignedMSAN && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">MSAN Assigné</h4>
                  <p className="text-sm text-gray-600">{result.assignedMSAN.name}</p>
                  <p className="text-xs text-gray-500">
                    Distance: {result.distanceToMSAN?.toFixed(2)} km
                  </p>
                </div>
              )}

              {/* Factors */}
              {result.analysis.factors.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Facteurs Identifiés</h4>
                  <ul className="space-y-1">
                    {result.analysis.factors.map((factor, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                        <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h4 className="font-medium text-sm mb-2">Recommandations</h4>
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
                className="w-full mt-4"
                variant={result.isFeasible ? "default" : "secondary"}
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création...
                  </>
                ) : (
                  `Créer la commande ${result.isFeasible ? "(Faisable)" : "(À étudier)"}`
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeasibilityAssessment;
