
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
      
      // Vérifier les tickets répétés AVANT de créer le nouveau ticket
      const { data: existingComplaints, error: searchError } = await supabase
        .from('customer_complaints')
        .select('*')
        .eq('client_name', complaintData.client_name)
        .eq('complaint_type', complaintData.complaint_type)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Derniers 30 jours
      
      if (searchError) {
        console.error('Error searching for existing complaints:', searchError);
      }
      
      const repeatCount = existingComplaints ? existingComplaints.length : 0;
      console.log(`Found ${repeatCount} existing similar complaints for ${complaintData.client_name}`);
      
      // Ajuster la priorité si c'est un ticket répété
      let finalPriority = complaintData.priority || 'medium';
      if (repeatCount >= 2) {
        finalPriority = 'critical'; // Escalader à critique si répété 2+ fois
        console.log('Escalating priority to critical due to repeated tickets');
      } else if (repeatCount >= 1) {
        if (finalPriority === 'low') finalPriority = 'medium';
        if (finalPriority === 'medium') finalPriority = 'high';
        console.log(`Escalating priority to ${finalPriority} due to repeated ticket`);
      }
      
      // First create the complaint
      const { data: complaint, error: insertError } = await supabase
        .from('customer_complaints')
        .insert([{
          ...complaintData,
          priority: finalPriority,
          repeat_count: repeatCount,
          last_repeat_date: repeatCount > 0 ? new Date().toISOString() : null
        }])
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
              priority: finalPriority,
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
            const notificationMessage = repeatCount >= 2 
              ? `URGENT - Ticket répété ${repeatCount + 1} fois: ${complaint.complaint_number} - ${complaintData.complaint_type}`
              : `Nouveau ticket assigné: ${complaint.complaint_number} - ${complaintData.complaint_type}`;
            
            const { error: notificationError } = await supabase
              .from('ticket_notifications')
              .insert([{
                complaint_id: complaint.id,
                technician_id: assignedTechnicianId,
                notification_type: repeatCount >= 2 ? 'repeated_ticket' : 'assignment',
                message: notificationMessage
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
