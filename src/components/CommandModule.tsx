
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CommandModule = () => {
  const { toast } = useToast();
  const [newCommand, setNewCommand] = useState({
    clientName: '',
    address: '',
    phone: '',
    email: '',
    serviceType: 'FTTH'
  });

  const commands = [
    { id: 'CMD-001', client: 'Jean Dupont', address: '15 Rue de la Paix, Paris 75001', status: 'En attente', date: '2024-01-15', feasibility: 'Pending' },
    { id: 'CMD-002', client: 'Marie Martin', address: '22 Avenue Victor Hugo, Lyon 69003', status: 'Faisable', date: '2024-01-14', feasibility: 'Approved' },
    { id: 'CMD-003', client: 'Pierre Bernard', address: '8 Boulevard Saint-Germain, Marseille 13001', status: 'Refusée', date: '2024-01-13', feasibility: 'Rejected' },
    { id: 'CMD-004', client: 'Sophie Leblanc', address: '45 Rue de Rivoli, Toulouse 31000', status: 'En cours', date: '2024-01-12', feasibility: 'In Progress' }
  ];

  const complaints = [
    { id: 'REC-001', client: 'Antoine Durand', type: 'Débit lent', priority: 'Moyenne', status: 'Ouvert', date: '2024-01-15' },
    { id: 'REC-002', client: 'Claire Moreau', type: 'Connexion instable', priority: 'Haute', status: 'En cours', date: '2024-01-14' },
    { id: 'REC-003', client: 'Marc Petit', type: 'Panne totale', priority: 'Critique', status: 'Résolu', date: '2024-01-13' }
  ];

  const handleSubmitCommand = () => {
    if (!newCommand.clientName || !newCommand.address) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Commande créée",
      description: `La commande pour ${newCommand.clientName} a été enregistrée. L'IA va analyser la faisabilité.`,
    });

    setNewCommand({
      clientName: '',
      address: '',
      phone: '',
      email: '',
      serviceType: 'FTTH'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'En attente':
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      case 'Faisable':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case 'Refusée':
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      case 'En cours':
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'Critique':
        return <Badge className="bg-red-100 text-red-800">{priority}</Badge>;
      case 'Haute':
        return <Badge className="bg-orange-100 text-orange-800">{priority}</Badge>;
      case 'Moyenne':
        return <Badge className="bg-yellow-100 text-yellow-800">{priority}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Commercial</h2>
          <p className="text-gray-600">Gestion des commandes et réclamations FTTH</p>
        </div>
      </div>

      <Tabs defaultValue="commands" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commands">Commandes FTTH</TabsTrigger>
          <TabsTrigger value="new-command">Nouvelle Commande</TabsTrigger>
          <TabsTrigger value="complaints">Réclamations</TabsTrigger>
        </TabsList>

        <TabsContent value="commands" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Rechercher une commande..." className="pl-10" />
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Commandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commands.map((command) => (
                  <div key={command.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">{command.id}</p>
                          <p className="text-sm text-gray-600">{command.client}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{command.address}</p>
                          <p className="text-xs text-gray-500">Créée le {command.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(command.status)}
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-command" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle Commande FTTH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nom du client *</Label>
                  <Input
                    id="clientName"
                    value={newCommand.clientName}
                    onChange={(e) => setNewCommand({ ...newCommand, clientName: e.target.value })}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={newCommand.phone}
                    onChange={(e) => setNewCommand({ ...newCommand, phone: e.target.value })}
                    placeholder="01 23 45 67 89"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète *</Label>
                <Input
                  id="address"
                  value={newCommand.address}
                  onChange={(e) => setNewCommand({ ...newCommand, address: e.target.value })}
                  placeholder="15 Rue de la Paix, 75001 Paris"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCommand.email}
                  onChange={(e) => setNewCommand({ ...newCommand, email: e.target.value })}
                  placeholder="jean.dupont@email.com"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Étude automatique</h4>
                    <p className="text-sm text-blue-700">
                      L'IA analysera automatiquement la faisabilité de cette commande en vérifiant la disponibilité des équipements PCO/MSAN dans la zone.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={handleSubmitCommand} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Créer la commande
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Réclamations Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaints.map((complaint) => (
                  <div key={complaint.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-gray-900">{complaint.id}</p>
                          <p className="text-sm text-gray-600">{complaint.client}</p>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{complaint.type}</p>
                          <p className="text-xs text-gray-500">Créée le {complaint.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                      <Button variant="outline" size="sm">
                        Traiter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommandModule;
