
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Ticket, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFTTHOrders } from '@/hooks/useOrders';
import { useCustomerComplaints } from '@/hooks/useComplaints';

const ClientSearch = () => {
  const { toast } = useToast();
  const { data: orders = [] } = useFTTHOrders();
  const { data: complaints = [] } = useCustomerComplaints();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'order' | 'ticket' | null>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un numéro de commande ou de ticket",
        variant: "destructive"
      });
      return;
    }

    const searchValue = searchTerm.trim().toUpperCase();
    let results: any[] = [];
    let type: 'order' | 'ticket' | null = null;

    // Recherche dans les commandes
    const orderResults = orders.filter(order => 
      order.order_number.toUpperCase().includes(searchValue)
    );

    // Recherche dans les tickets
    const ticketResults = complaints.filter(complaint => 
      complaint.complaint_number.toUpperCase().includes(searchValue)
    );

    if (orderResults.length > 0) {
      results = orderResults.map(order => ({ ...order, type: 'order' }));
      type = 'order';
    }

    if (ticketResults.length > 0) {
      results = [...results, ...ticketResults.map(ticket => ({ ...ticket, type: 'ticket' }))];
      if (!type) type = 'ticket';
    }

    if (results.length === 0) {
      toast({
        title: "Aucun résultat",
        description: "Aucune commande ou ticket trouvé avec ce numéro",
        variant: "destructive"
      });
    }

    setSearchResults(results);
    setSearchType(type);
  };

  const getOrderStatusBadge = (status: string, feasibilityStatus?: string) => {
    if (feasibilityStatus === 'approved') {
      return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
    }
    if (feasibilityStatus === 'rejected') {
      return <Badge className="bg-red-100 text-red-800">Rejetée</Badge>;
    }
    if (status === 'completed') {
      return <Badge className="bg-blue-100 text-blue-800">Terminée</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800">En cours d'étude</Badge>;
  };

  const getTicketStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-red-100 text-red-800">Ouvert</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Recherche Client
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Saisir numéro de commande (CMD-XXXXXX) ou ticket (REC-XXXXXX)"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Rechercher
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Résultats de recherche</h3>
              
              {searchResults.map((result, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    {result.type === 'order' ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold">{result.order_number}</h4>
                            {getOrderStatusBadge(result.status, result.feasibility_status)}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Client:</strong> {result.client_name}</p>
                            <p><strong>Adresse:</strong> {result.client_address}</p>
                            {result.client_phone && <p><strong>Téléphone:</strong> {result.client_phone}</p>}
                          </div>
                          <div>
                            {result.client_number && <p><strong>N° Client:</strong> {result.client_number}</p>}
                            {result.voip_number && <p><strong>VOIP:</strong> {result.voip_number}</p>}
                            <p><strong>Type:</strong> {result.service_type}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Créée le {new Date(result.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Ticket className="h-5 w-5 text-orange-600" />
                            <h4 className="font-semibold">{result.complaint_number}</h4>
                            {getTicketStatusBadge(result.status)}
                            {result.repeat_count && result.repeat_count >= 2 && (
                              <Badge className="bg-red-600 text-white">
                                URGENT ({result.repeat_count}x)
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p><strong>Client:</strong> {result.client_name}</p>
                            <p><strong>Type:</strong> {result.complaint_type}</p>
                            <p><strong>Priorité:</strong> {result.priority}</p>
                          </div>
                          <div>
                            {result.client_zone && <p><strong>Zone:</strong> {result.client_zone}</p>}
                            {result.assigned_technician && (
                              <p><strong>Technicien:</strong> {result.assigned_technician.name}</p>
                            )}
                          </div>
                        </div>
                        
                        {result.description && (
                          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                            <strong>Description:</strong> {result.description}
                          </p>
                        )}
                        
                        <div className="text-xs text-gray-500 pt-2 border-t">
                          Créé le {new Date(result.created_at).toLocaleDateString('fr-FR')}
                          {result.due_date && (
                            <span className="ml-4">
                              Échéance: {new Date(result.due_date).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {searchResults.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun résultat</h3>
              <p className="text-gray-500">
                Aucune commande ou ticket trouvé pour "{searchTerm}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSearch;
