
-- Table pour stocker les équipements PCO (Point de Concentration Optique)
CREATE TABLE public.pco_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  capacity INTEGER NOT NULL DEFAULT 0,
  used_capacity INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les équipements MSAN (Multi-Service Access Node)
CREATE TABLE public.msan_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  capacity INTEGER NOT NULL DEFAULT 0,
  used_capacity INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour stocker les commandes avec leur statut de faisabilité
CREATE TABLE public.ftth_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(200) NOT NULL,
  client_address TEXT NOT NULL,
  client_phone VARCHAR(20),
  client_email VARCHAR(100),
  service_type VARCHAR(20) DEFAULT 'FTTH',
  status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'feasible', 'rejected', 'in_progress', 'completed')),
  feasibility_status VARCHAR(30) DEFAULT 'pending' CHECK (feasibility_status IN ('pending', 'approved', 'rejected', 'in_progress')),
  feasibility_report JSONB,
  assigned_pco_id UUID REFERENCES public.pco_equipment(id),
  assigned_msan_id UUID REFERENCES public.msan_equipment(id),
  distance_to_pco DECIMAL(8, 2),
  distance_to_msan DECIMAL(8, 2),
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table pour les réclamations clients
CREATE TABLE public.customer_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number VARCHAR(50) UNIQUE NOT NULL,
  client_name VARCHAR(200) NOT NULL,
  complaint_type VARCHAR(100) NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS sur toutes les tables
ALTER TABLE public.pco_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.msan_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ftth_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_complaints ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour accès public (pour cette démo)
CREATE POLICY "Public access to PCO equipment" ON public.pco_equipment FOR ALL USING (true);
CREATE POLICY "Public access to MSAN equipment" ON public.msan_equipment FOR ALL USING (true);
CREATE POLICY "Public access to FTTH orders" ON public.ftth_orders FOR ALL USING (true);
CREATE POLICY "Public access to customer complaints" ON public.customer_complaints FOR ALL USING (true);

-- Insérer des données d'exemple pour PCO
INSERT INTO public.pco_equipment (name, address, latitude, longitude, capacity, used_capacity, status) VALUES
('PCO-75012-01', '15 Rue de la Paix, 75012 Paris', 48.8566, 2.3522, 100, 75, 'active'),
('PCO-75012-02', '22 Avenue Victor Hugo, 75012 Paris', 48.8584, 2.3545, 150, 120, 'active'),
('PCO-69003-01', '8 Boulevard Saint-Germain, 69003 Lyon', 45.7578, 4.8320, 120, 90, 'active'),
('PCO-31000-01', '45 Rue de Rivoli, 31000 Toulouse', 43.6047, 1.4442, 80, 60, 'active');

-- Insérer des données d'exemple pour MSAN
INSERT INTO public.msan_equipment (name, address, latitude, longitude, capacity, used_capacity, status) VALUES
('MSAN-75012-01', '10 Rue de la République, 75012 Paris', 48.8575, 2.3530, 200, 150, 'active'),
('MSAN-75012-02', '30 Avenue des Champs, 75012 Paris', 48.8590, 2.3550, 250, 180, 'active'),
('MSAN-69003-01', '12 Place Bellecour, 69003 Lyon', 45.7580, 4.8325, 180, 140, 'active'),
('MSAN-31000-01', '25 Place du Capitole, 31000 Toulouse', 43.6043, 1.4437, 160, 120, 'active');

-- Fonction pour calculer la distance entre deux points (formule de Haversine)
CREATE OR REPLACE FUNCTION public.calculate_distance(
  lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  R DECIMAL := 6371; -- Rayon de la Terre en km
  dLat DECIMAL;
  dLon DECIMAL;
  a DECIMAL;
  c DECIMAL;
  distance DECIMAL;
BEGIN
  dLat := RADIANS(lat2 - lat1);
  dLon := RADIANS(lon2 - lon1);
  
  a := SIN(dLat/2) * SIN(dLat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dLon/2) * SIN(dLon/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  distance := R * c;
  
  RETURN distance;
END;
$$ LANGUAGE plpgsql;
