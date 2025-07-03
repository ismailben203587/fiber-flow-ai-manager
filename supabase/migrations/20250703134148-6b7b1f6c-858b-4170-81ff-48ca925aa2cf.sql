
-- Add client_address column to customer_complaints table
ALTER TABLE public.customer_complaints 
ADD COLUMN client_address TEXT;
