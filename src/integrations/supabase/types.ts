export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string
          cin: string
          client_number: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          voip_number: string
        }
        Insert: {
          address: string
          cin: string
          client_number: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          voip_number: string
        }
        Update: {
          address?: string
          cin?: string
          client_number?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          voip_number?: string
        }
        Relationships: []
      }
      customer_complaints: {
        Row: {
          assigned_technician_id: string | null
          client_address: string | null
          client_id: string | null
          client_name: string
          client_zone: string | null
          complaint_number: string
          complaint_type: string
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          last_repeat_date: string | null
          priority: string | null
          repeat_count: number | null
          status: string | null
          updated_at: string | null
          voip_number: string | null
        }
        Insert: {
          assigned_technician_id?: string | null
          client_address?: string | null
          client_id?: string | null
          client_name: string
          client_zone?: string | null
          complaint_number: string
          complaint_type: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          last_repeat_date?: string | null
          priority?: string | null
          repeat_count?: number | null
          status?: string | null
          updated_at?: string | null
          voip_number?: string | null
        }
        Update: {
          assigned_technician_id?: string | null
          client_address?: string | null
          client_id?: string | null
          client_name?: string
          client_zone?: string | null
          complaint_number?: string
          complaint_type?: string
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          last_repeat_date?: string | null
          priority?: string | null
          repeat_count?: number | null
          status?: string | null
          updated_at?: string | null
          voip_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_complaints_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_complaints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ftth_orders: {
        Row: {
          ai_analysis: Json | null
          assigned_msan_id: string | null
          assigned_pco_id: string | null
          client_address: string
          client_cin: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_number: string | null
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
          voip_number: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          assigned_msan_id?: string | null
          assigned_pco_id?: string | null
          client_address: string
          client_cin?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_number?: string | null
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
          voip_number?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          assigned_msan_id?: string | null
          assigned_pco_id?: string | null
          client_address?: string
          client_cin?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_number?: string | null
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
          voip_number?: string | null
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
          {
            foreignKeyName: "ftth_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
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
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      technicians: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          max_concurrent_tickets: number | null
          name: string
          phone: string | null
          speciality: string | null
          status: string | null
          updated_at: string | null
          zone_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          max_concurrent_tickets?: number | null
          name: string
          phone?: string | null
          speciality?: string | null
          status?: string | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          max_concurrent_tickets?: number | null
          name?: string
          phone?: string | null
          speciality?: string | null
          status?: string | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technicians_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_assignments: {
        Row: {
          assigned_at: string | null
          complaint_id: string | null
          id: string
          notes: string | null
          status: string | null
          technician_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          complaint_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          technician_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          complaint_id?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_assignments_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "customer_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_assignments_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_notifications: {
        Row: {
          complaint_id: string | null
          id: string
          message: string | null
          notification_type: string
          sent_at: string | null
          technician_id: string | null
        }
        Insert: {
          complaint_id?: string | null
          id?: string
          message?: string | null
          notification_type: string
          sent_at?: string | null
          technician_id?: string | null
        }
        Update: {
          complaint_id?: string | null
          id?: string
          message?: string | null
          notification_type?: string
          sent_at?: string | null
          technician_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_notifications_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "customer_complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_notifications_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          coordinates: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ai_assign_technician: {
        Args: {
          complaint_id: string
          complaint_type: string
          priority: string
          client_address?: string
        }
        Returns: string
      }
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      detect_client_zone: {
        Args: { client_address: string }
        Returns: string
      }
      detect_overdue_tickets: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detect_repeated_tickets: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_client_by_voip: {
        Args: { voip_num: string }
        Returns: {
          id: string
          client_number: string
          voip_number: string
          cin: string
          name: string
          address: string
          phone: string
          email: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "commercial" | "tech" | "technicien" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["commercial", "tech", "technicien", "admin"],
    },
  },
} as const
