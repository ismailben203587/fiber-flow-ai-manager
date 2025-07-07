
import React, { useEffect, useRef, useState } from 'react';

interface Equipment {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  capacity: number;
}

interface GoogleMapComponentProps {
  equipments: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
}

// Déclaration globale pour TypeScript
declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ equipments, onEquipmentClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Vérifier si l'API Google Maps est disponible
    if (!window.google || !window.google.maps) {
      console.log('Google Maps API pas encore chargée');
      return;
    }

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Centre sur Paris
        zoom: 10,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          }
        ]
      });

      setMap(mapInstance);
      setIsLoaded(true);

      // Ajouter les marqueurs pour chaque équipement
      equipments.forEach((equipment) => {
        const marker = new window.google.maps.Marker({
          position: { lat: equipment.lat, lng: equipment.lng },
          map: mapInstance,
          title: `${equipment.id} - ${equipment.location}`,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getMarkerColor(equipment.status, equipment.capacity),
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }
        });

        // InfoWindow pour chaque marqueur
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937;">${equipment.id}</h3>
              <p style="margin: 0; color: #6b7280;"><strong>Type:</strong> ${equipment.type}</p>
              <p style="margin: 0; color: #6b7280;"><strong>Localisation:</strong> ${equipment.location}</p>
              <p style="margin: 0; color: #6b7280;"><strong>Statut:</strong> ${equipment.status}</p>
              <p style="margin: 0; color: #6b7280;"><strong>Capacité:</strong> ${equipment.capacity}%</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
          if (onEquipmentClick) {
            onEquipmentClick(equipment);
          }
        });
      });

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Google Maps:', error);
    }

  }, [equipments, onEquipmentClick]);

  const getMarkerColor = (status: string, capacity: number) => {
    if (status === 'Panne') return '#ef4444';
    if (status === 'Saturé' || capacity >= 90) return '#f97316';
    return '#22c55e';
  };

  // Afficher un message si Google Maps n'est pas disponible
  if (!window.google || !window.google.maps) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-center text-blue-700">
          <p className="font-semibold mb-2">Mode Démonstration</p>
          <p className="text-sm">
            Pour utiliser Google Maps, ajoutez votre clé API dans les variables d'environnement
          </p>
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-xs text-gray-600">
              Équipements à afficher : {equipments.length}
            </p>
            <div className="mt-2 space-y-1">
              {equipments.slice(0, 3).map(eq => (
                <div key={eq.id} className="text-xs flex justify-between">
                  <span>{eq.id}</span>
                  <span className={`px-2 py-1 rounded text-white ${getMarkerColor(eq.status, eq.capacity) === '#ef4444' ? 'bg-red-500' : 
                    getMarkerColor(eq.status, eq.capacity) === '#f97316' ? 'bg-orange-500' : 'bg-green-500'}`}>
                    {eq.status}
                  </span>
                </div>
              ))}
              {equipments.length > 3 && (
                <p className="text-xs text-gray-500">... et {equipments.length - 3} autres</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
      className="border border-gray-300"
    />
  );
};

export default GoogleMapComponent;
