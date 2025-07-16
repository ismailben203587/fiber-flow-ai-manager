
import React from 'react';
import LeafletMapComponent from './LeafletMapComponent';

interface Equipment {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  capacity: number;
}

interface MapWrapperProps {
  equipments: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ equipments, onEquipmentClick }) => {
  return (
    <div className="w-full">
      <LeafletMapComponent equipments={equipments} onEquipmentClick={onEquipmentClick} />
      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>✅ Carte OpenStreetMap :</strong> Carte interactive gratuite sans clé API requise.
        </p>
      </div>
    </div>
  );
};

export default MapWrapper;
