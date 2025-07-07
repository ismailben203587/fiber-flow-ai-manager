
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
    
    // EXCLUSION PRIORITAIRE : Exclure toutes les commandes déjà traitées
    if (order.feasibility_status === 'approved') {
      console.log(`✅ Commande ${order.order_number} déjà approuvée - EXCLUE`);
      return false;
    }
    
    if (order.status === 'rejected' || order.status === 'feasible' || order.status === 'completed') {
      console.log(`❌ Commande ${order.order_number} avec status final - EXCLUE`);
      return false;
    }

    // INCLUSION : Critères pour nécessiter une étude technique
    const needsTechnicalStudy = 
      // Commandes en révision technique (rejetées mais en cours de réévaluation)
      (order.feasibility_status === 'rejected' && order.status === 'technical_review') ||
      // Commandes avec distances importantes
      (order.distance_to_pco && order.distance_to_pco > 2) ||
      (order.distance_to_msan && order.distance_to_msan > 5) ||
      // Commandes en attente sans distances ou avec conditions particulières
      (order.feasibility_status === 'pending' && 
       (!order.distance_to_pco || !order.distance_to_msan)) ||
      (order.feasibility_status === 'pending' && order.status === 'pending');
    
    if (needsTechnicalStudy) {
      console.log(`🔧 Commande ${order.order_number} INCLUSE pour étude technique`);
    } else {
      console.log(`✨ Commande ${order.order_number} ne nécessite pas d'étude - EXCLUE`);
    }
    
    return needsTechnicalStudy;
  });

  console.log(`🎯 Résultat final: ${technicalOrders.length} commandes pour étude technique sur ${orders.length} commandes totales`);
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
      console.log(`✅ Commande ${order.order_number} auto-validée avec succès`);
    } catch (error) {
      console.error(`❌ Erreur auto-validation ${order.order_number}:`, error);
    }
  }
};
