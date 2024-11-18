import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatisticsCardsProps {
  stats: {
    total_subscriptions: number;
    active_subscriptions: number;
    total_revenue: number;
    average_subscription_value: number;
    total_apps: number;
  } | null;
}

export const StatisticsCards = ({ stats }: StatisticsCardsProps) => (
  <>
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_subscriptions || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Assinaturas Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.active_subscriptions || 0}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Receita Total
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {stats?.total_revenue?.toFixed(2) || '0.00'}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Valor Médio das Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R$ {stats?.average_subscription_value?.toFixed(2) || '0.00'}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Apps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.total_apps || 0}</div>
        </CardContent>
      </Card>
    </div>
  </>
);