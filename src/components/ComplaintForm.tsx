
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateComplaint } from '@/hooks/useComplaints';

const ComplaintForm = () => {
  const { toast } = useToast();
  const createComplaint = useCreateComplaint();
  
  const [newComplaint, setNewComplaint] = useState({
    clientName: '',
    complaintType: '',
    priority: '',
    description: ''
  });

  const handleCreateComplaint = async () => {
    if (!newComplaint.clientName || !newComplaint.complaintType || !newComplaint.priority) {
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
      
      await createComplaint.mutateAsync({
        client_name: newComplaint.clientName,
        complaint_type: newComplaint.complaintType,
        priority: newComplaint.priority,
        description: newComplaint.description,
        complaint_number: complaintNumber,
        status: 'open'
      });

      toast({
        title: "Ticket créé avec succès",
        description: `Le ticket ${complaintNumber} a été créé et envoyé à l'équipe technique.`,
      });

      setNewComplaint({
        clientName: '',
        complaintType: '',
        priority: '',
        description: ''
      });
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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client *</Label>
            <Input
              id="clientName"
              value={newComplaint.clientName}
              onChange={(e) => setNewComplaint({ ...newComplaint, clientName: e.target.value })}
              placeholder="Nom du client"
            />
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
                <SelectItem value="autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priorité *</Label>
          <Select value={newComplaint.priority} onValueChange={(value) => setNewComplaint({ ...newComplaint, priority: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau de priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critique</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="low">Basse</SelectItem>
            </SelectContent>
          </Select>
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
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Transmission automatique</h4>
              <p className="text-sm text-blue-700">
                Ce ticket sera automatiquement transmis à l'équipe technique pour traitement.
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
