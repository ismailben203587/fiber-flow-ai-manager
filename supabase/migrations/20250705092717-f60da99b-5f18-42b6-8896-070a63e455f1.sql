
-- Créer la table des clients
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_number VARCHAR UNIQUE NOT NULL,
  voip_number VARCHAR UNIQUE NOT NULL,
  cin VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter RLS pour les clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access to clients" ON public.clients FOR ALL USING (true);

-- Modifier la table ftth_orders pour inclure le CIN et lier au client
ALTER TABLE public.ftth_orders 
ADD COLUMN client_cin VARCHAR,
ADD COLUMN client_id UUID REFERENCES public.clients(id),
ADD COLUMN client_number VARCHAR,
ADD COLUMN voip_number VARCHAR;

-- Modifier la table customer_complaints pour lier au client via VOIP
ALTER TABLE public.customer_complaints 
ADD COLUMN client_id UUID REFERENCES public.clients(id),
ADD COLUMN voip_number VARCHAR;

-- Fonction pour générer automatiquement les numéros client et VOIP
CREATE OR REPLACE FUNCTION generate_client_numbers()
RETURNS TRIGGER AS $$
DECLARE
  new_client_number VARCHAR;
  new_voip_number VARCHAR;
BEGIN
  -- Générer un numéro client unique (format: CLI-XXXXXX)
  SELECT 'CLI-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(client_number FROM 5) AS INTEGER)), 0) + 1)::TEXT, 6, '0')
  INTO new_client_number
  FROM public.clients
  WHERE client_number LIKE 'CLI-%';
  
  -- Générer un numéro VOIP unique (format: 1000XXXX)
  SELECT '1000' || LPAD((COALESCE(MAX(CAST(SUBSTRING(voip_number FROM 5) AS INTEGER)), 0) + 1)::TEXT, 4, '0')
  INTO new_voip_number
  FROM public.clients
  WHERE voip_number LIKE '1000%';
  
  NEW.client_number := new_client_number;
  NEW.voip_number := new_voip_number;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour générer automatiquement les numéros lors de l'insertion d'un nouveau client
CREATE TRIGGER generate_client_numbers_trigger
  BEFORE INSERT ON public.clients
  FOR EACH ROW EXECUTE FUNCTION generate_client_numbers();

-- Fonction pour créer automatiquement un client lors de la création d'une commande FTTH
CREATE OR REPLACE FUNCTION create_client_from_ftth_order()
RETURNS TRIGGER AS $$
DECLARE
  client_id UUID;
BEGIN
  -- Créer le client avec les données de la commande
  INSERT INTO public.clients (cin, name, address, phone, email)
  VALUES (NEW.client_cin, NEW.client_name, NEW.client_address, NEW.client_phone, NEW.client_email)
  RETURNING id INTO client_id;
  
  -- Récupérer les numéros générés automatiquement
  SELECT clients.client_number, clients.voip_number
  INTO NEW.client_number, NEW.voip_number
  FROM public.clients
  WHERE clients.id = client_id;
  
  -- Lier la commande au client
  NEW.client_id := client_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour créer automatiquement le client lors de la création d'une commande FTTH
CREATE TRIGGER create_client_from_ftth_order_trigger
  BEFORE INSERT ON public.ftth_orders
  FOR EACH ROW EXECUTE FUNCTION create_client_from_ftth_order();

-- Fonction pour récupérer les données client par numéro VOIP
CREATE OR REPLACE FUNCTION get_client_by_voip(voip_num VARCHAR)
RETURNS TABLE(
  id UUID,
  client_number VARCHAR,
  voip_number VARCHAR,
  cin VARCHAR,
  name VARCHAR,
  address TEXT,
  phone VARCHAR,
  email VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.client_number,
    c.voip_number,
    c.cin,
    c.name,
    c.address,
    c.phone,
    c.email
  FROM public.clients c
  WHERE c.voip_number = voip_num;
END;
$$ LANGUAGE plpgsql;
