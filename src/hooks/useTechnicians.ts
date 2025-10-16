
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Technician = Tables<'technicians'>;
type TechnicianInsert = TablesInsert<'technicians'>;
type TechnicianUpdate = TablesUpdate<'technicians'>;

export const useTechnicians = () => {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technicians')
        .select(`
          *,
          zone:zone_id(id, name, description),
          active_tickets:customer_complaints!assigned_technician_id(id)
        `)
        .order('name');
      
      if (error) throw error;
      return data as (Technician & { 
        zone?: { id: string; name: string; description?: string };
        active_tickets?: { id: string }[];
      })[];
    },
  });
};

export const useZones = () => {
  return useQuery({
    queryKey: ['zones'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('zones')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });
};

export const useTicketNotifications = () => {
  return useQuery({
    queryKey: ['ticket_notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_notifications')
        .select(`
          *,
          complaint:complaint_id(complaint_number, client_name),
          technician:technician_id(name)
        `)
        .order('sent_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCurrentTechnician = () => {
  return useQuery({
    queryKey: ['current_technician'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('technicians')
        .select(`
          *,
          zone:zone_id(id, name, description)
        `)
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Technician & { 
        zone?: { id: string; name: string; description?: string };
      };
    },
  });
};

export const useTechnicianTickets = () => {
  return useQuery({
    queryKey: ['technician_tickets'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get technician info first
      const { data: technicianData, error: techError } = await supabase
        .from('technicians')
        .select('id, zone_id, zone:zone_id(name)')
        .eq('user_id', user.id)
        .single();

      if (techError) throw techError;

      // Get tickets from the technician's zone
      const { data, error } = await supabase
        .from('customer_complaints')
        .select('*')
        .eq('client_zone', (technicianData.zone as any)?.name)
        .in('status', ['open', 'in_progress'])
        .order('priority', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};
