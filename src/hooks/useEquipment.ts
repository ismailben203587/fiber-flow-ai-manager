
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type PCOEquipment = Tables<'pco_equipment'>;
type MSANEquipment = Tables<'msan_equipment'>;

export const usePCOEquipment = () => {
  return useQuery({
    queryKey: ['pco_equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pco_equipment')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as PCOEquipment[];
    },
  });
};

export const useMSANEquipment = () => {
  return useQuery({
    queryKey: ['msan_equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('msan_equipment')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as MSANEquipment[];
    },
  });
};

export const useUpdatePCOCapacity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, used_capacity }: { id: string; used_capacity: number }) => {
      const { data, error } = await supabase
        .from('pco_equipment')
        .update({ used_capacity, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pco_equipment'] });
    },
  });
};

export const useUpdateMSANCapacity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, used_capacity }: { id: string; used_capacity: number }) => {
      const { data, error } = await supabase
        .from('msan_equipment')
        .update({ used_capacity, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['msan_equipment'] });
    },
  });
};
