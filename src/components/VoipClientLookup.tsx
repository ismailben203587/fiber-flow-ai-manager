
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, User, MapPin, Phone, Mail } from 'lucide-react';
import { useClientByVoip } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';

interface VoipClientLookupProps {
  onClientFound: (client: any) => void;
  onClientNotFound: () => void;
}

const VoipClientLookup = ({ onClientFound, onClientNotFound }: VoipClientLookupProps) => {
  const { toast } = useToast();
  const [voipNumber, setVoipNumber] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);
  
  const { data: client, isLoading, error } = useClientByVoip(searchTriggered ? voipNumber : '');

  useEffect(() => {
    if (searchTriggered && !isLoading) {
      if (client) {
        onClientFound(client);
        toast({
          title: "Client trouvé",
          description: `Informations chargées pour ${client.name}`,
        });
      } else {
        onClientNotFound();
        toast({
          title: "Client non trouvé",
          description: "Aucun client trouvé avec ce numéro VOIP",
          variant: "destructive"
        });
      }
      setSearchTriggered(false);
    }
  }, [client, isLoading, searchTriggered, onClientFound, onClientNotFound, toast]);

  const handleSearch = () => {
    if (!voipNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro VOIP",
        variant: "destructive"
      });
      return;
    }
    setSearchTriggered(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="voipLookup">Numéro VOIP du client</Label>
          <Input
            id="voipLookup"
            value={voipNumber}
            onChange={(e) => setVoipNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ex: 10000001"
            disabled={isLoading}
          />
        </div>
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            {isLoading ? 'Recherche...' : 'Rechercher'}
          </Button>
        </div>
      </div>

      {client && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Client trouvé</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-green-600" />
                <span><strong>Nom:</strong> {client.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span><strong>N° Client:</strong> {client.client_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span><strong>VOIP:</strong> {client.voip_number}</span>
              </div>
              <div className="flex items-center gap-2">
                <span><strong>CIN:</strong> {client.cin}</span>
              </div>
              {client.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span><strong>Téléphone:</strong> {client.phone}</span>
                </div>
              )}
              {client.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-green-600" />
                  <span><strong>Email:</strong> {client.email}</span>
                </div>
              )}
              <div className="flex items-start gap-2 md:col-span-2">
                <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                <span><strong>Adresse:</strong> {client.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoipClientLookup;
