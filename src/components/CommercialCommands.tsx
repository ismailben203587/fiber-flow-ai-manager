
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCreateFTTHOrder } from '@/hooks/useOrders';

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
        feasibility_status: 'pending'
      };

      console.log('📋 Données commande à créer:', orderData);

      await createOrder.mutateAsync(orderData);

      toast({
        title: "✅ Commande créée avec succès",
        description: `La commande ${orderNumber} a été créée. L'étude de faisabilité va commencer automatiquement.`,
      });

      setNewOrder({
        clientName: '',
        clientAddress: '',
        clientPhone: '',
        clientEmail: '',
        clientCin: '',
        serviceType: 'FTTH'
      });
    } catch (error) {
      console.error('❌ Erreur création commande:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande. Vérifiez que tous les champs obligatoires sont remplis.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
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
              <Label htmlFor="clientName" className="flex items-center gap-1">
                Nom du client <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                value={newOrder.clientName}
                onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                placeholder="Nom complet du client"
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

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Automatisation:</strong> Un numéro client et un numéro VOIP seront automatiquement assignés lors de la création de la commande.
            </p>
          </div>

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
