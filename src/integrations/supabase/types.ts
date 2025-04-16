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
      carriers: {
        Row: {
          api_endpoint: string | null
          api_key: string | null
          created_at: string
          id: number
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          api_endpoint?: string | null
          api_key?: string | null
          created_at?: string
          id?: number
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string
          code: string | null
          created_at: string
          id: number
          name: string
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj: string
          code?: string | null
          created_at?: string
          id?: number
          name: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string
          code?: string | null
          created_at?: string
          id?: number
          name?: string
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      package_types: {
        Row: {
          created_at: string
          height: number
          id: number
          is_default: boolean | null
          length: number
          name: string
          updated_at: string
          weight: number
          width: number
        }
        Insert: {
          created_at?: string
          height: number
          id?: number
          is_default?: boolean | null
          length: number
          name: string
          updated_at?: string
          weight: number
          width: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: number
          is_default?: boolean | null
          length?: number
          name?: string
          updated_at?: string
          weight?: number
          width?: number
        }
        Relationships: []
      }
      quote_packages: {
        Row: {
          created_at: string
          height: number
          id: number
          length: number
          name: string
          quantity: number
          quote_id: string | null
          weight: number
          width: number
        }
        Insert: {
          created_at?: string
          height: number
          id?: number
          length: number
          name: string
          quantity?: number
          quote_id?: string | null
          weight: number
          width: number
        }
        Update: {
          created_at?: string
          height?: number
          id?: number
          length?: number
          name?: string
          quantity?: number
          quote_id?: string | null
          weight?: number
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "quote_packages_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_results: {
        Row: {
          carrier_id: number | null
          created_at: string
          delivery_time: string | null
          id: number
          message: string | null
          modal: string | null
          price: number
          quote_id: string | null
          quote_number: string | null
        }
        Insert: {
          carrier_id?: number | null
          created_at?: string
          delivery_time?: string | null
          id?: number
          message?: string | null
          modal?: string | null
          price: number
          quote_id?: string | null
          quote_number?: string | null
        }
        Update: {
          carrier_id?: number | null
          created_at?: string
          delivery_time?: string | null
          id?: number
          message?: string | null
          modal?: string | null
          price?: number
          quote_id?: string | null
          quote_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_results_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_results_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          client_id: number | null
          created_at: string
          id: string
          merchandise_value: number
          status: string | null
          total_packages: number
          total_volume: number
          total_weight: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id?: number | null
          created_at?: string
          id?: string
          merchandise_value: number
          status?: string | null
          total_packages: number
          total_volume: number
          total_weight: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: number | null
          created_at?: string
          id?: string
          merchandise_value?: number
          status?: string | null
          total_packages?: number
          total_volume?: number
          total_weight?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking: {
        Row: {
          carrier_id: number | null
          created_at: string
          id: string
          invoice_number: string
          last_date: string | null
          last_location: string | null
          last_status: string | null
          quote_id: string | null
          updated_at: string
        }
        Insert: {
          carrier_id?: number | null
          created_at?: string
          id?: string
          invoice_number: string
          last_date?: string | null
          last_location?: string | null
          last_status?: string | null
          quote_id?: string | null
          updated_at?: string
        }
        Update: {
          carrier_id?: number | null
          created_at?: string
          id?: string
          invoice_number?: string
          last_date?: string | null
          last_location?: string | null
          last_status?: string | null
          quote_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_history: {
        Row: {
          created_at: string
          id: number
          internal_code: string
          location: string | null
          occurred_at: string
          status_code: string
          status_description: string
          tracking_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          internal_code: string
          location?: string | null
          occurred_at: string
          status_code: string
          status_description: string
          tracking_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          internal_code?: string
          location?: string | null
          occurred_at?: string
          status_code?: string
          status_description?: string
          tracking_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_history_tracking_id_fkey"
            columns: ["tracking_id"]
            isOneToOne: false
            referencedRelation: "tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_status: {
        Row: {
          carrier_id: number | null
          code: string
          created_at: string
          description: string
          id: number
          internal_code: string
          updated_at: string
        }
        Insert: {
          carrier_id?: number | null
          code: string
          created_at?: string
          description: string
          id?: number
          internal_code: string
          updated_at?: string
        }
        Update: {
          carrier_id?: number | null
          code?: string
          created_at?: string
          description?: string
          id?: number
          internal_code?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracking_status_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "admin" | "operator"
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
    Enums: {
      user_role: ["admin", "operator"],
    },
  },
} as const
