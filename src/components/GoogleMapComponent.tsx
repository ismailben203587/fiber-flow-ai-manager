
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

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ equipments, onEquipmentClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
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

    // Ajouter les marqueurs pour chaque équipement
    equipments.forEach((equipment) => {
      const marker = new google.maps.Marker({
        position: { lat: equipment.lat, lng: equipment.lng },
        map: mapInstance,
        title: `${equipment.id} - ${equipment.location}`,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getMarkerColor(equipment.status, equipment.capacity),
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      });

      // InfoWindow pour chaque marqueur
      const infoWindow = new google.maps.InfoWindow({
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

  }, [equipments, onEquipmentClick]);

  const getMarkerColor = (status: string, capacity: number) => {
    if (status === 'Panne') return '#ef4444';
    if (status === 'Saturé' || capacity >= 90) return '#f97316';
    return '#22c55e';
  };

  return (
    <div 
      ref={mapRef} 
      style={{ width: '100%', height: '400px', borderRadius: '8px' }}
      className="border border-gray-300"
    />
  );
};

export default GoogleMapComponent;
