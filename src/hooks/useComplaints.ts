
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
        .select(`
          *,
          assigned_technician:assigned_technician_id(
            id,
            name,
            email,
            phone,
            speciality,
            zone:zone_id(name)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as (CustomerComplaint & { 
        assigned_technician?: {
          id: string;
          name: string;
          email?: string;
          phone?: string;
          speciality?: string;
          zone?: { name: string };
        } 
      })[];
    },
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (complaintData: Omit<CustomerComplaintInsert, 'id' | 'created_at' | 'updated_at'>) => {
      console.log('Creating complaint with data:', complaintData);
      
      // First create the complaint
      const { data: complaint, error: insertError } = await supabase
        .from('customer_complaints')
        .insert([complaintData])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      console.log('Complaint created:', complaint);
      
      // Call the AI assignment function if we have address data
      if (complaintData.client_address && complaint) {
        try {
          console.log('Calling AI assignment function...');
          const { data: assignedTechnicianId, error: assignError } = await supabase
            .rpc('ai_assign_technician', {
              complaint_id: complaint.id,
              complaint_type: complaintData.complaint_type,
              priority: complaintData.priority || 'medium',
              client_address: complaintData.client_address
            });
          
          if (assignError) {
            console.error('Assignment error:', assignError);
          } else if (assignedTechnicianId) {
            console.log('Technician assigned:', assignedTechnicianId);
            
            // Update the complaint with the assigned technician
            const { error: updateError } = await supabase
              .from('customer_complaints')
              .update({ assigned_technician_id: assignedTechnicianId })
              .eq('id', complaint.id);
            
            if (updateError) {
              console.error('Update error:', updateError);
            }
            
            // Create assignment record
            const { error: assignmentError } = await supabase
              .from('ticket_assignments')
              .insert([{
                complaint_id: complaint.id,
                technician_id: assignedTechnicianId,
                status: 'assigned',
                notes: 'Assignation automatique basée sur la zone et la spécialité'
              }]);
            
            if (assignmentError) {
              console.error('Assignment record error:', assignmentError);
            }
            
            // Create assignment notification
            const { error: notificationError } = await supabase
              .from('ticket_notifications')
              .insert([{
                complaint_id: complaint.id,
                technician_id: assignedTechnicianId,
                notification_type: 'assignment',
                message: `Nouveau ticket assigné: ${complaint.complaint_number} - ${complaintData.complaint_type}`
              }]);
            
            if (notificationError) {
              console.error('Notification error:', notificationError);
            }
          }
        } catch (error) {
          console.error('AI assignment failed:', error);
          // Don't throw error here, complaint was created successfully
        }
      }
      
      return complaint;
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
