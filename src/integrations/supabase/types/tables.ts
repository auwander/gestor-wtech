export type Tables = {
  profiles: {
    Row: {
      id: string;
      company: string;
    };
    Insert: {
      id: string;
      company: string;
    };
    Update: {
      id?: string;
      company?: string;
    };
  };
  client_subscriptions: {
    Row: {
      id: string;
      created_at: string;
      name: string;
      phone: string;
      app: string;
      amount: number;
      due_date: string;
      is_combo: boolean | null;
      combo_app: string | null;
      last_payment_date: string | null;
      payment_status: string | null;
      company: string | null;
    };
    Insert: {
      id?: string;
      created_at?: string;
      name: string;
      phone: string;
      app: string;
      amount: number;
      due_date: string;
      is_combo?: boolean | null;
      combo_app?: string | null;
      last_payment_date?: string | null;
      payment_status?: string | null;
      company?: string | null;
    };
    Update: {
      id?: string;
      created_at?: string;
      name?: string;
      phone?: string;
      app?: string;
      amount?: number;
      due_date?: string;
      is_combo?: boolean | null;
      combo_app?: string | null;
      last_payment_date?: string | null;
      payment_status?: string | null;
      company?: string | null;
    };
  };
};