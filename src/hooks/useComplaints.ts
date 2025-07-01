
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type CustomerComplaint = Tables<'customer_complaints'>;
type CustomerComplaintInsert = TablesInsert<'customer_complaints'>;
type CustomerComplaintUpdate = TablesUpdate<'customer_complaints'>;

export const useCustomerComplaints = () => {
  return useQuery({
    queryKey: ['customer_complaints'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomerComplaint[];
    },
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (complaintData: Omit<CustomerComplaintInsert, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .insert([complaintData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_complaints'] });
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & CustomerComplaintUpdate) => {
      const { data, error } = await supabase
        .from('customer_complaints')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_complaints'] });
    },
  });
};
