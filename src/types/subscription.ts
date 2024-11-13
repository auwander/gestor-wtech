export type Subscription = {
  id: string;
  name: string;
  phone: string;
  app: string;
  amount: number;
  due_date: string;
  is_combo: boolean;
  combo_app?: string;
  last_payment_date?: string;
  payment_status?: string;
  company?: string;
  account?: string;
  subscription_duration?: number;
};