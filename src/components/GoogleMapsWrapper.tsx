
import React from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import GoogleMapComponent from './GoogleMapComponent';

interface Equipment {
  id: string;
  type: string;
  location: string;
  lat: number;
  lng: number;
  status: string;
  capacity: number;
}

interface GoogleMapsWrapperProps {
  equipments: Equipment[];
  onEquipmentClick?: (equipment: Equipment) => void;
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Chargement de Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border border-red-200">
          <div className="text-center text-red-600">
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm">Impossible de charger Google Maps. Vérifiez votre clé API.</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ equipments, onEquipmentClick }) => {
  // Utilisation d'une clé API de démonstration - remplacez par votre vraie clé
  const apiKey = 'DEMO_API_KEY';

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <GoogleMapComponent equipments={equipments} onEquipmentClick={onEquipmentClick} />
    </Wrapper>
  );
};

export default GoogleMapsWrapper;
