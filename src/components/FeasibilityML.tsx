import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Brain, Target, TrendingUp, FileSpreadsheet } from 'lucide-react';

interface PredictionResult {
  feasibility: string;
  confidence: number;
  details: {
    raw_score: number;
    probability: number;
    geographical_score: number;
    features: any;
  };
}

interface PredictionItem {
  input: any;
  prediction: PredictionResult;
}

export function FeasibilityML() {
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isModelTrained, setIsModelTrained] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [predictionInput, setPredictionInput] = useState({
    Province: 'RABAT',
    COMMUNE: '',
    QUARTIER: '',
    VOIE: '',
    ZONE: '',
    Capacité: '8'
  });
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [batchResults, setBatchResults] = useState<PredictionItem[]>([]);
  const [trainingStatus, setTrainingStatus] = useState('');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier CSV valide.'
      });
    }
  };

  const trainModel = async () => {
    if (!csvFile) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez d\'abord uploader un fichier CSV.'
      });
      return;
    }

    setIsTraining(true);
    setTrainingStatus('Lecture du fichier CSV...');

    try {
      const csvContent = await csvFile.text();
      setTrainingStatus('Entraînement du modèle...');

      const { data, error } = await supabase.functions.invoke('ml-feasibility-prediction', {
        body: {
          action: 'train',
          csvContent
        }
      });

      if (error) throw error;

      setIsModelTrained(true);
      setTrainingStatus('Modèle entraîné avec succès !');
      toast({
        title: 'Succès',
        description: `Modèle entraîné avec ${data.message}`
      });

    } catch (error: any) {
      console.error('Training error:', error);
      setTrainingStatus('Erreur lors de l\'entraînement');
      toast({
        variant: 'destructive',
        title: 'Erreur d\'entraînement',
        description: error.message || 'Une erreur est survenue lors de l\'entraînement du modèle.'
      });
    } finally {
      setIsTraining(false);
    }
  };

  const makePrediction = async () => {
    if (!isModelTrained) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez d\'abord entraîner le modèle.'
      });
      return;
    }

    setIsPredicting(true);

    try {
      const { data, error } = await supabase.functions.invoke('ml-feasibility-prediction', {
        body: {
          action: 'predict',
          data: predictionInput
        }
      });

      if (error) throw error;

      setPredictionResult(data.prediction);
      toast({
        title: 'Prédiction réalisée',
        description: `Faisabilité: ${data.prediction.feasibility}`
      });

    } catch (error: any) {
      console.error('Prediction error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de prédiction',
        description: error.message || 'Une erreur est survenue lors de la prédiction.'
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const makeBatchPrediction = async () => {
    if (!isModelTrained) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Veuillez d\'abord entraîner le modèle.'
      });
      return;
    }

    // Données d'exemple pour les prédictions en lot
    const batchData = [
      { Province: 'RABAT', COMMUNE: 'RABAT AGDAL RYAD', QUARTIER: 'Agdal', VOIE: 'MAROC TELECOM RUE PRINCIPALE', ZONE: 'RAB-AG' },
      { Province: 'RABAT', COMMUNE: 'RABAT YACOUB EL MANSOUR', QUARTIER: 'Bouitat', VOIE: 'GROUPE RESIDENTIEL', ZONE: 'RAB-BO1' },
      { Province: 'RABAT', COMMUNE: 'RABAT YACOUB EL MANSOUR', QUARTIER: 'Industriel', VOIE: 'ZONE INDUSTRIELLE AV HASSAN', ZONE: 'RAB-INDUS' }
    ];

    setIsPredicting(true);

    try {
      const { data, error } = await supabase.functions.invoke('ml-feasibility-prediction', {
        body: {
          action: 'batch_predict',
          data: batchData
        }
      });

      if (error) throw error;

      setBatchResults(data.predictions);
      toast({
        title: 'Prédictions réalisées',
        description: `${data.predictions.length} prédictions effectuées`
      });

    } catch (error: any) {
      console.error('Batch prediction error:', error);
      toast({
        variant: 'destructive',
        title: 'Erreur de prédiction',
        description: error.message || 'Une erreur est survenue lors des prédictions.'
      });
    } finally {
      setIsPredicting(false);
    }
  };

  const getFeasibilityColor = (feasibility: string) => {
    switch (feasibility.toLowerCase()) {
      case 'faisable': return 'bg-green-500';
      case 'non faisable': return 'bg-red-500';
      case 'etude': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Machine Learning - Prédiction de Faisabilité FTTH
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="training" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="training" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Entraînement
              </TabsTrigger>
              <TabsTrigger value="prediction" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Prédiction
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Prédictions en lot
              </TabsTrigger>
            </TabsList>

            {/* Onglet Entraînement */}
            <TabsContent value="training" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload">Fichier CSV d'entraînement</Label>
                  <div className="mt-2">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  {csvFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Fichier sélectionné: {csvFile.name}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={trainModel} 
                  disabled={!csvFile || isTraining}
                  className="w-full"
                >
                  {isTraining ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Entraînement en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Entraîner le Modèle
                    </>
                  )}
                </Button>

                {trainingStatus && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm">{trainingStatus}</p>
                  </div>
                )}

                {isModelTrained && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ Modèle entraîné et prêt
                  </Badge>
                )}
              </div>
            </TabsContent>

            {/* Onglet Prédiction */}
            <TabsContent value="prediction" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="province">Province</Label>
                  <Input
                    id="province"
                    value={predictionInput.Province}
                    onChange={(e) => setPredictionInput({...predictionInput, Province: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="commune">Commune</Label>
                  <Input
                    id="commune"
                    value={predictionInput.COMMUNE}
                    onChange={(e) => setPredictionInput({...predictionInput, COMMUNE: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="quartier">Quartier</Label>
                  <Input
                    id="quartier"
                    value={predictionInput.QUARTIER}
                    onChange={(e) => setPredictionInput({...predictionInput, QUARTIER: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    value={predictionInput.ZONE}
                    onChange={(e) => setPredictionInput({...predictionInput, ZONE: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="voie">Voie/Adresse</Label>
                  <Input
                    id="voie"
                    value={predictionInput.VOIE}
                    onChange={(e) => setPredictionInput({...predictionInput, VOIE: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="capacite">Capacité</Label>
                  <Input
                    id="capacite"
                    type="number"
                    value={predictionInput.Capacité}
                    onChange={(e) => setPredictionInput({...predictionInput, Capacité: e.target.value})}
                  />
                </div>
              </div>

              <Button 
                onClick={makePrediction} 
                disabled={!isModelTrained || isPredicting}
                className="w-full"
              >
                {isPredicting ? (
                  <>
                    <Target className="w-4 h-4 mr-2 animate-spin" />
                    Prédiction en cours...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Faire une Prédiction
                  </>
                )}
              </Button>

              {predictionResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Résultat de la Prédiction</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getFeasibilityColor(predictionResult.feasibility)}>
                        {predictionResult.feasibility}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Confiance: {(predictionResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Score géographique:</span>
                        <span className="ml-2">{predictionResult.details.geographical_score.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Probabilité:</span>
                        <span className="ml-2">{(predictionResult.details.probability * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Onglet Prédictions en lot */}
            <TabsContent value="batch" className="space-y-4">
              <Button 
                onClick={makeBatchPrediction} 
                disabled={!isModelTrained || isPredicting}
                className="w-full"
              >
                {isPredicting ? (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Analyser les Exemples
                  </>
                )}
              </Button>

              {batchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Résultats des Prédictions</h3>
                  {batchResults.map((item, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm">
                            <strong>{item.input.QUARTIER}</strong> - {item.input.VOIE}
                          </div>
                          <Badge className={getFeasibilityColor(item.prediction.feasibility)}>
                            {item.prediction.feasibility}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Zone: {item.input.ZONE} | Confiance: {(item.prediction.confidence * 100).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}