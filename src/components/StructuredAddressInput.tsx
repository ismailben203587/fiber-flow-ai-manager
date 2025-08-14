import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AddressData {
  Province: string;
  COMMUNE: string;
  QUARTIER: string;
  VOIE: string;
  ZONE?: string;
  'Identifiant PCO'?: string;
}

interface StructuredAddressInputProps {
  value: string;
  onChange: (address: string) => void;
  disabled?: boolean;
}

const StructuredAddressInput: React.FC<StructuredAddressInputProps> = ({ 
  value, 
  onChange, 
  disabled 
}) => {
  const [addressData, setAddressData] = useState({
    province: '',
    commune: '',
    quartier: '',
    voie: ''
  });
  
  const [mlAddresses, setMlAddresses] = useState<AddressData[]>([]);
  const [availableCommunes, setAvailableCommunes] = useState<string[]>([]);
  const [availableQuartiers, setAvailableQuartiers] = useState<string[]>([]);
  const [availableVoies, setAvailableVoies] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load ML addresses data
  const loadMLAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke('ml-feasibility-prediction', {
        body: { action: 'get_training_data' }
      });
      
      if (response.data?.data) {
        setMlAddresses(response.data.data);
      }
    } catch (error) {
      console.error('Error loading ML addresses:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadMLAddresses();
  }, []);

  // Update available options based on selections
  useEffect(() => {
    if (addressData.province) {
      const communes = [...new Set(
        mlAddresses
          .filter(addr => addr.Province === addressData.province)
          .map(addr => addr.COMMUNE)
      )];
      setAvailableCommunes(communes);
    } else {
      setAvailableCommunes([]);
    }
  }, [addressData.province, mlAddresses]);

  useEffect(() => {
    if (addressData.commune) {
      const quartiers = [...new Set(
        mlAddresses
          .filter(addr => 
            addr.Province === addressData.province && 
            addr.COMMUNE === addressData.commune
          )
          .map(addr => addr.QUARTIER)
      )];
      setAvailableQuartiers(quartiers);
    } else {
      setAvailableQuartiers([]);
    }
  }, [addressData.commune, addressData.province, mlAddresses]);

  useEffect(() => {
    if (addressData.quartier) {
      const voies = [...new Set(
        mlAddresses
          .filter(addr => 
            addr.Province === addressData.province && 
            addr.COMMUNE === addressData.commune &&
            addr.QUARTIER === addressData.quartier
          )
          .map(addr => addr.VOIE)
      )];
      setAvailableVoies(voies);
    } else {
      setAvailableVoies([]);
    }
  }, [addressData.quartier, addressData.commune, addressData.province, mlAddresses]);

  // Update the full address when components change
  useEffect(() => {
    const { province, commune, quartier, voie } = addressData;
    if (province && commune && quartier && voie) {
      const fullAddress = `${province}, ${commune}, ${quartier}, ${voie}`;
      onChange(fullAddress);
    } else if (province || commune || quartier || voie) {
      const parts = [province, commune, quartier, voie].filter(Boolean);
      onChange(parts.join(', '));
    }
  }, [addressData, onChange]);

  // Parse existing address value
  useEffect(() => {
    if (value && !addressData.province) {
      const parts = value.split(',').map(part => part.trim());
      if (parts.length >= 4) {
        setAddressData({
          province: parts[0] || '',
          commune: parts[1] || '',
          quartier: parts[2] || '',
          voie: parts[3] || ''
        });
      }
    }
  }, [value]);

  const handleAddressSelect = (selectedAddress: AddressData) => {
    setAddressData({
      province: selectedAddress.Province,
      commune: selectedAddress.COMMUNE,
      quartier: selectedAddress.QUARTIER,
      voie: selectedAddress.VOIE
    });
  };

  const resetAddress = () => {
    setAddressData({
      province: '',
      commune: '',
      quartier: '',
      voie: ''
    });
    onChange('');
  };

  const provinces = [...new Set(mlAddresses.map(addr => addr.Province))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Adresse structurée
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={loadMLAddresses}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-1" />
            {isLoading ? 'Chargement...' : 'Charger adresses'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetAddress}
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Province</Label>
          <Select
            value={addressData.province}
            onValueChange={(value) => setAddressData({ ...addressData, province: value, commune: '', quartier: '', voie: '' })}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map(province => (
                <SelectItem key={province} value={province}>
                  {province}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Commune</Label>
          <Select
            value={addressData.commune}
            onValueChange={(value) => setAddressData({ ...addressData, commune: value, quartier: '', voie: '' })}
            disabled={disabled || !addressData.province}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une commune" />
            </SelectTrigger>
            <SelectContent>
              {availableCommunes.map(commune => (
                <SelectItem key={commune} value={commune}>
                  {commune}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quartier</Label>
          <Select
            value={addressData.quartier}
            onValueChange={(value) => setAddressData({ ...addressData, quartier: value, voie: '' })}
            disabled={disabled || !addressData.commune}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un quartier" />
            </SelectTrigger>
            <SelectContent>
              {availableQuartiers.map(quartier => (
                <SelectItem key={quartier} value={quartier}>
                  {quartier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Voie</Label>
          <Select
            value={addressData.voie}
            onValueChange={(value) => setAddressData({ ...addressData, voie: value })}
            disabled={disabled || !addressData.quartier}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une voie" />
            </SelectTrigger>
            <SelectContent>
              {availableVoies.map(voie => (
                <SelectItem key={voie} value={voie}>
                  {voie}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Ou saisie manuelle</Label>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Province, Commune, Quartier, Voie"
          disabled={disabled}
        />
      </div>

      {mlAddresses.length > 0 && (
        <div className="text-xs text-muted-foreground">
          {mlAddresses.length} adresses disponibles dans la base de données ML
        </div>
      )}
    </div>
  );
};

export default StructuredAddressInput;