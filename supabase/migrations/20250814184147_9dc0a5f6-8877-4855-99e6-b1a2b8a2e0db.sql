-- Créer une table pour stocker les adresses ML
CREATE TABLE public.ml_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  province VARCHAR NOT NULL,
  commune VARCHAR NOT NULL,
  quartier VARCHAR NOT NULL,
  voie VARCHAR NOT NULL,
  zone VARCHAR,
  identifiant_pco VARCHAR,
  capacite INTEGER,
  faisabilite VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.ml_addresses ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'accès en lecture à tous les utilisateurs authentifiés
CREATE POLICY "Allow read access to all authenticated users" 
ON public.ml_addresses 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Politique pour permettre toutes les opérations aux admins
CREATE POLICY "Allow all operations for admins" 
ON public.ml_addresses 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Créer un index pour optimiser les recherches
CREATE INDEX idx_ml_addresses_province ON public.ml_addresses(province);
CREATE INDEX idx_ml_addresses_commune ON public.ml_addresses(province, commune);
CREATE INDEX idx_ml_addresses_quartier ON public.ml_addresses(province, commune, quartier);

-- Fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_ml_addresses_updated_at
  BEFORE UPDATE ON public.ml_addresses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();