
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const DashboardStats = () => {
  const stats = [
    {
      title: "Commandes Actives",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Activity,
      color: "blue"
    },
    {
      title: "Équipements",
      value: "2,849",
      change: "+5%",
      trend: "up",
      icon: Zap,
      color: "green"
    },
    {
      title: "Tickets Ouverts",
      value: "89",
      change: "-23%",
      trend: "down",
      icon: TrendingDown,
      color: "orange"
    },
    {
      title: "Taux de Réussite",
      value: "96.8%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "green"
    }
  ];

  const recentActivities = [
    { time: "09:45", action: "Nouvelle commande FTTH", location: "Paris 12ème", status: "En cours" },
    { time: "09:32", action: "Ticket résolu", location: "Lyon 3ème", status: "Terminé" },
    { time: "09:18", action: "Équipement ajouté", location: "Marseille 8ème", status: "Actif" },
    { time: "09:05", action: "Étude de faisabilité", location: "Toulouse 1er", status: "Validée" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.color === 'blue' ? 'bg-blue-100' :
                    stat.color === 'green' ? 'bg-green-100' :
                    stat.color === 'orange' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      stat.color === 'blue' ? 'text-blue-600' :
                      stat.color === 'green' ? 'text-green-600' :
                      stat.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <Badge 
                    variant="outline"
                    className={`${
                      stat.trend === 'up' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-sm text-gray-600 ml-2">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="text-sm font-mono text-gray-500 min-w-[50px]">
                  {activity.time}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                </div>
                <Badge 
                  variant={activity.status === 'Terminé' ? 'default' : 'secondary'}
                  className={
                    activity.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                    activity.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    activity.status === 'Actif' ? 'bg-green-100 text-green-800' :
                    'bg-orange-100 text-orange-800'
                  }
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
