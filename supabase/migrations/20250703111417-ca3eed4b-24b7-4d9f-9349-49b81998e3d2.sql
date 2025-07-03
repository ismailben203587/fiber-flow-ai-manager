
-- Table pour gérer les zones géographiques
CREATE TABLE public.zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  coordinates JSONB, -- Pour stocker les limites géographiques de la zone
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour gérer les techniciens et leurs zones
CREATE TABLE public.technicians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  speciality VARCHAR(100),
  zone_id UUID REFERENCES public.zones(id),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'busy')),
  max_concurrent_tickets INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour l'historique des assignations et notifications
CREATE TABLE public.ticket_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.customer_complaints(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'reassigned', 'completed')),
  notes TEXT
);

-- Table pour suivre les notifications envoyées
CREATE TABLE public.ticket_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES public.customer_complaints(id) ON DELETE CASCADE,
  technician_id UUID REFERENCES public.technicians(id),
  notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('repeated_ticket', 'overdue_ticket', 'assignment')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  message TEXT
);

-- Ajouter des colonnes à la table customer_complaints pour le suivi
ALTER TABLE public.customer_complaints 
ADD COLUMN assigned_technician_id UUID REFERENCES public.technicians(id),
ADD COLUMN client_zone VARCHAR(100),
ADD COLUMN repeat_count INTEGER DEFAULT 0,
ADD COLUMN last_repeat_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours');

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_notifications ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour accès public (pour cette démo)
CREATE POLICY "Public access to zones" ON public.zones FOR ALL USING (true);
CREATE POLICY "Public access to technicians" ON public.technicians FOR ALL USING (true);
CREATE POLICY "Public access to ticket assignments" ON public.ticket_assignments FOR ALL USING (true);
CREATE POLICY "Public access to ticket notifications" ON public.ticket_notifications FOR ALL USING (true);

-- Insérer des données d'exemple pour les zones
INSERT INTO public.zones (name, description, coordinates) VALUES
('Zone Nord Paris', 'Arrondissements 1-10, 17-20', '{"bounds": [{"lat": 48.8566, "lng": 2.3522}, {"lat": 48.8848, "lng": 2.3908}]}'),
('Zone Sud Paris', 'Arrondissements 11-16', '{"bounds": [{"lat": 48.8400, "lng": 2.3200}, {"lat": 48.8566, "lng": 2.3800}]}'),
('Zone Est Paris', 'Banlieue Est', '{"bounds": [{"lat": 48.8200, "lng": 2.3800}, {"lat": 48.8800, "lng": 2.4500}]}'),
('Zone Ouest Paris', 'Banlieue Ouest', '{"bounds": [{"lat": 48.8200, "lng": 2.2500}, {"lat": 48.8800, "lng": 2.3200}]}');

-- Insérer des techniciens d'exemple avec leurs zones
INSERT INTO public.technicians (name, email, phone, speciality, zone_id, status, max_concurrent_tickets) 
SELECT 
  t.name, 
  t.email, 
  t.phone, 
  t.speciality, 
  z.id, 
  'active', 
  5
FROM (VALUES 
  ('Marc Technicien', 'marc@smarttelecom.fr', '0123456789', 'Réparation'),
  ('Sophie Tech', 'sophie@smarttelecom.fr', '0123456790', 'Installation'),
  ('Paul Installateur', 'paul@smarttelecom.fr', '0123456791', 'Installation'),
  ('Alice Maintenance', 'alice@smarttelecom.fr', '0123456792', 'Maintenance')
) AS t(name, email, phone, speciality)
CROSS JOIN (SELECT id FROM public.zones ORDER BY created_at LIMIT 1) z;

-- Fonction pour détecter la zone d'un client basée sur son adresse
CREATE OR REPLACE FUNCTION public.detect_client_zone(client_address TEXT)
RETURNS TEXT AS $$
DECLARE
  detected_zone TEXT;
BEGIN
  -- Logique simple basée sur les mots-clés dans l'adresse
  -- Dans un vrai système, on utiliserait une API de géocodage
  IF client_address ILIKE '%75001%' OR client_address ILIKE '%75002%' OR client_address ILIKE '%75003%' OR 
     client_address ILIKE '%75004%' OR client_address ILIKE '%75005%' OR client_address ILIKE '%75006%' OR
     client_address ILIKE '%75007%' OR client_address ILIKE '%75008%' OR client_address ILIKE '%75009%' OR
     client_address ILIKE '%75010%' OR client_address ILIKE '%75017%' OR client_address ILIKE '%75018%' OR
     client_address ILIKE '%75019%' OR client_address ILIKE '%75020%' THEN
    detected_zone := 'Zone Nord Paris';
  ELSIF client_address ILIKE '%75011%' OR client_address ILIKE '%75012%' OR client_address ILIKE '%75013%' OR
        client_address ILIKE '%75014%' OR client_address ILIKE '%75015%' OR client_address ILIKE '%75016%' THEN
    detected_zone := 'Zone Sud Paris';
  ELSIF client_address ILIKE '%Vincennes%' OR client_address ILIKE '%Fontenay%' OR client_address ILIKE '%Montreuil%' THEN
    detected_zone := 'Zone Est Paris';
  ELSIF client_address ILIKE '%Neuilly%' OR client_address ILIKE '%Boulogne%' OR client_address ILIKE '%Levallois%' THEN
    detected_zone := 'Zone Ouest Paris';
  ELSE
    detected_zone := 'Zone Nord Paris'; -- Zone par défaut
  END IF;
  
  RETURN detected_zone;
END;
$$ LANGUAGE plpgsql;

-- Fonction AI pour assigner automatiquement un technicien
CREATE OR REPLACE FUNCTION public.ai_assign_technician(
  complaint_id UUID,
  complaint_type TEXT,
  priority TEXT,
  client_address TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  selected_technician_id UUID;
  client_zone_name TEXT;
  zone_id UUID;
BEGIN
  -- Détecter la zone du client
  IF client_address IS NOT NULL THEN
    client_zone_name := public.detect_client_zone(client_address);
  ELSE
    client_zone_name := 'Zone Nord Paris'; -- Zone par défaut
  END IF;
  
  -- Obtenir l'ID de la zone
  SELECT id INTO zone_id FROM public.zones WHERE name = client_zone_name LIMIT 1;
  
  -- Sélectionner le technicien optimal basé sur :
  -- 1. Zone géographique
  -- 2. Spécialité appropriée
  -- 3. Charge de travail actuelle
  -- 4. Statut actif
  SELECT t.id INTO selected_technician_id
  FROM public.technicians t
  LEFT JOIN (
    SELECT assigned_technician_id, COUNT(*) as active_tickets
    FROM public.customer_complaints 
    WHERE status IN ('open', 'in_progress')
    GROUP BY assigned_technician_id
  ) active ON t.id = active.assigned_technician_id
  WHERE t.zone_id = zone_id
    AND t.status = 'active'
    AND (
      (complaint_type ILIKE '%installation%' AND t.speciality = 'Installation') OR
      (complaint_type ILIKE '%panne%' AND t.speciality = 'Réparation') OR
      (complaint_type ILIKE '%maintenance%' AND t.speciality = 'Maintenance') OR
      t.speciality = 'Réparation' -- Réparation comme spécialité générale
    )
    AND COALESCE(active.active_tickets, 0) < t.max_concurrent_tickets
  ORDER BY 
    COALESCE(active.active_tickets, 0) ASC, -- Moins chargé en premier
    CASE priority 
      WHEN 'critical' THEN 1 
      WHEN 'high' THEN 2 
      WHEN 'medium' THEN 3 
      ELSE 4 
    END ASC
  LIMIT 1;
  
  -- Si aucun technicien spécialisé disponible, prendre le moins chargé de la zone
  IF selected_technician_id IS NULL THEN
    SELECT t.id INTO selected_technician_id
    FROM public.technicians t
    LEFT JOIN (
      SELECT assigned_technician_id, COUNT(*) as active_tickets
      FROM public.customer_complaints 
      WHERE status IN ('open', 'in_progress')
      GROUP BY assigned_technician_id
    ) active ON t.id = active.assigned_technician_id
    WHERE t.zone_id = zone_id
      AND t.status = 'active'
      AND COALESCE(active.active_tickets, 0) < t.max_concurrent_tickets
    ORDER BY COALESCE(active.active_tickets, 0) ASC
    LIMIT 1;
  END IF;
  
  -- Mettre à jour la zone du client dans le ticket
  UPDATE public.customer_complaints 
  SET client_zone = client_zone_name
  WHERE id = complaint_id;
  
  RETURN selected_technician_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour détecter les tickets répétés
CREATE OR REPLACE FUNCTION public.detect_repeated_tickets()
RETURNS VOID AS $$
DECLARE
  ticket_record RECORD;
BEGIN
  -- Chercher les tickets similaires (même client, même type de problème)
  FOR ticket_record IN
    SELECT 
      cc1.id,
      cc1.client_name,
      cc1.complaint_type,
      COUNT(cc2.id) as repeat_count
    FROM public.customer_complaints cc1
    JOIN public.customer_complaints cc2 ON (
      cc1.client_name = cc2.client_name 
      AND cc1.complaint_type = cc2.complaint_type
      AND cc1.id != cc2.id
      AND cc2.created_at >= (NOW() - INTERVAL '30 days')
    )
    WHERE cc1.status IN ('open', 'in_progress')
    GROUP BY cc1.id, cc1.client_name, cc1.complaint_type
    HAVING COUNT(cc2.id) >= 2
  LOOP
    -- Mettre à jour le compteur de répétition
    UPDATE public.customer_complaints 
    SET 
      repeat_count = ticket_record.repeat_count,
      last_repeat_date = NOW()
    WHERE id = ticket_record.id;
    
    -- Créer une notification pour le technicien assigné
    INSERT INTO public.ticket_notifications (complaint_id, technician_id, notification_type, message)
    SELECT 
      ticket_record.id,
      cc.assigned_technician_id,
      'repeated_ticket',
      'Ticket répété ' || ticket_record.repeat_count || ' fois pour le client ' || ticket_record.client_name
    FROM public.customer_complaints cc
    WHERE cc.id = ticket_record.id AND cc.assigned_technician_id IS NOT NULL;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour détecter les tickets en retard
CREATE OR REPLACE FUNCTION public.detect_overdue_tickets()
RETURNS VOID AS $$
BEGIN
  -- Insérer des notifications pour les tickets qui approchent ou dépassent 24h
  INSERT INTO public.ticket_notifications (complaint_id, technician_id, notification_type, message)
  SELECT 
    cc.id,
    cc.assigned_technician_id,
    'overdue_ticket',
    'Ticket ' || cc.complaint_number || ' en retard - Créé il y a ' || 
    EXTRACT(EPOCH FROM (NOW() - cc.created_at))/3600 || ' heures'
  FROM public.customer_complaints cc
  WHERE cc.status IN ('open', 'in_progress')
    AND cc.assigned_technician_id IS NOT NULL
    AND cc.created_at < (NOW() - INTERVAL '24 hours')
    AND NOT EXISTS (
      SELECT 1 FROM public.ticket_notifications tn 
      WHERE tn.complaint_id = cc.id 
        AND tn.notification_type = 'overdue_ticket'
        AND tn.sent_at > (NOW() - INTERVAL '12 hours')
    );
END;
$$ LANGUAGE plpgsql;
