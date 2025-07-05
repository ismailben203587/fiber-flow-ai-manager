
// Type for AI Analysis structure
export interface AIAnalysis {
  score?: number;
  riskLevel?: 'low' | 'medium' | 'high';
  factors?: string[];
  recommendations?: string[];
}

// Type for order with AI analysis
export interface TechnicalOrder {
  id: string;
  order_number: string;
  client_name: string;
  client_address: string;
  client_phone?: string;
  client_cin?: string;
  client_number?: string;
  voip_number?: string;
  distance_to_pco?: number;
  distance_to_msan?: number;
  feasibility_status?: string;
  status?: string;
  ai_analysis?: any;
}
