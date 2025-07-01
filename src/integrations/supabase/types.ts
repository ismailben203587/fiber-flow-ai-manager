export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customer_complaints: {
        Row: {
          client_name: string
          complaint_number: string
          complaint_type: string
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          client_name: string
          complaint_number: string
          complaint_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          client_name?: string
          complaint_number?: string
          complaint_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ftth_orders: {
        Row: {
          ai_analysis: Json | null
          assigned_msan_id: string | null
          assigned_pco_id: string | null
          client_address: string
          client_email: string | null
          client_name: string
          client_phone: string | null
          created_at: string | null
          distance_to_msan: number | null
          distance_to_pco: number | null
          feasibility_report: Json | null
          feasibility_status: string | null
          id: string
          order_number: string
          service_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          assigned_msan_id?: string | null
          assigned_pco_id?: string | null
          client_address: string
          client_email?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string | null
          distance_to_msan?: number | null
          distance_to_pco?: number | null
          feasibility_report?: Json | null
          feasibility_status?: string | null
          id?: string
          order_number: string
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          assigned_msan_id?: string | null
          assigned_pco_id?: string | null
          client_address?: string
          client_email?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string | null
          distance_to_msan?: number | null
          distance_to_pco?: number | null
          feasibility_report?: Json | null
          feasibility_status?: string | null
          id?: string
          order_number?: string
          service_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ftth_orders_assigned_msan_id_fkey"
            columns: ["assigned_msan_id"]
            isOneToOne: false
            referencedRelation: "msan_equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ftth_orders_assigned_pco_id_fkey"
            columns: ["assigned_pco_id"]
            isOneToOne: false
            referencedRelation: "pco_equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      msan_equipment: {
        Row: {
          address: string
          capacity: number
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          status: string | null
          updated_at: string | null
          used_capacity: number
        }
        Insert: {
          address: string
          capacity?: number
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          status?: string | null
          updated_at?: string | null
          used_capacity?: number
        }
        Update: {
          address?: string
          capacity?: number
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          status?: string | null
          updated_at?: string | null
          used_capacity?: number
        }
        Relationships: []
      }
      pco_equipment: {
        Row: {
          address: string
          capacity: number
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          status: string | null
          updated_at: string | null
          used_capacity: number
        }
        Insert: {
          address: string
          capacity?: number
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          status?: string | null
          updated_at?: string | null
          used_capacity?: number
        }
        Update: {
          address?: string
          capacity?: number
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          status?: string | null
          updated_at?: string | null
          used_capacity?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
