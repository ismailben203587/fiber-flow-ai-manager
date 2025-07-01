
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import DashboardStats from '@/components/DashboardStats';
import CommandModule from '@/components/CommandModule';
import EquipmentMap from '@/components/EquipmentMap';
import TicketManagement from '@/components/TicketManagement';
import EquipmentManagement from '@/components/EquipmentManagement';

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 gradient-telecom rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">FT</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FTTH Manager</h1>
                <p className="text-sm text-gray-500">Supervision Réseau Télécom</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Système Opérationnel
              </Badge>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-max lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              📊 Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="commercial" className="flex items-center gap-2">
              🏢 Commercial
            </TabsTrigger>
            <TabsTrigger value="technique" className="flex items-center gap-2">
              🔧 Technique
            </TabsTrigger>
            <TabsTrigger value="supervision" className="flex items-center gap-2">
              🗺️ Supervision
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              🎫 Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardStats />
              </div>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">État du Réseau</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Équipements Actifs</span>
                      <Badge className="bg-green-100 text-green-800">98.7%</Badge>
                    </div>
                    <Progress value={98.7} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Capacité Utilisée</span>
                      <Badge className="bg-blue-100 text-blue-800">72.3%</Badge>
                    </div>
                    <Progress value={72.3} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">SLA Respecté</span>
                      <Badge className="bg-green-100 text-green-800">99.2%</Badge>
                    </div>
                    <Progress value={99.2} className="h-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Alertes Récentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">PCO-75012-04</p>
                        <p className="text-xs text-gray-600">Capacité à 85%</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">MSAN-92100-02</p>
                        <p className="text-xs text-gray-600">Panne signalée</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="commercial">
            <CommandModule />
          </TabsContent>

          <TabsContent value="technique">
            <EquipmentManagement />
          </TabsContent>

          <TabsContent value="supervision">
            <EquipmentMap />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
