import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Equipment {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  capacity: number;
}

interface SimpleLeafletMapProps {
  equipments: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
}

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (status: string, capacity: number) => {
  const getColor = () => {
    if (status === 'Panne') return '#ef4444'; // red
    if (status === 'Saturé' || capacity >= 90) return '#f97316'; // orange
    return '#22c55e'; // green
  };

  const color = getColor();
  
  const svgIcon = `
    <div style="
      background-color: ${color}; 
      width: 20px; 
      height: 20px; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
      font-weight: bold;
    ">
      ${status === 'Panne' ? '⚠' : status === 'Saturé' ? '!' : '✓'}
    </div>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-leaflet-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const SimpleLeafletMap: React.FC<SimpleLeafletMapProps> = ({ 
  equipments, 
  onEquipmentClick 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  console.log('SimpleLeafletMap rendering with equipments:', equipments);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([48.8566, 2.3522], 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    // Add markers for equipment
    const safeEquipments = equipments || [];
    safeEquipments.forEach((equipment) => {
      const marker = L.marker([equipment.lat, equipment.lng], {
        icon: createCustomIcon(equipment.status, equipment.capacity)
      }).addTo(map);

      // Add popup
      const popupContent = `
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${equipment.id}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">${equipment.type}</p>
          <p style="margin: 0; font-size: 12px; color: #666;">${equipment.location}</p>
          <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
            <span style="
              padding: 2px 6px; 
              border-radius: 4px; 
              font-size: 10px; 
              color: white;
              background-color: ${
                equipment.status === 'Panne' ? '#ef4444' : 
                equipment.status === 'Saturé' || equipment.capacity >= 90 ? '#f97316' : '#22c55e'
              };
            ">
              ${equipment.status}
            </span>
            <span style="font-size: 12px;">${equipment.capacity}%</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add click handler
      marker.on('click', () => {
        onEquipmentClick?.(equipment);
      });
    });

    // Fit map to show all markers if there are any
    if (safeEquipments.length > 0) {
      const group = new L.FeatureGroup(
        safeEquipments.map(eq => 
          L.marker([eq.lat, eq.lng])
        )
      );
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [equipments, onEquipmentClick]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-96 rounded-lg overflow-hidden"
      style={{ height: '400px' }}
    />
  );
};

export default SimpleLeafletMap;