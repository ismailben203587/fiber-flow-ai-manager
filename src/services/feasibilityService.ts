
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type PCOEquipment = Tables<'pco_equipment'>;
type MSANEquipment = Tables<'msan_equipment'>;

export interface FeasibilityResult {
  isFeasible: boolean;
  assignedPCO: PCOEquipment | null;
  assignedMSAN: MSANEquipment | null;
  distanceToPCO: number | null;
  distanceToMSAN: number | null;
  analysis: {
    score: number;
    factors: string[];
    recommendations: string[];
    riskLevel: 'low' | 'medium' | 'high';
  };
}

export class FeasibilityService {
  // Simulate geocoding - in a real app, you'd use a geocoding service
  private async geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
    // Simple simulation based on city name
    const cityCoords: Record<string, { lat: number; lng: number }> = {
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Lyon': { lat: 45.7640, lng: 4.8357 },
      'Toulouse': { lat: 43.6047, lng: 1.4442 },
      'Marseille': { lat: 43.2965, lng: 5.3698 },
      'Nice': { lat: 43.7102, lng: 7.2620 },
    };

    for (const [city, coords] of Object.entries(cityCoords)) {
      if (address.toLowerCase().includes(city.toLowerCase())) {
        // Add some randomness to simulate precise geocoding
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.02,
          lng: coords.lng + (Math.random() - 0.5) * 0.02,
        };
      }
    }

    // Default to Paris with some randomness
    return {
      lat: 48.8566 + (Math.random() - 0.5) * 0.1,
      lng: 2.3522 + (Math.random() - 0.5) * 0.1,
    };
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private async findNearestEquipment<T extends PCOEquipment | MSANEquipment>(
    equipment: T[],
    clientLat: number,
    clientLng: number
  ): Promise<{ equipment: T; distance: number } | null> {
    let nearest: { equipment: T; distance: number } | null = null;

    for (const item of equipment) {
      if (item.latitude && item.longitude && item.status === 'active') {
        const distance = this.calculateDistance(
          clientLat,
          clientLng,
          Number(item.latitude),
          Number(item.longitude)
        );

        if (!nearest || distance < nearest.distance) {
          nearest = { equipment: item, distance };
        }
      }
    }

    return nearest;
  }

  private analyzeCapacity(equipment: PCOEquipment | MSANEquipment): {
    hasCapacity: boolean;
    utilizationRate: number;
  } {
    const utilizationRate = equipment.used_capacity / equipment.capacity;
    return {
      hasCapacity: utilizationRate < 0.95, // Consider full if >95% utilized
      utilizationRate,
    };
  }

  private generateAnalysis(
    pcoResult: { equipment: PCOEquipment; distance: number } | null,
    msanResult: { equipment: MSANEquipment; distance: number } | null
  ): FeasibilityResult['analysis'] {
    const factors: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // Distance analysis
    if (pcoResult && pcoResult.distance > 2) {
      factors.push(`Distance au PCO élevée (${pcoResult.distance.toFixed(2)} km)`);
      score -= 15;
      riskLevel = 'medium';
    }
    
    if (msanResult && msanResult.distance > 5) {
      factors.push(`Distance au MSAN élevée (${msanResult.distance.toFixed(2)} km)`);
      score -= 20;
      riskLevel = 'high';
    }

    // Capacity analysis
    if (pcoResult) {
      const pcoCapacity = this.analyzeCapacity(pcoResult.equipment);
      if (!pcoCapacity.hasCapacity) {
        factors.push(`PCO ${pcoResult.equipment.name} proche de la saturation (${(pcoCapacity.utilizationRate * 100).toFixed(1)}%)`);
        score -= 25;
        riskLevel = 'high';
        recommendations.push('Considérer un PCO alternatif ou augmenter la capacité');
      }
    }

    if (msanResult) {
      const msanCapacity = this.analyzeCapacity(msanResult.equipment);
      if (!msanCapacity.hasCapacity) {
        factors.push(`MSAN ${msanResult.equipment.name} proche de la saturation (${(msanCapacity.utilizationRate * 100).toFixed(1)}%)`);
        score -= 30;
        riskLevel = 'high';
        recommendations.push('Considérer un MSAN alternatif ou augmenter la capacité');
      }
    }

    // Generate recommendations based on analysis
    if (score >= 80) {
      recommendations.push('Installation recommandée - conditions optimales');
    } else if (score >= 60) {
      recommendations.push('Installation possible avec surveillance des contraintes');
    } else {
      recommendations.push('Installation risquée - évaluation détaillée nécessaire');
    }

    return {
      score: Math.max(0, score),
      factors,
      recommendations,
      riskLevel,
    };
  }

  async assessFeasibility(clientAddress: string): Promise<FeasibilityResult> {
    try {
      console.log('🔍 Début de l\'évaluation de faisabilité pour:', clientAddress);

      // Get client coordinates
      const clientCoords = await this.geocodeAddress(clientAddress);
      if (!clientCoords) {
        throw new Error('Impossible de géolocaliser l\'adresse client');
      }

      console.log('📍 Coordonnées client:', clientCoords);

      // Fetch equipment data
      const [pcoResponse, msanResponse] = await Promise.all([
        supabase.from('pco_equipment').select('*'),
        supabase.from('msan_equipment').select('*')
      ]);

      if (pcoResponse.error) throw pcoResponse.error;
      if (msanResponse.error) throw msanResponse.error;

      const pcoEquipment = pcoResponse.data as PCOEquipment[];
      const msanEquipment = msanResponse.data as MSANEquipment[];

      console.log('🏗️ Équipements trouvés:', { pco: pcoEquipment.length, msan: msanEquipment.length });

      // Find nearest equipment
      const nearestPCO = await this.findNearestEquipment(pcoEquipment, clientCoords.lat, clientCoords.lng);
      const nearestMSAN = await this.findNearestEquipment(msanEquipment, clientCoords.lat, clientCoords.lng);

      console.log('🎯 Équipements les plus proches:', {
        pco: nearestPCO ? `${nearestPCO.equipment.name} (${nearestPCO.distance.toFixed(2)} km)` : 'Aucun',
        msan: nearestMSAN ? `${nearestMSAN.equipment.name} (${nearestMSAN.distance.toFixed(2)} km)` : 'Aucun'
      });

      // Generate analysis
      const analysis = this.generateAnalysis(nearestPCO, nearestMSAN);

      // Determine feasibility
      const isFeasible = nearestPCO && nearestMSAN && 
                        nearestPCO.distance <= 3 && 
                        nearestMSAN.distance <= 10 &&
                        this.analyzeCapacity(nearestPCO.equipment).hasCapacity &&
                        this.analyzeCapacity(nearestMSAN.equipment).hasCapacity;

      console.log('✅ Résultat de faisabilité:', { isFeasible, score: analysis.score });

      return {
        isFeasible: Boolean(isFeasible),
        assignedPCO: nearestPCO?.equipment || null,
        assignedMSAN: nearestMSAN?.equipment || null,
        distanceToPCO: nearestPCO?.distance || null,
        distanceToMSAN: nearestMSAN?.distance || null,
        analysis,
      };
    } catch (error) {
      console.error('❌ Erreur lors de l\'évaluation de faisabilité:', error);
      throw error;
    }
  }
}

export const feasibilityService = new FeasibilityService();
