import DashboardNavigation from '@/components/DashboardNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCurrentTechnician, useTechnicianTickets } from '@/hooks/useTechnicians';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Phone,
  User,
  Loader2
} from 'lucide-react';

interface TechnicienDashboardProps {
  onGoHome: () => void;
}

const TechnicienDashboard = ({ onGoHome }: TechnicienDashboardProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: technician, isLoading: loadingTech } = useCurrentTechnician();
  const { data: tickets, isLoading: loadingTickets } = useTechnicianTickets();

  const updateTicketMutation = useMutation({
    mutationFn: async ({ ticketId, status }: { ticketId: string; status: string }) => {
      const { error } = await supabase
        .from('customer_complaints')
        .update({ status })
        .eq('id', ticketId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technician_tickets'] });
      toast({
        title: 'Ticket mis à jour',
        description: 'Le statut du ticket a été modifié avec succès',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de mettre à jour le ticket',
      });
    },
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive">URGENT</Badge>;
      case 'high':
        return <Badge variant="destructive">ÉLEVÉ</Badge>;
      case 'medium':
        return <Badge variant="secondary">MOYEN</Badge>;
      case 'low':
        return <Badge variant="outline">FAIBLE</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const handleTreatTicket = (ticketId: string) => {
    updateTicketMutation.mutate({ ticketId, status: 'in_progress' });
  };

  if (loadingTech || loadingTickets) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const openTickets = tickets?.filter(t => t.status === 'open') || [];
  const inProgressTickets = tickets?.filter(t => t.status === 'in_progress') || [];
  const urgentTickets = tickets?.filter(t => t.priority === 'critical') || [];
  const completedToday = 0; // TODO: Add logic for completed today

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent animate-float">
            SMART TELECOM Technicien
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {technician?.name} - Zone: {technician?.zone?.name}
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets en cours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openTickets.length + inProgressTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                {openTickets.length} ouverts, {inProgressTickets.length} en cours
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgences</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{urgentTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                {urgentTickets.length > 0 ? 'Intervention critique' : 'Aucune urgence'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminés aujourd'hui</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{completedToday}</div>
              <p className="text-xs text-muted-foreground">
                {completedToday > 0 ? 'Bonne progression' : 'Démarrez vos interventions'}
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochaine intervention</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {tickets && tickets.length > 0 ? 'Maintenant' : '--:--'}
              </div>
              <p className="text-xs text-muted-foreground">
                {tickets && tickets.length > 0 ? tickets[0].complaint_type : 'Aucune intervention'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets assignés */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Mes Tickets Assignés
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!tickets || tickets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Aucun ticket assigné pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 border rounded-lg glass-card ${
                      ticket.priority === 'critical' ? 'border-destructive/30' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(ticket.priority || 'medium')}
                          <span className="font-semibold">{ticket.complaint_number}</span>
                          <Badge variant="outline">{ticket.status === 'open' ? 'Ouvert' : 'En cours'}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ticket.complaint_type}
                        </p>
                        {ticket.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {ticket.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{ticket.client_name}</span>
                          </div>
                          {ticket.client_address && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{ticket.client_address}</span>
                            </div>
                          )}
                          {ticket.voip_number && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{ticket.voip_number}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {ticket.client_address && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const address = encodeURIComponent(ticket.client_address || '');
                            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Localiser
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => handleTreatTicket(ticket.id)}
                        disabled={ticket.status === 'in_progress'}
                      >
                        {ticket.status === 'in_progress' ? 'En cours' : 'Traiter'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicienDashboard;