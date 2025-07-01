
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ticket, User, Clock, MapPin, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TicketManagement = () => {
  const { toast } = useToast();
  const [newTicket, setNewTicket] = useState({
    client: '',
    address: '',
    type: '',
    priority: '',
    description: ''
  });

  const tickets = [
    {
      id: 'TIC-001',
      client: 'Jean Dupont',
      address: '15 Rue de la Paix, Paris 75001',
      type: 'Débit lent',
      priority: 'Moyenne',
      status: 'Ouvert',
      assignedTo: 'Marc Technicien',
      zone: 'Zone A',
      createdAt: '2024-01-15 09:30',
      estimatedTime: '2h'
    },
    {
      id: 'TIC-002',
      client: 'Marie Martin',
      address: '22 Avenue Victor Hugo, Lyon 69003',
      type: 'Panne totale',
      priority: 'Critique',
      status: 'En cours',
      assignedTo: 'Sophie Tech',
      zone: 'Zone D',
      createdAt: '2024-01-15 08:15',
      estimatedTime: '4h'
    },
    {
      id: 'TIC-003',
      client: 'Pierre Bernard',
      address: '8 Boulevard Saint-Germain, Marseille 13001',
      type: 'Installation',
      priority: 'Normale',
      status: 'Planifié',
      assignedTo: 'Paul Installateur',
      zone: 'Zone E',
      createdAt: '2024-01-14 16:45',
      estimatedTime: '3h'
    }
  ];

  const technicians = [
    { id: 1, name: 'Marc Technicien', zone: 'Zone A', activeTickets: 3, speciality: 'Réparation' },
    { id: 2, name: 'Sophie Tech', zone: 'Zone D', activeTickets: 2, speciality: 'Installation' },
    { id: 3, name: 'Paul Installateur', zone: 'Zone E', activeTickets: 1, speciality: 'Installation' },
    { id: 4, name: 'Alice Maintenance', zone: 'Zone B', activeTickets: 4, speciality: 'Maintenance' }
  ];

  const handleCreateTicket = () => {
    if (!newTicket.client || !newTicket.type || !newTicket.priority) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Ticket créé",
      description: "L'IA va automatiquement assigner ce ticket au technicien le plus approprié.",
    });

    setNewTicket({
      client: '',
      address: '',
      type: '',
      priority: '',
      description: ''
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critique':
        return <Badge className="bg-red-100 text-red-800">{priority}</Badge>;
      case 'Haute':
        return <Badge className="bg-orange-100 text-orange-800">{priority}</Badge>;
      case 'Moyenne':
        return <Badge className="bg-yellow-100 text-yellow-800">{priority}</Badge>;
      case 'Normale':
        return <Badge className="bg-blue-100 text-blue-800">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ouvert':
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      case 'Planifié':
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case 'Résolu':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestion des Tickets</h2>
          <p className="text-gray-600">Suivi et attribution automatique des interventions</p>
        </div>
      </div>

      <Tabs defaultValue="tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tickets">Tickets Actifs</TabsTrigger>
          <TabsTrigger value="new-ticket">Nouveau Ticket</TabsTrigger>
          <TabsTrigger value="technicians">Techniciens</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Liste des Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{ticket.id}</h3>
                              {getPriorityBadge(ticket.priority)}
                              {getStatusBadge(ticket.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{ticket.client}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {ticket.address}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Voir détails
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t text-sm">
                          <div>
                            <p className="text-gray-500">Type</p>
                            <p className="font-medium">{ticket.type}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Assigné à</p>
                            <p className="font-medium flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {ticket.assignedTo}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Zone</p>
                            <p className="font-medium">{ticket.zone}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Durée estimée</p>
                            <p className="font-medium flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {ticket.estimatedTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tickets ouverts</span>
                    <Badge className="bg-red-100 text-red-800">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En cours</span>
                    <Badge className="bg-blue-100 text-blue-800">18</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Résolu aujourd'hui</span>
                    <Badge className="bg-green-100 text-green-800">12</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Temps moyen</span>
                    <Badge variant="outline">2.5h</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attribution IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>L'IA analyse automatiquement :</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Zone géographique</li>
                      <li>Type de panne</li>
                      <li>Charge des techniciens</li>
                      <li>Spécialité requise</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="new-ticket" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Créer un Nouveau Ticket
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client *</Label>
                  <Input
                    id="client"
                    value={newTicket.client}
                    onChange={(e) => setNewTicket({ ...newTicket, client: e.target.value })}
                    placeholder="Nom du client"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'intervention *</Label>
                  <Select value={newTicket.type} onValueChange={(value) => setNewTicket({ ...newTicket, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="installation">Installation</SelectItem>
                      <SelectItem value="reparation">Réparation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="debit-lent">Débit lent</SelectItem>
                      <SelectItem value="panne-totale">Panne totale</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={newTicket.address}
                  onChange={(e) => setNewTicket({ ...newTicket, address: e.target.value })}
                  placeholder="Adresse complète"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priorité *</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Niveau de priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critique">Critique</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Détails du problème ou de l'intervention"
                  rows={3}
                />
              </div>

              <Button onClick={handleCreateTicket} className="w-full">
                Créer le ticket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <Card key={tech.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
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
                    <span className="text-gray-600">Zone</span>
                    <span className="font-medium">{tech.zone}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Spécialité</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Wrench className="h-3 w-3" />
                      {tech.speciality}
                    </Badge>
                  </div>
                  <Button variant="outline" className="w-full">
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
