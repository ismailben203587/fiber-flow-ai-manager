import DashboardNavigation from '@/components/DashboardNavigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Wrench, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Phone,
  User
} from 'lucide-react';

interface TechnicienDashboardProps {
  onGoHome: () => void;
}

const TechnicienDashboard = ({ onGoHome }: TechnicienDashboardProps) => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardNavigation onGoHome={onGoHome} />
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent animate-float">
            SMART TELECOM Technicien
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gestion de vos interventions et tickets assignés
          </p>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets en cours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                +1 depuis hier
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgences</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">1</div>
              <p className="text-xs text-muted-foreground">
                Intervention critique
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Terminés aujourd'hui</CardTitle>
              <CheckCircle className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">2</div>
              <p className="text-xs text-muted-foreground">
                Bonne progression
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card animate-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prochaine intervention</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14:30</div>
              <p className="text-xs text-muted-foreground">
                Installation FTTH
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tickets assignés */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Mes Tickets Assignés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Ticket urgent */}
              <div className="flex items-center justify-between p-4 border rounded-lg glass-card border-destructive/30">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">URGENT</Badge>
                      <span className="font-semibold">TIC-2024-001</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Panne fibre optique - Client sans connexion
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Marie Dubois</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>15 rue de la Paix, 75001 Paris</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>10001234</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser
                  </Button>
                  <Button size="sm">
                    Traiter
                  </Button>
                </div>
              </div>

              {/* Ticket normal */}
              <div className="flex items-center justify-between p-4 border rounded-lg glass-card">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">MOYEN</Badge>
                      <span className="font-semibold">TIC-2024-002</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Installation nouvelle ligne FTTH
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Jean Martin</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>42 avenue des Champs, 75008 Paris</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>10001235</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser
                  </Button>
                  <Button size="sm" variant="outline">
                    Traiter
                  </Button>
                </div>
              </div>

              {/* Ticket normal */}
              <div className="flex items-center justify-between p-4 border rounded-lg glass-card">
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">FAIBLE</Badge>
                      <span className="font-semibold">TIC-2024-003</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Maintenance préventive équipement
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>Sophie Bernard</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>28 rue Victor Hugo, 75016 Paris</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>10001236</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser
                  </Button>
                  <Button size="sm" variant="outline">
                    Traiter
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicienDashboard;