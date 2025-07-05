
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Clock, CheckCircle, AlertCircle, Router } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFTTHOrders, useCreateFTTHOrder } from '@/hooks/useOrders';

const CommercialCommands = () => {
  const { toast } = useToast();
  const { data: orders, isLoading } = useFTTHOrders();
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
    if (!newOrder.clientName || !newOrder.clientAddress || !newOrder.clientCin) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (nom, adresse, CIN)",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate order number
      const orderNumber = `CMD-${Date.now().toString().slice(-6)}`;
      
      await createOrder.mutateAsync({
        order_number: orderNumber,
        client_name: newOrder.clientName,
        client_address: newOrder.clientAddress,
        client_phone: newOrder.clientPhone || null,
        client_email: newOrder.clientEmail || null,
        client_cin: newOrder.clientCin,
        service_type: newOrder.serviceType,
        status: 'pending',
        feasibility_status: 'pending'
      });

      toast({
        title: "Commande créée avec succès",
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
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de la commande",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Package className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFeasibilityBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">En cours</Badge>;
      case 'feasible':
        return <Badge className="bg-green-100 text-green-800">Faisable</Badge>;
      case 'not_feasible':
        return <Badge className="bg-red-100 text-red-800">Non faisable</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Commandes FTTH
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders && orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{order.order_number}</h3>
                            {getStatusBadge(order.status || 'pending')}
                            {getFeasibilityBadge(order.feasibility_status || 'pending')}
                            {order.client_number && (
                              <Badge variant="outline">
                                Client: {order.client_number}
                              </Badge>
                            )}
                            {order.voip_number && (
                              <Badge variant="outline">
                                VOIP: {order.voip_number}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{order.client_name}</p>
                          <p className="text-sm text-gray-500">{order.client_address}</p>
                          {order.client_phone && (
                            <p className="text-sm text-gray-500">Tél: {order.client_phone}</p>
                          )}
                          {order.client_email && (
                            <p className="text-sm text-gray-500">Email: {order.client_email}</p>
                          )}
                          {order.client_cin && (
                            <p className="text-sm text-gray-500">CIN: {order.client_cin}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status || 'pending')}
                          <Router className="h-4 w-4 text-blue-500" />
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 pt-2 border-t">
                        Créée le {new Date(order.created_at || '').toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune commande</h3>
                    <p className="text-gray-500">Les commandes FTTH apparaîtront ici une fois créées.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvelle Commande FTTH
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Nom du client *</Label>
                <Input
                  id="clientName"
                  value={newOrder.clientName}
                  onChange={(e) => setNewOrder({ ...newOrder, clientName: e.target.value })}
                  placeholder="Nom complet du client"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientCin">CIN *</Label>
                <Input
                  id="clientCin"
                  value={newOrder.clientCin}
                  onChange={(e) => setNewOrder({ ...newOrder, clientCin: e.target.value })}
                  placeholder="Numéro CIN"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Adresse *</Label>
                <Input
                  id="clientAddress"
                  value={newOrder.clientAddress}
                  onChange={(e) => setNewOrder({ ...newOrder, clientAddress: e.target.value })}
                  placeholder="Adresse complète d'installation"
                />
              </div>

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommercialCommands;
