-- Créer les utilisateurs de démonstration avec leurs mots de passe
-- Note: Ces utilisateurs doivent être créés via l'interface Supabase Auth ou via l'API
-- Ici nous préparons les profils et rôles pour ces utilisateurs

-- Insérer les profils des utilisateurs de démonstration
-- Les IDs sont générés de manière déterministe pour la démonstration
INSERT INTO public.profiles (id, email, full_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@ftth.ma', 'Neural Admin'),
  ('22222222-2222-2222-2222-222222222222', 'commercial@ftth.ma', 'Commerce AI'),
  ('33333333-3333-3333-3333-333333333333', 'tech@ftth.ma', 'Tech Matrix'),
  ('44444444-4444-4444-4444-444444444444', 'supervisor@ftth.ma', 'Cyber Supervisor')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  updated_at = now();

-- Insérer les rôles des utilisateurs de démonstration
INSERT INTO public.user_roles (user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'commercial'),
  ('33333333-3333-3333-3333-333333333333', 'tech'),
  ('44444444-4444-4444-4444-444444444444', 'technicien')
ON CONFLICT (user_id, role) DO NOTHING;

-- Créer quelques zones de démonstration si elles n'existent pas
INSERT INTO public.zones (name, description) VALUES
  ('Zone Nord Paris', 'Zone de démonstration Nord Paris'),
  ('Zone Sud Paris', 'Zone de démonstration Sud Paris'),
  ('Zone Est Paris', 'Zone de démonstration Est Paris'),
  ('Zone Ouest Paris', 'Zone de démonstration Ouest Paris')
ON CONFLICT DO NOTHING;

-- Créer quelques techniciens de démonstration
INSERT INTO public.technicians (name, email, speciality, zone_id, status) 
SELECT 
  'Technicien ' || z.name,
  'tech.' || LOWER(REPLACE(z.name, ' ', '.')) || '@ftth.ma',
  'Réparation',
  z.id,
  'active'
FROM public.zones z
WHERE NOT EXISTS (
  SELECT 1 FROM public.technicians t WHERE t.email = 'tech.' || LOWER(REPLACE(z.name, ' ', '.')) || '@ftth.ma'
);

-- Créer des données de démonstration pour les équipements MSAN
INSERT INTO public.msan_equipment (name, address, capacity, used_capacity, latitude, longitude) VALUES
  ('MSAN-PARIS-01', '123 Rue de Rivoli, 75001 Paris', 1000, 450, 48.8566, 2.3522),
  ('MSAN-PARIS-02', '456 Avenue des Champs-Élysées, 75008 Paris', 800, 320, 48.8738, 2.2950),
  ('MSAN-PARIS-03', '789 Boulevard Saint-Germain, 75006 Paris', 1200, 600, 48.8537, 2.3374)
ON CONFLICT DO NOTHING;

-- Créer des données de démonstration pour les équipements PCO
INSERT INTO public.pco_equipment (name, address, capacity, used_capacity, latitude, longitude) VALUES
  ('PCO-NORD-01', '12 Rue du Faubourg Saint-Denis, 75010 Paris', 500, 200, 48.8705, 2.3544),
  ('PCO-SUD-01', '34 Avenue d''Italie, 75013 Paris', 600, 250, 48.8314, 2.3569),
  ('PCO-EST-01', '56 Rue de la République, 93100 Montreuil', 400, 180, 48.8618, 2.4419),
  ('PCO-OUEST-01', '78 Avenue de Neuilly, 92200 Neuilly-sur-Seine', 550, 220, 48.8846, 2.2697)
ON CONFLICT DO NOTHING;