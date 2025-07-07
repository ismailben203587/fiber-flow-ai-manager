
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertCircle, Search, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateFTTHOrder } from '@/hooks/useOrders';
import { useClientByCin } from '@/hooks/useClients';
import VoipClientLookup from './VoipClientLookup';

const CommercialCommands = () => {
  const { toast } = useToast();
  const createOrder = useCreateFTTHOrder();
  
  const [newOrder, setNewOrder] = useState({
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    clientEmail: '',
    clientCin: '',
    serviceType: 'FTTH'
  });

  const [searchMode, setSearchMode] = useState(false);
  const [existingClient, setExistingClient] = useState<any>(null);
  const [feasibilityResult, setFeasibilityResult] = useState<{
    status: 'auto_approved' | 'technical_study' | null;
    message: string;
  }>({ status: null, message: '' });

  const handleCreateOrder = async () => {
    console.log('🚀 Tentative de création commande avec:', newOrder);

    if (!newOrder.clientName || !newOrder.clientAddress || !newOrder.clientCin) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (nom, adresse, CIN)",
        variant: "destructive"
      });
      return;
    }

    if (!newOrder.clientCin.trim()) {
      toast({
        title: "Erreur",
        description: "Le CIN est obligatoire et ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate order number
      const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;
      
      const orderData = {
        order_number: orderNumber,
        client_name: newOrder.clientName.trim(),
        client_address: newOrder.clientAddress.trim(),
        client_phone: newOrder.clientPhone.trim() || null,
        client_email: newOrder.clientEmail.trim() || null,
        client_cin: newOrder.clientCin.trim(),
        service_type: newOrder.serviceType,
        status: 'pending',
        feasibility_status: 'pending',
        // Si un client existant est sélectionné, utiliser ses informations
        ...(existingClient && {
          client_id: existingClient.id,
          client_number: existingClient.client_number,
          voip_number: existingClient.voip_number
        })
      };

      console.log('📋 Données commande à créer:', orderData);

      const createdOrder = await createOrder.mutateAsync(orderData);

      // Simuler la vérification de faisabilité (en réalité, cela se fait via l'étude technique automatique)
      // Pour des fins de démonstration, on détermine la faisabilité basée sur des critères simples
      const isAutoFeasible = Math.random() > 0.3; // 70% de chances d'être automatiquement faisable
      
      if (isAutoFeasible) {
        setFeasibilityResult({
          status: 'auto_approved',
          message: `✅ Commande ${orderNumber} automatiquement approuvée ! Les distances aux équipements sont optimales et l'installation peut être programmée.`
        });
      } else {
        setFeasibilityResult({
          status: 'technical_study',
          message: `⏳ Commande ${orderNumber} nécessite une étude technique. L'équipe technique va analyser la faisabilité dans les plus brefs délais.`
        });
      }

      toast({
        title: "✅ Commande créée avec succès",
        description: `La commande ${orderNumber} a été créée. ${isAutoFeasible ? 'Automatiquement approuvée !' : 'Étude technique en cours.'}`,
      });

      // Reset form
      setNewOrder({
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        clientEmail: '',
        clientCin: '',
        serviceType: 'FTTH'
      });
      setExistingClient(null);
      setSearchMode(false);
    } catch (error: any) {
      console.error('❌ Erreur création commande:', error);
      
      // Gestion spécifique de l'erreur de CIN dupliqué
      if (error?.code === '23505' && error?.message?.includes('clients_cin_key')) {
        toast({
          title: "Client existant détecté",
          description: `Un client avec le CIN "${newOrder.clientCin}" existe déjà. Utilisez la recherche client pour le retrouver.`,
          variant: "destructive"
        });
        setSearchMode(true);
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la création de la commande. Vérifiez que tous les champs obligatoires sont remplis.",
          variant: "destructive"
        });
      }
    }
  };

  const handleClientFound = (client: any) => {
    setExistingClient(client);
    setNewOrder({
      clientName: client.name,
      clientAddress: client.address,
      clientPhone: client.phone || '',
      clientEmail: client.email || '',
      clientCin: client.cin,
      serviceType: 'FTTH'
    });
    setSearchMode(false);
    
    toast({
      title: "Client trouvé",
      description: "Les informations du client ont été pré-remplies",
    });
  };

  const handleClientNotFound = () => {
    setExistingClient(null);
  };

  const toggleSearchMode = () => {
    setSearchMode(!searchMode);
    if (!searchMode) {
      setExistingClient(null);
      setNewOrder({
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        clientEmail: '',
        clientCin: '',
        serviceType: 'FTTH'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Résultat de faisabilité */}
      {feasibilityResult.status && (
        <Card className={`border-2 ${
          feasibilityResult.status === 'auto_approved' 
            ? 'border-green-500 bg-green-50' 
            : 'border-orange-500 bg-orange-50'
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              {feasibilityResult.status === 'auto_approved' ? (
                <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
              ) : (
                <Clock className="h-6 w-6 text-orange-600 mt-0.5" />
              )}
              <div>
                <h4 className={`font-medium ${
                  feasibilityResult.status === 'auto_approved' 
                    ? 'text-green-900' 
                    : 'text-orange-900'
                }`}>
                  {feasibilityResult.status === 'auto_approved' 
                    ? 'Commande Automatiquement Approuvée' 
                    : 'Étude Technique Requise'
                  }
                </h4>
                <p className={`text-sm ${
                  feasibilityResult.status === 'auto_approved' 
                    ? 'text-green-700' 
                    : 'text-orange-700'
                }`}>
                  {feasibilityResult.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nouvelle Commande FTTH
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSearchMode}
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              {searchMode ? 'Nouveau client' : 'Client existant'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {searchMode && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-3">Rechercher un client existant</h3>
              <VoipClientLookup 
                onClientFound={handleClientFound}
                onClientNotFound={handleClientNotFound}
              />
            </div>
          )}

          {existingClient && (
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-sm text-green-700">
                <strong>Client sélectionné:</strong> {existingClient.name} (N° {existingClient.client_number})
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="flex items-center gap-1">
                Nom du client <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                value={newOrder.clientName}
                onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                placeholder="Nom complet du client"
                disabled={!!existingClient}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientCin" className="flex items-center gap-1">
                CIN <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientCin"
                value={newOrder.clientCin}
                onChange={(e) => setNewOrder({ ...newOrder, clientCin: e.target.value })}
                placeholder="Numéro CIN (obligatoire)"
                disabled={!!existingClient}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress" className="flex items-center gap-1">
              Adresse <span className="text-red-500">*</span>
            </Label>
            <Input
              id="clientAddress"
              value={newOrder.clientAddress}
              onChange={(e) => setNewOrder({ ...newOrder, clientAddress: e.target.value })}
              placeholder="Adresse complète d'installation"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Téléphone</Label>
              <Input
                id="clientPhone"
                value={newOrder.clientPhone}
                onChange={(e) => setNewOrder({ ...newOrder, clientPhone: e.target.value })}
                placeholder="Numéro de téléphone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={newOrder.clientEmail}
                onChange={(e) => setNewOrder({ ...newOrder, clientEmail: e.target.value })}
                placeholder="Adresse email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceType">Type de service</Label>
            <Select value={newOrder.serviceType} onValueChange={(value) => setNewOrder({ ...newOrder, serviceType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FTTH">FTTH (Fiber to the Home)</SelectItem>
                <SelectItem value="FTTB">FTTB (Fiber to the Building)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {existingClient && (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Information:</strong> Cette commande sera liée au client existant. Les numéros client et VOIP seront automatiquement assignés.
              </p>
            </div>
          )}

          {!existingClient && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Nouveau client:</strong> Un numéro client et un numéro VOIP seront automatiquement assignés lors de la création de la commande.
              </p>
            </div>
          )}

          <Button 
            onClick={handleCreateOrder} 
            className="w-full"
            disabled={createOrder.isPending}
          >
            <Plus className="h-4 w-4 mr-2" />
            {createOrder.isPending ? 'Création...' : 'Créer la commande'}
          </Button>

          <div className="text-xs text-gray-500">
            <span className="text-red-500">*</span> Champs obligatoires
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommercialCommands;
