
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
  // La clé API sera récupérée depuis une edge function Supabase
  const [apiKey, setApiKey] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch('/api/google-maps-config');
        if (response.ok) {
          const data = await response.json();
          setApiKey(data.apiKey);
        } else {
          console.warn('Clé API Google Maps non configurée');
        }
      } catch (error) {
        console.warn('Erreur lors de la récupération de la clé API:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Configuration de Google Maps...</p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-96 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="text-center text-yellow-800">
          <p className="font-semibold mb-2">Configuration requise</p>
          <p className="text-sm mb-4">
            Veuillez configurer votre clé API Google Maps pour utiliser cette fonctionnalité.
          </p>
          <div className="mt-4 p-3 bg-white rounded border">
            <p className="text-xs text-gray-600">
              Équipements à afficher : {equipments.length}
            </p>
            <div className="mt-2 space-y-1">
              {equipments.slice(0, 3).map(eq => (
                <div key={eq.id} className="text-xs flex justify-between">
                  <span>{eq.id}</span>
                  <span className={`px-2 py-1 rounded text-white ${
                    eq.status === 'Panne' ? 'bg-red-500' : 
                    eq.status === 'Saturé' || eq.capacity >= 90 ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
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
    <Wrapper apiKey={apiKey} render={render}>
      <GoogleMapComponent equipments={equipments} onEquipmentClick={onEquipmentClick} />
    </Wrapper>
  );
};

export default GoogleMapsWrapper;
