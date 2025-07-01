
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type FTTHOrder = Tables<'ftth_orders'>;
type FTTHOrderInsert = TablesInsert<'ftth_orders'>;
type FTTHOrderUpdate = TablesUpdate<'ftth_orders'>;

export const useFTTHOrders = () => {
  return useQuery({
    queryKey: ['ftth_orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ftth_orders')
        .select(`
          *,
          pco_equipment!assigned_pco_id(id, name, address),
          msan_equipment!assigned_msan_id(id, name, address)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateFTTHOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (orderData: Omit<FTTHOrderInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('ftth_orders')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ftth_orders'] });
    },
  });
};

export const useUpdateFTTHOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & FTTHOrderUpdate) => {
      const { data, error } = await supabase
        .from('ftth_orders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ftth_orders'] });
    },
  });
};
