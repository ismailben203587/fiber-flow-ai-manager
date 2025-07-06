
import { TechnicalOrder } from './types';

export const filterTechnicalOrders = (orders: any[]): TechnicalOrder[] => {
  console.log('📋 Toutes les commandes:', orders);

  // Filtrer les commandes nécessitant une étude technique basée sur la distance
  const technicalOrders = orders.filter(order => {
    console.log(`🔍 Vérification commande ${order.order_number}:`, {
      feasibility_status: order.feasibility_status,
      status: order.status,
      distance_to_pco: order.distance_to_pco,
      distance_to_msan: order.distance_to_msan
    });
    
    // Auto-validation des commandes faisables :
    // Si les distances sont calculées et acceptables, marquer comme faisable automatiquement
    if (order.feasibility_status === 'pending' && 
        order.distance_to_pco && order.distance_to_msan &&
        order.distance_to_pco <= 2 && order.distance_to_msan <= 5) {
      console.log(`✅ Commande ${order.order_number} automatiquement faisable`);
      // Cette commande sera validée automatiquement par le système
      return false; // Ne pas l'envoyer vers l'équipe technique
    }
    
    // Critères pour nécessiter une étude technique:
    // 1. Commandes rejetées qui nécessitent une révision technique
    // 2. Commandes en révision technique
    // 3. Commandes avec distances importantes (> 2km pour PCO ou > 5km pour MSAN)
    // 4. Commandes sans distances calculées (nécessitent analyse)
    const needsTechnicalStudy = 
      order.feasibility_status === 'rejected' || 
      order.status === 'technical_review' ||
      (order.distance_to_pco && order.distance_to_pco > 2) ||
      (order.distance_to_msan && order.distance_to_msan > 5) ||
      (order.feasibility_status === 'pending' && 
       (!order.distance_to_pco || !order.distance_to_msan));
    
    console.log(`📏 Commande ${order.order_number} nécessite étude:`, needsTechnicalStudy);
    return needsTechnicalStudy;
  });

  console.log('🔧 Commandes pour étude technique:', technicalOrders);
  return technicalOrders;
};

// Nouvelle fonction pour l'auto-validation des commandes faisables
export const autoValidateFeasibleOrders = async (orders: any[], updateOrderCallback: (id: string, updates: any) => Promise<void>) => {
  const feasibleOrders = orders.filter(order => 
    order.feasibility_status === 'pending' && 
    order.distance_to_pco && order.distance_to_msan &&
    order.distance_to_pco <= 2 && order.distance_to_msan <= 5
  );

  console.log(`🚀 Auto-validation de ${feasibleOrders.length} commandes faisables`);

  for (const order of feasibleOrders) {
    try {
      await updateOrderCallback(order.id, {
        feasibility_status: 'approved',
        status: 'feasible',
        ai_analysis: {
          score: 95,
          riskLevel: 'low',
          factors: ['Distances optimales', 'Équipements disponibles'],
          recommendations: ['Commande automatiquement validée', 'Installation programmable']
        }
      });
      console.log(`✅ Commande ${order.order_number} auto-validée`);
    } catch (error) {
      console.error(`❌ Erreur auto-validation ${order.order_number}:`, error);
    }
  }
};
