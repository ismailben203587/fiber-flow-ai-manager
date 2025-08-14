import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CSVRow {
  Province: string;
  COMMUNE: string;
  QUARTIER: string;
  VOIE: string;
  géographique: string;
  ZONE: string;
  'Identifiant PCO': string;
  Capacité: string;
  Faisablité: string;
}

interface FeatureVector {
  province_encoded: number;
  commune_encoded: number;
  quartier_encoded: number;
  zone_encoded: number;
  capacite: number;
  geographical_score: number;
}

interface TrainingData {
  features: FeatureVector[];
  labels: number[]; // 0: Non faisable, 1: Faisable, 2: Etude
}

class SimpleFeasibilityPredictor {
  private provinceMap: Map<string, number> = new Map();
  private communeMap: Map<string, number> = new Map();
  private quartierMap: Map<string, number> = new Map();
  private zoneMap: Map<string, number> = new Map();
  private weights: number[] = [];
  private bias: number = 0;
  private isTrained: boolean = false;

  private encodeText(text: string, map: Map<string, number>): number {
    if (!map.has(text)) {
      map.set(text, map.size);
    }
    return map.get(text)!;
  }

  private calculateGeographicalScore(voie: string, quartier: string): number {
    // Score basé sur des mots-clés géographiques
    const keywords = {
      'centrale': 0.9,
      'bureau': 0.8,
      'maroc telecom': 0.9,
      'poste': 0.7,
      'avenue': 0.6,
      'rue': 0.5,
      'groupe': 0.3,
      'industriel': 0.4,
      'station': 0.6
    };

    let score = 0.5; // Score de base
    const text = (voie + ' ' + quartier).toLowerCase();
    
    for (const [keyword, weight] of Object.entries(keywords)) {
      if (text.includes(keyword)) {
        score = Math.max(score, weight);
      }
    }
    
    return score;
  }

  private extractFeatures(row: CSVRow): FeatureVector {
    return {
      province_encoded: this.encodeText(row.Province, this.provinceMap),
      commune_encoded: this.encodeText(row.COMMUNE, this.communeMap),
      quartier_encoded: this.encodeText(row.QUARTIER, this.quartierMap),
      zone_encoded: this.encodeText(row.ZONE, this.zoneMap),
      capacite: parseInt(row.Capacité) || 8,
      geographical_score: this.calculateGeographicalScore(row.VOIE, row.QUARTIER)
    };
  }

  private encodeFeasibilityLabel(faisablite: string): number {
    switch (faisablite.toLowerCase()) {
      case 'faisable': return 1;
      case 'non faisable': return 0;
      case 'etude': return 2;
      default: return 1;
    }
  }

  parseCSV(csvContent: string): CSVRow[] {
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split('\t');
    
    return lines.slice(1).map(line => {
      const values = line.split('\t');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || '';
      });
      return row as CSVRow;
    });
  }

  train(csvData: CSVRow[]): void {
    const trainingData: TrainingData = {
      features: [],
      labels: []
    };

    // Extraction des caractéristiques
    for (const row of csvData) {
      const features = this.extractFeatures(row);
      const label = this.encodeFeasibilityLabel(row.Faisablité);
      
      trainingData.features.push(features);
      trainingData.labels.push(label);
    }

    // Entraînement simple avec régression logistique
    this.trainSimpleModel(trainingData);
    this.isTrained = true;
  }

  private trainSimpleModel(data: TrainingData): void {
    const features = data.features;
    const labels = data.labels;
    
    // Initialisation des poids
    this.weights = new Array(6).fill(0);
    this.bias = 0;
    
    const learningRate = 0.01;
    const epochs = 100;
    
    for (let epoch = 0; epoch < epochs; epoch++) {
      let totalLoss = 0;
      
      for (let i = 0; i < features.length; i++) {
        const feature = features[i];
        const label = labels[i];
        
        // Conversion en vecteur de caractéristiques
        const x = [
          feature.province_encoded / 10,
          feature.commune_encoded / 10,
          feature.quartier_encoded / 10,
          feature.zone_encoded / 10,
          feature.capacite / 10,
          feature.geographical_score
        ];
        
        // Prédiction (sigmoïde)
        let prediction = this.bias;
        for (let j = 0; j < x.length; j++) {
          prediction += this.weights[j] * x[j];
        }
        prediction = 1 / (1 + Math.exp(-prediction));
        
        // Calcul de l'erreur
        const error = prediction - (label === 1 ? 1 : 0);
        totalLoss += error * error;
        
        // Mise à jour des poids
        this.bias -= learningRate * error;
        for (let j = 0; j < x.length; j++) {
          this.weights[j] -= learningRate * error * x[j];
        }
      }
      
      console.log(`Epoch ${epoch}, Loss: ${totalLoss / features.length}`);
    }
  }

  predict(inputData: Partial<CSVRow>): { feasibility: string; confidence: number; details: any } {
    if (!this.isTrained) {
      throw new Error('Model not trained yet');
    }

    // Création d'une ligne complète avec des valeurs par défaut
    const row: CSVRow = {
      Province: inputData.Province || 'RABAT',
      COMMUNE: inputData.COMMUNE || 'RABAT AGDAL RYAD',
      QUARTIER: inputData.QUARTIER || 'Agdal',
      VOIE: inputData.VOIE || '',
      géographique: inputData.géographique || '',
      ZONE: inputData.ZONE || '',
      'Identifiant PCO': inputData['Identifiant PCO'] || '',
      Capacité: inputData.Capacité || '8',
      Faisablité: '' // À prédire
    };

    const features = this.extractFeatures(row);
    
    // Conversion en vecteur
    const x = [
      features.province_encoded / 10,
      features.commune_encoded / 10,
      features.quartier_encoded / 10,
      features.zone_encoded / 10,
      features.capacite / 10,
      features.geographical_score
    ];
    
    // Prédiction
    let score = this.bias;
    for (let j = 0; j < x.length; j++) {
      score += this.weights[j] * x[j];
    }
    
    const probability = 1 / (1 + Math.exp(-score));
    
    let feasibility: string;
    let confidence: number;
    
    if (probability > 0.7) {
      feasibility = 'Faisable';
      confidence = probability;
    } else if (probability > 0.3) {
      feasibility = 'Etude';
      confidence = 0.6;
    } else {
      feasibility = 'Non faisable';
      confidence = 1 - probability;
    }
    
    return {
      feasibility,
      confidence: Math.round(confidence * 100) / 100,
      details: {
        raw_score: score,
        probability,
        geographical_score: features.geographical_score,
        features
      }
    };
  }
}

const predictor = new SimpleFeasibilityPredictor();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data, csvContent } = await req.json();

    switch (action) {
      case 'train':
        if (!csvContent) {
          throw new Error('CSV content required for training');
        }
        
        console.log('Starting model training...');
        const csvData = predictor.parseCSV(csvContent);
        predictor.train(csvData);
        
        return new Response(JSON.stringify({
          success: true,
          message: `Model trained successfully with ${csvData.length} rows`,
          dataPreview: csvData.slice(0, 3)
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'predict':
        if (!data) {
          throw new Error('Input data required for prediction');
        }
        
        const prediction = predictor.predict(data);
        
        return new Response(JSON.stringify({
          success: true,
          prediction
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'batch_predict':
        if (!data || !Array.isArray(data)) {
          throw new Error('Array of input data required for batch prediction');
        }
        
        const predictions = data.map(item => ({
          input: item,
          prediction: predictor.predict(item)
        }));
        
        return new Response(JSON.stringify({
          success: true,
          predictions
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        throw new Error('Invalid action. Use: train, predict, or batch_predict');
    }

  } catch (error) {
    console.error('Error in ML prediction function:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});