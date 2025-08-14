import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MLAddress {
  province: string;
  commune: string;
  quartier: string;
  voie: string;
  zone?: string;
  identifiant_pco?: string;
  capacite?: number;
  faisabilite?: string;
}

const MLAddressManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [totalAddresses, setTotalAddresses] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (csvContent: string): MLAddress[] => {
    const lines = csvContent.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(/[;,\t]/).map(h => h.trim().replace(/\r/g, ''));
    console.log('CSV Headers:', headers);

    const data: MLAddress[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(/[;,\t]/).map(v => v.trim().replace(/\r/g, ''));
      
      if (values.length >= 4) {
        const address: MLAddress = {
          province: values[0] || '',
          commune: values[1] || '',
          quartier: values[2] || '',
          voie: values[3] || '',
          zone: values[5] || undefined,
          identifiant_pco: values[6] || undefined,
          capacite: values[7] ? parseInt(values[7]) : undefined,
          faisabilite: values[8] || undefined
        };
        
        // Valider que les champs obligatoires ne sont pas vides
        if (address.province && address.commune && address.quartier && address.voie) {
          data.push(address);
        }
      }
    }
    
    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setUploadStatus('idle');

    try {
      const csvContent = await file.text();
      const addresses = parseCSV(csvContent);
      
      if (addresses.length === 0) {
        throw new Error('Aucune adresse valide trouvée dans le fichier');
      }

      // Vider la table existante
      await supabase.from('ml_addresses').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insérer les nouvelles adresses par batch
      const batchSize = 100;
      let insertedCount = 0;

      for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const { error } = await supabase.from('ml_addresses').insert(batch);
        
        if (error) {
          throw error;
        }
        
        insertedCount += batch.length;
      }

      setTotalAddresses(insertedCount);
      setUploadStatus('success');
      setUploadMessage(`${insertedCount} adresses importées avec succès`);
      
      toast({
        title: "Import réussi",
        description: `${insertedCount} adresses ont été importées dans la base de données`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Erreur lors de l\'import');
      
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : 'Erreur lors de l\'import',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const clearAddresses = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('ml_addresses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error) throw error;
      
      setTotalAddresses(0);
      setUploadStatus('idle');
      setUploadMessage('');
      
      toast({
        title: "Adresses supprimées",
        description: "Toutes les adresses ont été supprimées de la base de données",
      });
      
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression des adresses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentCount = async () => {
    try {
      const { count, error } = await supabase
        .from('ml_addresses')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setTotalAddresses(count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    }
  };

  React.useEffect(() => {
    loadCurrentCount();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gestion des Adresses ML
        </CardTitle>
        <CardDescription>
          Importez les adresses depuis un fichier CSV pour alimenter la base de données ML
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Statut actuel */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Adresses en base :</span>
            <span className="text-lg font-bold">{totalAddresses}</span>
          </div>
        </div>

        {/* Upload de fichier */}
        <div className="space-y-4">
          <Label htmlFor="csv-file">Fichier CSV des adresses</Label>
          <div className="flex items-center gap-4">
            <Input
              ref={fileInputRef}
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              variant="outline"
            >
              <Upload className="h-4 w-4 mr-2" />
              Sélectionner
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Format attendu : Province;COMMUNE;QUARTIER;VOIE;géographique;ZONE;Identifiant PCO;Capacité;Faisabilité
          </p>
        </div>

        {/* Messages de statut */}
        {uploadStatus !== 'idle' && (
          <Alert variant={uploadStatus === 'success' ? 'default' : 'destructive'}>
            {uploadStatus === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{uploadMessage}</AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isLoading ? 'Import en cours...' : 'Importer CSV'}
          </Button>
          
          {totalAddresses > 0 && (
            <Button
              onClick={clearAddresses}
              disabled={isLoading}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Vider
            </Button>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Instructions :</strong></p>
          <p>• Le fichier CSV doit contenir les colonnes : Province, COMMUNE, QUARTIER, VOIE</p>
          <p>• Les colonnes géographique, ZONE, Identifiant PCO, Capacité et Faisabilité sont optionnelles</p>
          <p>• L'import remplace toutes les adresses existantes</p>
          <p>• Les adresses seront disponibles immédiatement pour la création de commandes</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MLAddressManager;