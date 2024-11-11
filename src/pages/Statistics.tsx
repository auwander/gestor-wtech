import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Statistics = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["subscription-statistics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_statistics")
        .select("*")
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: appStats, isLoading: appStatsLoading } = useQuery({
    queryKey: ["subscriptions-by-app"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions_by_app")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  if (statsLoading || appStatsLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Estatísticas de Assinaturas</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_subscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Assinaturas Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_subscriptions}</div>
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
              R$ {stats?.total_revenue?.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Assinaturas por App</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                active: { theme: { light: "#22c55e", dark: "#22c55e" } },
                total: { theme: { light: "#64748b", dark: "#64748b" } },
              }}
            >
              <BarChart data={appStats}>
                <XAxis dataKey="app" />
                <YAxis />
                <ChartTooltip />
                <Bar dataKey="active" name="Ativas" fill="var(--color-active)" />
                <Bar dataKey="total" name="Total" fill="var(--color-total)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Valor Médio das Assinaturas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats?.average_subscription_value?.toFixed(2)}
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
            <div className="text-2xl font-bold">{stats?.total_apps}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;