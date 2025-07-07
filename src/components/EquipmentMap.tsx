import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import GoogleMapsWrapper from './GoogleMapsWrapper';

const EquipmentMap = () => {
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const equipments = [
    { id: 'PCO-75001-001', type: 'PCO', location: 'Paris 1er', lat: 48.8566, lng: 2.3522, status: 'Actif', capacity: 85, zone: 'Zone A' },
    { id: 'PCO-75012-004', type: 'PCO', location: 'Paris 12ème', lat: 48.8448, lng: 2.3737, status: 'Saturé', capacity: 95, zone: 'Zone B' },
    { id: 'MSAN-92100-02', type: 'MSAN', location: 'Boulogne', lat: 48.8414, lng: 2.2394, status: 'Panne', capacity: 0, zone: 'Zone C' },
    { id: 'SRO-69003-012', type: 'SRO', location: 'Lyon 3ème', lat: 45.7640, lng: 4.8357, status: 'Actif', capacity: 67, zone: 'Zone D' },
    { id: 'SPL-13001-008', type: 'SPL', location: 'Marseille 1er', lat: 43.2965, lng: 5.3698, status: 'Actif', capacity: 42, zone: 'Zone E' }
  ];

  const getStatusInfo = (status: string, capacity: number) => {
    if (status === 'Panne') {
      return { color: 'bg-red-500', badge: 'bg-red-100 text-red-800', icon: XCircle };
    } else if (status === 'Saturé' || capacity >= 90) {
      return { color: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
    } else {
      return { color: 'bg-green-500', badge: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const handleEquipmentClick = (equipment: any) => {
    setSelectedEquipment(equipment);
    console.log('Équipement sélectionné:', equipment);
  };

  const zoneStats = {
    'Zone A': { total: 12, active: 11, issues: 1 },
    'Zone B': { total: 8, active: 6, issues: 2 },
    'Zone C': { total: 15, active: 13, issues: 2 },
    'Zone D': { total: 10, active: 10, issues: 0 },
    'Zone E': { total: 7, active: 7, issues: 0 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Supervision Réseau</h2>
          <p className="text-gray-600">Cartographie et état des équipements FTTH</p>
        </div>
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">Carte Interactive</TabsTrigger>
          <TabsTrigger value="zones">Gestion par Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Google Maps */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Carte des Équipements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GoogleMapsWrapper 
                    equipments={equipments} 
                    onEquipmentClick={handleEquipmentClick}
                  />
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Pour utiliser Google Maps, ajoutez votre clé API dans les variables d'environnement : 
                      <code className="bg-yellow-100 px-1 rounded">REACT_APP_GOOGLE_MAPS_API_KEY</code>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Panneau d'informations */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">État Global</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Opérationnels</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">47</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm">Saturés</span>
                    </div>
                    <Badge className="bg-orange-100 text-orange-800">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">En panne</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">2</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Équipements Critiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {equipments.filter(eq => eq.status !== 'Actif').map((equipment) => {
                    const statusInfo = getStatusInfo(equipment.status, equipment.capacity);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <div key={equipment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <StatusIcon className="h-5 w-5 text-red-600" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{equipment.id}</p>
                          <p className="text-xs text-gray-600">{equipment.location}</p>
                        </div>
                        <Badge className={statusInfo.badge}>
                          {equipment.status}
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {selectedEquipment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Équipement Sélectionné</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{selectedEquipment.id}</p>
                      <p className="text-sm text-gray-600">{selectedEquipment.location}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusInfo(selectedEquipment.status, selectedEquipment.capacity).badge}>
                          {selectedEquipment.status}
                        </Badge>
                        <span className="text-sm">{selectedEquipment.capacity}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(zoneStats).map(([zone, stats]) => (
              <Card key={zone}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{zone}</span>
                    <Activity className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-600">Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-xs text-gray-600">Actifs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-red-600">{stats.issues}</p>
                      <p className="text-xs text-gray-600">Alertes</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Liste des Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {equipments.map((equipment) => {
                  const statusInfo = getStatusInfo(equipment.status, equipment.capacity);
                  return (
                    <div key={equipment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 ${statusInfo.color} rounded-full`}></div>
                        <div>
                          <p className="font-semibold text-gray-900">{equipment.id}</p>
                          <p className="text-sm text-gray-600">{equipment.type} - {equipment.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{equipment.capacity}%</p>
                          <p className="text-xs text-gray-500">Capacité</p>
                        </div>
                        <Badge className={statusInfo.badge}>
                          {equipment.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentMap;
