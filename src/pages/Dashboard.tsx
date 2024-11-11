import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const { data: totalClients } = await supabase
        .from("client_subscriptions")
        .select("id", { count: "exact" });

      const { data: overdueClients } = await supabase
        .from("client_subscriptions")
        .select("id", { count: "exact" })
        .eq("payment_status", "inactive");

      const { data: dueTodayClients } = await supabase
        .from("client_subscriptions")
        .select("id", { count: "exact" })
        .eq("due_date", today);

      const { data: monthlyRevenue } = await supabase
        .from("client_subscriptions")
        .select("amount")
        .eq("payment_status", "active");

      const totalMonthlyRevenue = monthlyRevenue?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

      return {
        totalClients: totalClients?.count || 0,
        overdueClients: overdueClients?.count || 0,
        dueTodayClients: dueTodayClients?.count || 0,
        monthlyRevenue: totalMonthlyRevenue,
      };
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Inadimplentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overdueClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Vencimentos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.dueTodayClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Faturamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {stats?.monthlyRevenue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}