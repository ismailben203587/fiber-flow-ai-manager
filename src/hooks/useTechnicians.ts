
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
