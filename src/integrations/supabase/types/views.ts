export type Views = {
  subscription_statistics: {
    Row: {
      total_subscriptions: number | null;
      active_subscriptions: number | null;
      inactive_subscriptions: number | null;
      total_revenue: number | null;
      average_subscription_value: number | null;
      total_apps: number | null;
    };
  };
  subscriptions_by_app: {
    Row: {
      app: string | null;
      total: number | null;
      active: number | null;
      revenue: number | null;
    };
  };
};