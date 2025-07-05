
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
