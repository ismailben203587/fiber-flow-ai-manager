
-- Mettre à jour la contrainte de vérification pour inclure le statut 'technical_review'
ALTER TABLE ftth_orders 
DROP CONSTRAINT IF EXISTS ftth_orders_status_check;

ALTER TABLE ftth_orders 
ADD CONSTRAINT ftth_orders_status_check 
CHECK (status IN ('pending', 'feasible', 'technical_review', 'completed', 'rejected'));
