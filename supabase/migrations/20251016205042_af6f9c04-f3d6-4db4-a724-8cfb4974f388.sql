-- Ajouter le lien entre techniciens et utilisateurs
ALTER TABLE public.technicians ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_technicians_user_id ON public.technicians(user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_zone_id ON public.technicians(zone_id);

-- Mettre à jour les RLS policies pour les techniciens
DROP POLICY IF EXISTS "Public access to technicians" ON public.technicians;

CREATE POLICY "Technicians can view their own profile"
ON public.technicians FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all technicians"
ON public.technicians FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Mettre à jour les RLS policies pour les tickets
DROP POLICY IF EXISTS "Public access to customer complaints" ON public.customer_complaints;

CREATE POLICY "Technicians can view tickets in their zone"
ON public.customer_complaints FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.technicians t
    WHERE t.user_id = auth.uid()
    AND t.zone_id IN (
      SELECT z.id FROM public.zones z
      WHERE z.name = customer_complaints.client_zone
    )
  )
  OR has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'commercial')
  OR has_role(auth.uid(), 'tech')
);

CREATE POLICY "Technicians can update their assigned tickets"
ON public.customer_complaints FOR UPDATE
USING (
  assigned_technician_id IN (
    SELECT id FROM public.technicians WHERE user_id = auth.uid()
  )
  OR has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'commercial')
  OR has_role(auth.uid(), 'tech')
);

CREATE POLICY "Commercial and admin can insert tickets"
ON public.customer_complaints FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin')
  OR has_role(auth.uid(), 'commercial')
  OR has_role(auth.uid(), 'tech')
);

CREATE POLICY "Admin can delete tickets"
ON public.customer_complaints FOR DELETE
USING (has_role(auth.uid(), 'admin'));