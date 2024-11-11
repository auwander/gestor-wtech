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
      botRecarga: {
        Row: {
          account: string | null
          "combo?": boolean | null
          data: string
          descricao: string | null
          dias: number | null
          empresa: string | null
          fee: number | null
          fee_mp: number | null
          id: number
          lq: number | null
          nome: string | null
          pedido: string | null
          preco: number | null
          proc: boolean | null
          produto: string | null
          quant: number | null
          rec: boolean | null
          telefone: string | null
          tipo: string | null
          venda: string | null
        }
        Insert: {
          account?: string | null
          "combo?"?: boolean | null
          data?: string
          descricao?: string | null
          dias?: number | null
          empresa?: string | null
          fee?: number | null
          fee_mp?: number | null
          id?: number
          lq?: number | null
          nome?: string | null
          pedido?: string | null
          preco?: number | null
          proc?: boolean | null
          produto?: string | null
          quant?: number | null
          rec?: boolean | null
          telefone?: string | null
          tipo?: string | null
          venda?: string | null
        }
        Update: {
          account?: string | null
          "combo?"?: boolean | null
          data?: string
          descricao?: string | null
          dias?: number | null
          empresa?: string | null
          fee?: number | null
          fee_mp?: number | null
          id?: number
          lq?: number | null
          nome?: string | null
          pedido?: string | null
          preco?: number | null
          proc?: boolean | null
          produto?: string | null
          quant?: number | null
          rec?: boolean | null
          telefone?: string | null
          tipo?: string | null
          venda?: string | null
        }
        Relationships: []
      }
      botRecarga_keys: {
        Row: {
          apikey_adm: string | null
          apikey_empresa: string | null
          created_at: string | null
          empresa: string | null
          endpoint_adm: string | null
          endpoint_empresa: string | null
          id: number
          logs: string | null
          telefone_admin: string | null
          telefone_empresa: string | null
          token_mp: string | null
          token_panel: string | null
        }
        Insert: {
          apikey_adm?: string | null
          apikey_empresa?: string | null
          created_at?: string | null
          empresa?: string | null
          endpoint_adm?: string | null
          endpoint_empresa?: string | null
          id: number
          logs?: string | null
          telefone_admin?: string | null
          telefone_empresa?: string | null
          token_mp?: string | null
          token_panel?: string | null
        }
        Update: {
          apikey_adm?: string | null
          apikey_empresa?: string | null
          created_at?: string | null
          empresa?: string | null
          endpoint_adm?: string | null
          endpoint_empresa?: string | null
          id?: number
          logs?: string | null
          telefone_admin?: string | null
          telefone_empresa?: string | null
          token_mp?: string | null
          token_panel?: string | null
        }
        Relationships: []
      }
      client_subscriptions: {
        Row: {
          amount: number
          app: string
          combo_app: string | null
          created_at: string
          due_date: string
          id: string
          is_combo: boolean | null
          last_payment_date: string | null
          name: string
          payment_status: string | null
          phone: string
        }
        Insert: {
          amount: number
          app: string
          combo_app?: string | null
          created_at?: string
          due_date: string
          id?: string
          is_combo?: boolean | null
          last_payment_date?: string | null
          name: string
          payment_status?: string | null
          phone: string
        }
        Update: {
          amount?: number
          app?: string
          combo_app?: string | null
          created_at?: string
          due_date?: string
          id?: string
          is_combo?: boolean | null
          last_payment_date?: string | null
          name?: string
          payment_status?: string | null
          phone?: string
        }
        Relationships: []
      }
      CODIGOS_PANEL: {
        Row: {
          codigo: string | null
          created_at: string
          dias: number | null
          empresa: string | null
          id: number
          produto: string | null
          usado: boolean | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          dias?: number | null
          empresa?: string | null
          id?: number
          produto?: string | null
          usado?: boolean | null
        }
        Update: {
          codigo?: string | null
          created_at?: string
          dias?: number | null
          empresa?: string | null
          id?: number
          produto?: string | null
          usado?: boolean | null
        }
        Relationships: []
      }
      inter: {
        Row: {
          created_at: string | null
          id: number
          token: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          token?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          token?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          compra: boolean | null
          created_at: string
          empresa: string | null
          id: number
          nome: string | null
          telefone: number | null
        }
        Insert: {
          compra?: boolean | null
          created_at?: string
          empresa?: string | null
          id?: number
          nome?: string | null
          telefone?: number | null
        }
        Update: {
          compra?: boolean | null
          created_at?: string
          empresa?: string | null
          id?: number
          nome?: string | null
          telefone?: number | null
        }
        Relationships: []
      }
      leadsPanel: {
        Row: {
          data: string
          empresa: string | null
          id: number
          nome: string | null
          uid: string | null
          whatsapp: string | null
        }
        Insert: {
          data?: string
          empresa?: string | null
          id?: number
          nome?: string | null
          uid?: string | null
          whatsapp?: string | null
        }
        Update: {
          data?: string
          empresa?: string | null
          id?: number
          nome?: string | null
          uid?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      lgs: {
        Row: {
          app: string | null
          created_at: string
          id: number
          link: string | null
        }
        Insert: {
          app?: string | null
          created_at?: string
          id?: number
          link?: string | null
        }
        Update: {
          app?: string | null
          created_at?: string
          id?: number
          link?: string | null
        }
        Relationships: []
      }
      pedidosPanel: {
        Row: {
          data: string
          id: number
          pedido: string | null
        }
        Insert: {
          data?: string
          id?: number
          pedido?: string | null
        }
        Update: {
          data?: string
          id?: number
          pedido?: string | null
        }
        Relationships: []
      }
      sections: {
        Row: {
          created_at: string
          empresa: string | null
          id: number
          menu: string | null
          nome: string | null
          telefone: string | null
          timestamp: number | null
        }
        Insert: {
          created_at?: string
          empresa?: string | null
          id?: number
          menu?: string | null
          nome?: string | null
          telefone?: string | null
          timestamp?: number | null
        }
        Update: {
          created_at?: string
          empresa?: string | null
          id?: number
          menu?: string | null
          nome?: string | null
          telefone?: string | null
          timestamp?: number | null
        }
        Relationships: []
      }
      "unitv-marcio-recargas30": {
        Row: {
          codigos: string | null
          created_at: string
          id: number
          usado: boolean | null
        }
        Insert: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
        }
        Update: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
        }
        Relationships: []
      }
      "unitv-marcio-recargas365": {
        Row: {
          codigos: string | null
          created_at: string
          id: number
          usado: boolean | null
        }
        Insert: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
        }
        Update: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
        }
        Relationships: []
      }
      "unitv-marco-recargas30": {
        Row: {
          codigos: string | null
          created_at: string
          id: number
          usado: boolean | null
        }
        Insert: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
        }
        Update: {
          codigos?: string | null
          created_at?: string
          id?: number
          usado?: boolean | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
