
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCustomerComplaints, useUpdateComplaint } from '@/hooks/useComplaints';

const TicketManagement = () => {
  const { toast } = useToast();
  const { data: complaints, isLoading } = useCustomerComplaints();
  const updateComplaint = useUpdateComplaint();

  const technicians = [
    { id: 1, name: 'Marc Technicien', zone: 'Zone A', activeTickets: 3, speciality: 'Réparation' },
    { id: 2, name: 'Sophie Tech', zone: 'Zone B', activeTickets: 2, speciality: 'Installation' },
    { id: 3, name: 'Paul Installateur', zone: 'Zone C', activeTickets: 1, speciality: 'Installation' },
    { id: 4, name: 'Alice Maintenance', zone: 'Zone D', activeTickets: 4, speciality: 'Maintenance' }
  ];

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

  const getPriorityBadge = (priority: string) => {
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
    switch (type) {
      case 'debit-lent':
        return 'Débit lent';
      case 'panne-totale':
        return 'Panne totale';
      case 'connexion-instable':
        return 'Connexion instable';
      case 'installation':
        return 'Problème d\'installation';
      case 'facturation':
        return 'Problème de facturation';
      case 'autre':
        return 'Autre';
      default:
        return type;
    }
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
          <p className="text-blue-300">Tickets créés par l'équipe commerciale</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border-blue-600/20">
          <TabsTrigger value="tickets" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
            Tickets Reçus
          </TabsTrigger>
          <TabsTrigger value="technicians" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200">
            Techniciens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-slate-800/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-100">
                    <Ticket className="h-5 w-5" />
                    Tickets Reçus du Commercial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints && complaints.length > 0 ? (
                      complaints.map((complaint) => (
                        <div key={complaint.id} className="border border-blue-600/20 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="font-semibold text-blue-100">{complaint.complaint_number}</h3>
                                {getPriorityBadge(complaint.priority || 'medium')}
                                {getStatusBadge(complaint.status || 'open')}
                              </div>
                              <p className="text-sm text-blue-300 mb-1">{complaint.client_name}</p>
                              <p className="text-sm text-blue-400">
                                {getComplaintTypeLabel(complaint.complaint_type)}
                              </p>
                              {complaint.description && (
                                <p className="text-xs text-blue-400 mt-2">
                                  {complaint.description}
                                </p>
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
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-blue-200 mb-2">Aucun ticket reçu</h3>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <Card key={tech.id} className="bg-slate-800/50 border-blue-600/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-blue-100">
                      <User className="h-5 w-5" />
                      {tech.name}
                    </span>
                    <Badge variant={tech.activeTickets > 3 ? 'destructive' : 'default'}>
                      {tech.activeTickets} tickets
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Zone</span>
                    <span className="font-medium text-blue-100">{tech.zone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-300">Spécialité</span>
                    <Badge variant="outline" className="text-blue-300 border-blue-600/20">
                      {tech.speciality}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full text-blue-300 border-blue-600/20 hover:bg-blue-600/20">
                    Voir planning
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TicketManagement;
