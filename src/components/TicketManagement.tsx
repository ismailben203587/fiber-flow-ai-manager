import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, User, Clock, AlertCircle, CheckCircle, Bell, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomerComplaints, useUpdateComplaint } from '@/hooks/useComplaints';
import { useTechnicians, useTicketNotifications } from '@/hooks/useTechnicians';

const TicketManagement = () => {
  const { toast } = useToast();
  const { data: complaints, isLoading } = useCustomerComplaints();
  const { data: technicians, isLoading: techniciansLoading } = useTechnicians();
  const { data: notifications, isLoading: notificationsLoading } = useTicketNotifications();
  const updateComplaint = useUpdateComplaint();

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      await updateComplaint.mutateAsync({ id: ticketId, status: newStatus });
      toast({
        title: "Statut mis à jour",
        description: `Le ticket a été marqué comme ${newStatus === 'in_progress' ? 'en cours' : newStatus === 'resolved' ? 'résolu' : newStatus}`,
      });
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du ticket",
        variant: "destructive"
      });
    }
  };

  const getPriorityBadge = (priority: string, repeatCount?: number) => {
    const isUrgent = repeatCount && repeatCount >= 2;
    
    if (isUrgent) {
      return (
        <Badge className="bg-red-600 text-white animate-pulse border-red-800">
          <AlertTriangle className="h-3 w-3 mr-1" />
          URGENT ({repeatCount}x)
        </Badge>
      );
    }
    
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Critique</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">Haute</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Moyenne</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Basse</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Ouvert</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getComplaintTypeLabel = (type: string) => {
    const types = {
      'debit-lent': 'Débit lent',
      'panne-totale': 'Panne totale',
      'connexion-instable': 'Connexion instable',
      'installation': 'Problème d\'installation',
      'facturation': 'Problème de facturation',
      'maintenance': 'Maintenance préventive',
      'autre': 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-blue-200">Chargement des tickets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-100">Gestion des Tickets</h2>
          <p className="text-blue-300">Tickets avec assignation automatique intelligente</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-blue-600/20">
          <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
            <Ticket className="h-4 w-4 mr-2" />
            Tickets
          </TabsTrigger>
          <TabsTrigger value="technicians" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
            <User className="h-4 w-4 mr-2" />
            Techniciens
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-slate-800/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-100">
                    <Ticket className="h-5 w-5" />
                    Tickets avec Assignation Automatique
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints && complaints.length > 0 ? (
                      complaints.map((complaint) => {
                        const isUrgent = complaint.repeat_count && complaint.repeat_count >= 2;
                        const cardClasses = isUrgent 
                          ? "border border-red-500/50 rounded-lg p-4 bg-red-900/20 hover:bg-red-900/30 transition-colors shadow-lg shadow-red-500/20" 
                          : "border border-blue-600/20 rounded-lg p-4 hover:bg-slate-700/30 transition-colors";
                        
                        return (
                          <div key={complaint.id} className={cardClasses}>
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <h3 className="font-semibold text-blue-100">{complaint.complaint_number}</h3>
                                  {getPriorityBadge(complaint.priority || 'medium', complaint.repeat_count || 0)}
                                  {getStatusBadge(complaint.status || 'open')}
                                </div>
                                <p className="text-sm text-blue-300 mb-1">{complaint.client_name}</p>
                                <p className="text-sm text-blue-400">
                                  {getComplaintTypeLabel(complaint.complaint_type)}
                                </p>
                                {complaint.client_zone && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <MapPin className="h-3 w-3 text-blue-400" />
                                    <span className="text-xs text-blue-400">{complaint.client_zone}</span>
                                  </div>
                                )}
                                {complaint.assigned_technician && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Wrench className="h-3 w-3 text-green-400" />
                                    <span className="text-xs text-green-400">
                                      Assigné à {complaint.assigned_technician.name}
                                      {complaint.assigned_technician.speciality && 
                                        ` (${complaint.assigned_technician.speciality})`
                                      }
                                    </span>
                                  </div>
                                )}
                                {complaint.description && (
                                  <p className="text-xs text-blue-400 mt-2">
                                    {complaint.description}
                                  </p>
                                )}
                                {isUrgent && (
                                  <div className="mt-2 bg-red-800/30 border border-red-600/50 rounded p-2">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-red-400" />
                                      <span className="text-red-200 text-sm font-medium">
                                        Ticket signalé {complaint.repeat_count} fois - Intervention urgente requise
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                {complaint.status === 'open' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateTicketStatus(complaint.id, 'in_progress')}
                                    className="text-blue-300 border-blue-600/20 hover:bg-blue-600/20"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    Traiter
                                  </Button>
                                )}
                                {complaint.status === 'in_progress' && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleUpdateTicketStatus(complaint.id, 'resolved')}
                                    className="text-green-300 border-green-600/20 hover:bg-green-600/20"
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Résoudre
                                  </Button>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-blue-400 pt-2 border-t border-blue-600/20">
                              Créé le {new Date(complaint.created_at || '').toLocaleDateString('fr-FR')}
                              {complaint.due_date && (
                                <span className="ml-4">
                                  Échéance: {new Date(complaint.due_date).toLocaleDateString('fr-FR')}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-blue-200 mb-2">Aucun ticket</h3>
                        <p className="text-blue-400">Les tickets créés par l'équipe commerciale apparaîtront ici.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-slate-800/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-100">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">Tickets ouverts</span>
                    <Badge className="bg-red-100 text-red-800">
                      {complaints?.filter(c => c.status === 'open').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">En cours</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {complaints?.filter(c => c.status === 'in_progress').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">Résolus</span>
                    <Badge className="bg-green-100 text-green-800">
                      {complaints?.filter(c => c.status === 'resolved').length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">Tickets urgents</span>
                    <Badge className="bg-red-600 text-white">
                      {complaints?.filter(c => c.repeat_count && c.repeat_count >= 2).length || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-300">Assignés automatiquement</span>
                    <Badge className="bg-purple-100 text-purple-800">
                      {complaints?.filter(c => c.assigned_technician_id).length || 0}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {!techniciansLoading && technicians?.map((tech) => (
              <Card key={tech.id} className="bg-slate-800/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-blue-100">
                      <User className="h-5 w-5" />
                      {tech.name}
                    </span>
                    <Badge variant={tech.active_tickets && tech.active_tickets.length > 3 ? 'destructive' : 'default'}>
                      {tech.active_tickets?.length || 0} tickets
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Zone</span>
                    <span className="font-medium text-blue-100">
                      {tech.zone?.name || 'Non assignée'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Spécialité</span>
                    <Badge variant="outline" className="text-blue-300 border-blue-600/20">
                      {tech.speciality || 'Généraliste'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Statut</span>
                    <Badge variant={tech.status === 'active' ? 'default' : 'secondary'}>
                      {tech.status === 'active' ? 'Actif' : tech.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Capacité</span>
                    <span className="text-blue-100">
                      {tech.active_tickets?.length || 0}/{tech.max_concurrent_tickets || 5}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="bg-slate-800/50 border-blue-600/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-100">
                <Bell className="h-5 w-5" />
                Notifications Système
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!notificationsLoading && notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="border border-blue-600/20 rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={
                              notification.notification_type === 'assignment' ? 'bg-blue-100 text-blue-800' :
                              notification.notification_type === 'repeated_ticket' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {notification.notification_type === 'assignment' ? 'Assignation' :
                               notification.notification_type === 'repeated_ticket' ? 'Ticket répété' :
                               'Ticket en retard'}
                            </Badge>
                            <span className="text-xs text-blue-400">
                              {new Date(notification.sent_at || '').toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <p className="text-sm text-blue-200 mb-1">{notification.message}</p>
                          <p className="text-xs text-blue-400">
                            Technicien: {(notification as any).technician?.name || 'Non spécifié'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-blue-200 mb-2">Aucune notification</h3>
                    <p className="text-blue-400">Les notifications système apparaîtront ici.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketManagement;
