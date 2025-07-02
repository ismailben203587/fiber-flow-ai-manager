
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Wrench } from "lucide-react";
import CommercialDashboard from "./CommercialDashboard";
import TechnicalDashboard from "./TechnicalDashboard";

const Index = () => {
  const [currentDashboard, setCurrentDashboard] = useState<'home' | 'commercial' | 'technical'>('home');

  if (currentDashboard === 'commercial') {
    return <CommercialDashboard />;
  }

  if (currentDashboard === 'technical') {
    return <TechnicalDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold gradient-telecom bg-clip-text text-transparent mb-4">
            Smart Telecom
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Plateforme intelligente de gestion et supervision d'un réseau FTTH
          </p>
          
          <div className="flex justify-center items-center gap-8">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-xs"></div>
            <div className="text-blue-400 font-medium">Choisissez votre espace</div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent flex-1 max-w-xs"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Dashboard Commercial */}
          <Card 
            className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setCurrentDashboard('commercial')}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-emerald-100">
                Espace Commercial
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-emerald-200 mb-6">
                Gestion des commandes, évaluation IA de faisabilité, suivi des clients et rapports commerciaux
              </p>
              <div className="space-y-2 text-sm text-emerald-300">
                <div className="flex items-center justify-between">
                  <span>• Nouvelles commandes FTTH</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Évaluation IA intégrée</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Suivi commercial</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Statistiques de vente</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white group-hover:shadow-lg transition-all duration-300"
                onClick={() => setCurrentDashboard('commercial')}
              >
                Accéder à l'espace commercial
              </Button>
            </CardContent>
          </Card>

          {/* Dashboard Technique */}
          <Card 
            className="bg-gradient-to-br from-blue-500/10 to-slate-500/10 border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer group"
            onClick={() => setCurrentDashboard('technical')}
          >
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-slate-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-100">
                Espace Technique
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-blue-200 mb-6">
                Supervision réseau, gestion des équipements, études techniques et maintenance FTTH
              </p>
              <div className="space-y-2 text-sm text-blue-300">
                <div className="flex items-center justify-between">
                  <span>• Études techniques approfondies</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Gestion PCO/MSAN</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Supervision réseau</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>• Tickets d'intervention</span>
                </div>
              </div>
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-slate-600 hover:from-blue-700 hover:to-slate-700 text-white group-hover:shadow-lg transition-all duration-300"
                onClick={() => setCurrentDashboard('technical')}
              >
                Accéder à l'espace technique
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            Plateforme développée pour optimiser la gestion des réseaux FTTH avec intelligence artificielle
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
