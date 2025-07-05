
import { TechnicalOrder, AIAnalysis } from './types';
import { StatusBadge, DistanceBadge, RiskBadge } from './OrderBadges';
import { AIAnalysisSection } from './AIAnalysisSection';
import { OrderActions } from './OrderActions';

interface OrderCardProps {
  order: TechnicalOrder;
  onApprove: (orderId: string) => void;
  onReject: (orderId: string) => void;
  isUpdating: boolean;
}

const parseAIAnalysis = (aiAnalysis: any): AIAnalysis | null => {
  if (!aiAnalysis || typeof aiAnalysis !== 'object') return null;
  return aiAnalysis as AIAnalysis;
};

export const OrderCard = ({ order, onApprove, onReject, isUpdating }: OrderCardProps) => {
  const aiAnalysis = parseAIAnalysis(order.ai_analysis);

  return (
    <div className="bg-slate-700/50 border border-slate-600/50 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-semibold text-blue-100">{order.order_number}</h3>
            <StatusBadge order={order} />
            <DistanceBadge order={order} />
            <RiskBadge aiAnalysis={order.ai_analysis} />
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
              {order.client_cin && (
                <p className="text-blue-300">
                  <strong>CIN:</strong> {order.client_cin}
                </p>
              )}
            </div>
            
            <div>
              {order.client_number && (
                <p className="text-blue-300">
                  <strong>N° Client:</strong> {order.client_number}
                </p>
              )}
              {order.voip_number && (
                <p className="text-blue-300">
                  <strong>VOIP:</strong> {order.voip_number}
                </p>
              )}
              {order.distance_to_pco && (
                <p className="text-blue-300">
                  <strong>Distance PCO:</strong> {order.distance_to_pco.toFixed(2)} km
                  {order.distance_to_pco > 2 && <span className="text-red-300"> ⚠️</span>}
                </p>
              )}
              {order.distance_to_msan && (
                <p className="text-blue-300">
                  <strong>Distance MSAN:</strong> {order.distance_to_msan.toFixed(2)} km
                  {order.distance_to_msan > 5 && <span className="text-red-300"> ⚠️</span>}
                </p>
              )}
              {aiAnalysis?.score && (
                <p className="text-blue-300">
                  <strong>Score IA:</strong> {aiAnalysis.score}/100
                </p>
              )}
            </div>
          </div>

          <AIAnalysisSection aiAnalysis={aiAnalysis} />
        </div>
      </div>

      <OrderActions 
        orderId={order.id}
        onApprove={onApprove}
        onReject={onReject}
        isUpdating={isUpdating}
      />
    </div>
  );
};
