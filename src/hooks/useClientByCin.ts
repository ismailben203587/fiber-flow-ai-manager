
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useClientByCin = (cin: string) => {
  return useQuery({
    queryKey: ['client_by_cin', cin],
    queryFn: async () => {
      if (!cin) return null;
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('cin', cin)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun résultat trouvé
          return null;
        }
        throw error;
      }
      
      return data;
    },
    enabled: !!cin,
  });
};
