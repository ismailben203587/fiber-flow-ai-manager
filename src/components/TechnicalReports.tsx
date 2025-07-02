
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const TechnicalReports = () => {
  const reports = [
    {
      id: 'RPT-001',
      title: 'Rapport mensuel des interventions',
      type: 'Interventions',
      period: 'Janvier 2024',
      status: 'Disponible',
      generatedAt: '2024-02-01',
      size: '2.4 MB'
    },
    {
      id: 'RPT-002',
      title: 'Analyse des pannes réseau',
      type: 'Pannes',
      period: 'Dernière semaine',
      status: 'En cours',
      generatedAt: '2024-01-28',
      size: '1.8 MB'
    },
    {
      id: 'RPT-003',
      title: 'Performance des équipements',
      type: 'Performance',
      period: 'Trimestre Q4 2023',
      status: 'Disponible',
      generatedAt: '2024-01-15',
      size: '3.2 MB'
    }
  ];

  const stats = [
    { label: 'Tickets résolus ce mois', value: '142', trend: '+12%', color: 'green' },
    { label: 'Temps moyen de résolution', value: '2.3h', trend: '-15%', color: 'green' },
    { label: 'Taux de satisfaction client', value: '94%', trend: '+3%', color: 'green' },
    { label: 'Pannes critiques', value: '3', trend: '-50%', color: 'red' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Disponible':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case 'En cours':
        return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Interventions':
        return <Badge className="bg-blue-100 text-blue-800">{type}</Badge>;
      case 'Pannes':
        return <Badge className="bg-red-100 text-red-800">{type}</Badge>;
      case 'Performance':
        return <Badge className="bg-purple-100 text-purple-800">{type}</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-blue-100">Rapports Techniques</h2>
          <p className="text-blue-300">Analyses et statistiques des performances techniques</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileText className="h-4 w-4 mr-2" />
          Nouveau rapport
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-blue-600/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">{stat.label}</p>
                  <p className="text-2xl font-bold text-blue-100">{stat.value}</p>
                </div>
                <div className={`flex items-center text-sm ${
                  stat.color === 'green' ? 'text-green-400' : 'text-red-400'
                }`}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.trend}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-blue-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-100">
              <FileText className="h-5 w-5" />
              Rapports Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-blue-600/20 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-blue-100">{report.title}</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-blue-300 mb-1">{report.period}</p>
                      <p className="text-xs text-blue-400">Généré le {report.generatedAt} • {report.size}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-blue-600/20">
                    <div className="flex items-center space-x-2">
                      {getTypeBadge(report.type)}
                      <span className="text-xs text-blue-400">{report.id}</span>
                    </div>
                    <Button variant="outline" size="sm" className="text-blue-300 border-blue-600/20 hover:bg-blue-600/20">
                      <Download className="h-3 w-3 mr-1" />
                      Télécharger
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-blue-600/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-100">
              <BarChart3 className="h-5 w-5" />
              Analyses Rapides
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-600/10 rounded-lg border border-blue-600/20">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <h4 className="font-medium text-blue-100">Alertes Techniques</h4>
              </div>
              <p className="text-sm text-blue-300">
                3 équipements nécessitent une attention particulière
              </p>
            </div>

            <div className="p-4 bg-green-600/10 rounded-lg border border-green-600/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <h4 className="font-medium text-blue-100">Performance Réseau</h4>
              </div>
              <p className="text-sm text-blue-300">
                Amélioration de 15% de la disponibilité réseau
              </p>
            </div>

            <div className="p-4 bg-blue-600/10 rounded-lg border border-blue-600/20">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <h4 className="font-medium text-blue-100">Statistiques Hebdomadaires</h4>
              </div>
              <p className="text-sm text-blue-300">
                24 interventions réalisées cette semaine
              </p>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Générer rapport personnalisé
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalReports;
