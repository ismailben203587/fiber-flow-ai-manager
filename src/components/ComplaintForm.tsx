
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateComplaint } from '@/hooks/useComplaints';
import VoipClientLookup from './VoipClientLookup';

const ComplaintForm = () => {
  const { toast } = useToast();
  const createComplaint = useCreateComplaint();
  
  const [clientFound, setClientFound] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [newComplaint, setNewComplaint] = useState({
    clientName: '',
    clientAddress: '',
    complaintType: '',
    description: '',
    voipNumber: ''
  });

  const handleClientFound = (client: any) => {
    setClientFound(true);
    setClientData(client);
    setNewComplaint(prev => ({
      ...prev,
      clientName: client.name,
      clientAddress: client.address,
      voipNumber: client.voip_number
    }));
  };

  const handleClientNotFound = () => {
    setClientFound(false);
    setClientData(null);
    setNewComplaint(prev => ({
      ...prev,
      clientName: '',
      clientAddress: '',
      voipNumber: ''
    }));
  };

  // Fonction pour déterminer automatiquement la priorité basée sur le type de problème
  const determineAutomaticPriority = (complaintType: string) => {
    switch (complaintType) {
      case 'panne-totale':
        return 'critical';
      case 'debit-lent':
      case 'connexion-instable':
        return 'high';
      case 'installation':
      case 'facturation':
        return 'medium';
      case 'maintenance':
        return 'low';
      default:
        return 'medium';
    }
  };

  const handleCreateComplaint = async () => {
    if (!newComplaint.clientName || !newComplaint.complaintType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate complaint number
      const complaintNumber = `REC-${Date.now().toString().slice(-6)}`;
      
      // Déterminer automatiquement la priorité
      const automaticPriority = determineAutomaticPriority(newComplaint.complaintType);
      
      await createComplaint.mutateAsync({
        client_name: newComplaint.clientName,
        client_address: newComplaint.clientAddress || null,
        complaint_type: newComplaint.complaintType,
        priority: automaticPriority,
        description: newComplaint.description,
        complaint_number: complaintNumber,
        status: 'open',
        client_id: clientData?.id || null,
        voip_number: newComplaint.voipNumber || null
      });

      toast({
        title: "Ticket créé avec succès",
        description: `Le ticket ${complaintNumber} a été créé avec priorité ${automaticPriority === 'critical' ? 'critique' : automaticPriority === 'high' ? 'haute' : automaticPriority === 'medium' ? 'moyenne' : 'basse'} et un technicien sera automatiquement assigné.`,
      });

      // Reset form
      setNewComplaint({
        clientName: '',
        clientAddress: '',
        complaintType: '',
        description: '',
        voipNumber: ''
      });
      setClientFound(false);
      setClientData(null);
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du ticket",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Nouveau Ticket
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <VoipClientLookup 
          onClientFound={handleClientFound}
          onClientNotFound={handleClientNotFound}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client *</Label>
            <Input
              id="clientName"
              value={newComplaint.clientName}
              onChange={(e) => setNewComplaint({ ...newComplaint, clientName: e.target.value })}
              placeholder="Nom du client"
              disabled={clientFound}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Adresse du client</Label>
            <Input
              id="clientAddress"
              value={newComplaint.clientAddress}
              onChange={(e) => setNewComplaint({ ...newComplaint, clientAddress: e.target.value })}
              placeholder="Adresse complète (pour assignation automatique)"
              disabled={clientFound}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="complaintType">Type de problème *</Label>
          <Select value={newComplaint.complaintType} onValueChange={(value) => setNewComplaint({ ...newComplaint, complaintType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit-lent">Débit lent</SelectItem>
              <SelectItem value="panne-totale">Panne totale</SelectItem>
              <SelectItem value="connexion-instable">Connexion instable</SelectItem>
              <SelectItem value="installation">Problème d'installation</SelectItem>
              <SelectItem value="facturation">Problème de facturation</SelectItem>
              <SelectItem value="maintenance">Maintenance préventive</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            La priorité sera automatiquement déterminée selon le type de problème
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={newComplaint.description}
            onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
            placeholder="Décrivez le problème en détail"
            rows={3}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Assignation Intelligente</h4>
              <p className="text-sm text-blue-700">
                Le système assignera automatiquement le technicien le plus approprié selon la zone géographique, 
                la spécialité technique et la charge de travail actuelle. La priorité est déterminée automatiquement.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-900">Suivi Automatique</h4>
              <p className="text-sm text-green-700">
                Le ticket sera automatiquement suivi pour détecter les répétitions et les retards. 
                Des notifications seront envoyées aux techniciens concernés.
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCreateComplaint} 
          className="w-full"
          disabled={createComplaint.isPending}
        >
          <Plus className="h-4 w-4 mr-2" />
          {createComplaint.isPending ? 'Création...' : 'Créer le ticket'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
