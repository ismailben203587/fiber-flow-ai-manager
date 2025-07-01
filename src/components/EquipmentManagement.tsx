
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Activity, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EquipmentManagement = () => {
  const { toast } = useToast();
  const [newEquipment, setNewEquipment] = useState({
    id: '',
    type: '',
    location: '',
    zone: '',
    capacity: ''
  });

  const equipments = [
    { id: 'PCO-75001-001', type: 'PCO', location: 'Paris 1er', zone: 'Zone A', capacity: '144 ports', status: 'Actif', utilization: 85 },
    { id: 'PCO-75012-004', type: 'PCO', location: 'Paris 12ème', zone: 'Zone B', capacity: '288 ports', status: 'Saturé', utilization: 95 },
    { id: 'MSAN-92100-02', type: 'MSAN', location: 'Boulogne', zone: 'Zone C', capacity: '1024 ports', status: 'Panne', utilization: 0 },
    { id: 'SRO-69003-012', type: 'SRO', location: 'Lyon 3ème', zone: 'Zone D', capacity: '72 ports', status: 'Actif', utilization: 67 },
    { id: 'SPL-13001-008', type: 'SPL', location: 'Marseille 1er', zone: 'Zone E', capacity: '24 ports', status: 'Actif', utilization: 42 }
  ];

  const feasibilityTests = [
    { id: 'TEST-001', address: '15 Rue de la Paix, Paris 75001', result: 'Faisable', pco: 'PCO-75001-001', distance: '150m', confidence: 95 },
    { id: 'TEST-002', address: '22 Avenue Victor Hugo, Lyon 69003', result: 'Faisable', pco: 'SRO-69003-012', distance: '80m', confidence: 98 },
    { id: 'TEST-003', address: '8 Boulevard Saint-Germain, Marseille 13001', result: 'Non faisable', pco: 'N/A', distance: 'N/A', confidence: 15 },
    { id: 'TEST-004', address: '45 Rue de Rivoli, Toulouse 31000', result: 'À vérifier', pco: 'PCO-31000-001', distance: '220m', confidence: 65 }
  ];

  const handleAddEquipment = () => {
    if (!newEquipment.id || !newEquipment.type || !newEquipment.location) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Équipement ajouté",
      description: `L'équipement ${newEquipment.id} a été enregistré avec succès.`,
    });

    setNewEquipment({
      id: '',
      type: '',
      location: '',
      zone: '',
      capacity: ''
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Actif':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case 'Saturé':
        return <Badge className="bg-orange-100 text-orange-800">{status}</Badge>;
      case 'Panne':
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
      case 'Maintenance':
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'Faisable':
        return <Badge className="bg-green-100 text-green-800">{result}</Badge>;
      case 'Non faisable':
        return <Badge className="bg-red-100 text-red-800">{result}</Badge>;
      case 'À vérifier':
        return <Badge className="bg-yellow-100 text-yellow-800">{result}</Badge>;
      default:
        return <Badge variant="outline">{result}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Module Technique</h2>
          <p className="text-gray-600">Gestion des équipements et études de faisabilité</p>
        </div>
      </div>

      <Tabs defaultValue="equipments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="equipments">Équipements</TabsTrigger>
          <TabsTrigger value="add-equipment">Ajouter Équipement</TabsTrigger>
          <TabsTrigger value="feasibility">Études IA</TabsTrigger>
        </TabsList>

        <TabsContent value="equipments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">PCO</p>
                    <p className="text-xl font-bold">28</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">MSAN</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                  <Settings className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">SRO</p>
                    <p className="text-xl font-bold">45</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">SPL</p>
                    <p className="text-xl font-bold">156</p>
                  </div>
                  <Activity className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Liste des Équipements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {equipments.map((equipment) => (
                  <div key={equipment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{equipment.id}</h3>
                          <Badge variant="outline">{equipment.type}</Badge>
                          {getStatusBadge(equipment.status)}
                        </div>
                        <p className="text-sm text-gray-600">{equipment.location} - {equipment.zone}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{equipment.utilization}%</p>
                          <p className="text-xs text-gray-500">Utilisation</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configurer
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t text-sm">
                      <div>
                        <p className="text-gray-500">Capacité</p>
                        <p className="font-medium">{equipment.capacity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Zone</p>
                        <p className="font-medium">{equipment.zone}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Disponibilité</p>
                        <p className="font-medium">{100 - equipment.utilization}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-equipment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Ajouter un Nouvel Équipement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="equipmentId">Identifiant *</Label>
                  <Input
                    id="equipmentId"
                    value={newEquipment.id}
                    onChange={(e) => setNewEquipment({ ...newEquipment, id: e.target.value })}
                    placeholder="PCO-75001-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipmentType">Type d'équipement *</Label>
                  <Select value={newEquipment.type} onValueChange={(value) => setNewEquipment({ ...newEquipment, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PCO">PCO (Point de Concentration Optique)</SelectItem>
                      <SelectItem value="MSAN">MSAN (Multi-Service Access Node)</SelectItem>
                      <SelectItem value="SRO">SRO (Sous-Répartiteur Optique)</SelectItem>
                      <SelectItem value="SPL">SPL (Splitter)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    value={newEquipment.location}
                    onChange={(e) => setNewEquipment({ ...newEquipment, location: e.target.value })}
                    placeholder="Paris 1er"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zone">Zone géographique</Label>
                  <Select value={newEquipment.zone} onValueChange={(value) => setNewEquipment({ ...newEquipment, zone: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zone A">Zone A</SelectItem>
                      <SelectItem value="Zone B">Zone B</SelectItem>
                      <SelectItem value="Zone C">Zone C</SelectItem>
                      <SelectItem value="Zone D">Zone D</SelectItem>
                      <SelectItem value="Zone E">Zone E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacité</Label>
                <Input
                  id="capacity"
                  value={newEquipment.capacity}
                  onChange={(e) => setNewEquipment({ ...newEquipment, capacity: e.target.value })}
                  placeholder="144 ports"
                />
              </div>

              <Button onClick={handleAddEquipment} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter l'équipement
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feasibility" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Études de Faisabilité IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feasibilityTests.map((test) => (
                      <div key={test.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{test.id}</h3>
                              {getResultBadge(test.result)}
                            </div>
                            <p className="text-sm text-gray-600">{test.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">Confiance: {test.confidence}%</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t text-sm">
                          <div>
                            <p className="text-gray-500">PCO le plus proche</p>
                            <p className="font-medium">{test.pco}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Distance</p>
                            <p className="font-medium">{test.distance}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Analyse IA</p>
                            <p className="font-medium">{test.confidence}% confiance</p>
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
                  <CardTitle className="text-lg">Analyse IA</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="mb-3">L'IA analyse automatiquement :</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Distance aux équipements</li>
                      <li>Capacité disponible</li>
                      <li>Contraintes techniques</li>
                      <li>Historique des refus</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Taux de faisabilité</span>
                    <Badge className="bg-green-100 text-green-800">78%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Analyses aujourd'hui</span>
                    <Badge className="bg-blue-100 text-blue-800">24</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Précision IA</span>
                    <Badge className="bg-green-100 text-green-800">94%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EquipmentManagement;
