
import { TechnicalOrder } from './types';

export const filterTechnicalOrders = (orders: any[]): TechnicalOrder[] => {
  console.log('📋 Toutes les commandes:', orders);

  // Filtrer les commandes nécessitant une étude technique
  const technicalOrders = orders.filter(order => {
    console.log(`🔍 Vérification commande ${order.order_number}:`, {
      feasibility_status: order.feasibility_status,
      status: order.status,
      distance_to_pco: order.distance_to_pco,
      distance_to_msan: order.distance_to_msan
    });
    
    // Exclure les commandes déjà traitées (approuvées ou avec status final)
    if (order.feasibility_status === 'approved') {
      console.log(`✅ Commande ${order.order_number} déjà approuvée - exclue`);
      return false;
    }
    
    if (order.status === 'rejected' || order.status === 'feasible' || order.status === 'completed') {
      console.log(`❌ Commande ${order.order_number} avec status final - exclue`);
      return false;
    }
    
    // NE PAS auto-valider ici - les commandes faisables doivent rester en attente
    // pour être traitées par l'équipe technique si nécessaire
    
    // Critères pour nécessiter une étude technique:
    // 1. Commandes en révision technique (rejetées mais en cours de réévaluation)
    // 2. Commandes avec distances importantes (> 2km pour PCO ou > 5km pour MSAN)
    // 3. Commandes sans distances calculées (nécessitent analyse)
    // 4. Commandes en attente avec des conditions particulières
    const needsTechnicalStudy = 
      (order.feasibility_status === 'rejected' && order.status === 'technical_review') ||
      (order.distance_to_pco && order.distance_to_pco > 2) ||
      (order.distance_to_msan && order.distance_to_msan > 5) ||
      (order.feasibility_status === 'pending' && 
       (!order.distance_to_pco || !order.distance_to_msan)) ||
      (order.feasibility_status === 'pending' && order.status === 'pending');
    
    console.log(`📏 Commande ${order.order_number} nécessite étude:`, needsTechnicalStudy);
    return needsTechnicalStudy;
  });

  console.log('🔧 Commandes pour étude technique:', technicalOrders);
  return technicalOrders;
};

// Fonction pour l'auto-validation des commandes faisables
export const autoValidateFeasibleOrders = async (orders: any[], updateOrderCallback: (id: string, updates: any) => Promise<void>) => {
  const feasibleOrders = orders.filter(order => 
    order.feasibility_status === 'pending' && 
    order.distance_to_pco && order.distance_to_msan &&
    order.distance_to_pco <= 2 && order.distance_to_msan <= 5 &&
    order.status === 'pending'
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
