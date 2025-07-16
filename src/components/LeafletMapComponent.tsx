import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface LeafletMapComponentProps {
  equipments: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
}

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create custom icons based on equipment status
const createCustomIcon = (status: string, capacity: number) => {
  const getColor = () => {
    if (status === 'Panne') return '#ef4444'; // red
    if (status === 'Saturé' || capacity >= 90) return '#f97316'; // orange
    return '#22c55e'; // green
  };

  const color = getColor();
  
  const svgIcon = `
    <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 6.9 12.5 28.5 12.5 28.5s12.5-21.6 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
      <circle fill="#ffffff" cx="12.5" cy="12.5" r="6"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

const LeafletMapComponent: React.FC<LeafletMapComponentProps> = ({ 
  equipments, 
  onEquipmentClick 
}) => {
  console.log('LeafletMapComponent rendering with equipments:', equipments);
  
  // Ensure we have a fallback for equipments
  const safeEquipments = equipments || [];
  // Default center on Paris
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  
  
  // Calculate map bounds to fit all equipment
  const bounds = safeEquipments.length > 0 
    ? safeEquipments.map(eq => [eq.lat, eq.lng] as [number, number])
    : [defaultCenter];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {safeEquipments.map((equipment) => (
          <Marker
            key={equipment.id}
            position={[equipment.lat, equipment.lng]}
            icon={createCustomIcon(equipment.status, equipment.capacity)}
            eventHandlers={{
              click: () => onEquipmentClick?.(equipment),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm">{equipment.id}</h3>
                <p className="text-xs text-gray-600">{equipment.type}</p>
                <p className="text-xs text-gray-600">{equipment.location}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs text-white ${
                    equipment.status === 'Panne' ? 'bg-red-500' : 
                    equipment.status === 'Saturé' || equipment.capacity >= 90 ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {equipment.status}
                  </span>
                  <span className="text-xs">{equipment.capacity}%</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LeafletMapComponent;