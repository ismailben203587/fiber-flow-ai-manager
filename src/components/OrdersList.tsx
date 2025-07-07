
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Calendar, User, Phone, MapPin } from "lucide-react";
import { useFTTHOrders } from "@/hooks/useOrders";

const OrdersList = () => {
  const { data: orders = [], isLoading } = useFTTHOrders();

  const getStatusBadge = (order: any) => {
    if (order.feasibility_status === 'approved' && order.status === 'feasible') {
      return <Badge className="bg-green-100 text-green-800">✅ Approuvée</Badge>;
    }
    if (order.feasibility_status === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">❌ Rejetée</Badge>;
    }
    if (order.feasibility_status === 'pending') {
      return <Badge className="bg-yellow-100 text-yellow-800">🔍 En cours d'analyse</Badge>;
    }
    if (order.status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800">🎉 Terminée</Badge>;
    }
    return <Badge variant="outline">En attente</Badge>;
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-lg">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="h-6 w-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Toutes les Commandes ({orders.length})
        </h2>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune commande trouvée
            </h3>
            <p className="text-gray-600">
              Les commandes créées apparaîtront ici
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-emerald-700">
                      {order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      {getStatusBadge(order)}
                      <Badge variant="outline" className="text-xs">
                        {order.service_type || 'FTTH'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{order.client_name}</span>
                    </div>
                    {order.client_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{order.client_phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600">{order.client_address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.client_number && (
                      <div className="text-sm">
                        <span className="font-medium">N° Client: </span>
                        {order.client_number}
                      </div>
                    )}
                    {order.voip_number && (
                      <div className="text-sm">
                        <span className="font-medium">VOIP: </span>
                        {order.voip_number}
                      </div>
                    )}
                    {order.distance_to_pco && (
                      <div className="text-sm">
                        <span className="font-medium">Distance PCO: </span>
                        {order.distance_to_pco.toFixed(2)} km
                        {order.distance_to_pco > 2 && (
                          <span className="text-red-600 ml-1">⚠️</span>
                        )}
                      </div>
                    )}
                    {order.distance_to_msan && (
                      <div className="text-sm">
                        <span className="font-medium">Distance MSAN: </span>
                        {order.distance_to_msan.toFixed(2)} km
                        {order.distance_to_msan > 5 && (
                          <span className="text-red-600 ml-1">⚠️</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
