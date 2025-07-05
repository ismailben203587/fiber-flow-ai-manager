
import { Badge } from "@/components/ui/badge";
import { AIAnalysis, TechnicalOrder } from './types';

export const StatusBadge = ({ order }: { order: TechnicalOrder }) => {
  if (order.feasibility_status === 'pending') {
    return <Badge className="bg-yellow-100 text-yellow-800">🔍 En analyse</Badge>;
  }
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

export const DistanceBadge = ({ order }: { order: TechnicalOrder }) => {
  const pcoDistance = order.distance_to_pco;
  const msanDistance = order.distance_to_msan;
  
  if (pcoDistance && pcoDistance > 2 || msanDistance && msanDistance > 5) {
    return <Badge className="bg-red-500/20 text-red-200">🔴 Distance Élevée</Badge>;
  }
  if (!pcoDistance || !msanDistance) {
    return <Badge className="bg-orange-500/20 text-orange-200">⚠️ Distance Inconnue</Badge>;
  }
  return <Badge className="bg-blue-500/20 text-blue-200">📏 Distance OK</Badge>;
};

export const RiskBadge = ({ aiAnalysis }: { aiAnalysis: any }) => {
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
