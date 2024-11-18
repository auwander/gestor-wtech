import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

const Statistics = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast.error("Você precisa estar logado para acessar esta página");
          navigate("/login");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company')
          .eq('id', user.id)
          .single();

        if (profileError || !profile) {
          console.error("Error fetching profile:", profileError);
          toast.error("Erro ao carregar informações do perfil");
          navigate("/login");
          return;
        }
      } catch (error) {
        console.error("Error in checkUserAccess:", error);
        toast.error("Erro ao verificar acesso");
        navigate("/login");
      }
    };

    checkUserAccess();
  }, [navigate]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["subscription-statistics"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user?.id)
        .single();

      if (!profile?.company) throw new Error("Company not found");

      const { data: subscriptions } = await supabase
        .from("client_subscriptions")
        .select("*")
        .eq('company', profile.company);

      if (!subscriptions) return null;

      const total = subscriptions.length;
      const active = subscriptions.filter(sub => sub.payment_status !== 'inactive').length;
      const inactive = total - active;
      const totalRevenue = subscriptions.reduce((sum, sub) => sum + Number(sub.amount), 0);
      const averageValue = total > 0 ? totalRevenue / total : 0;
      const uniqueApps = new Set(subscriptions.map(sub => sub.app)).size;

      return {
        total_subscriptions: total,
        active_subscriptions: active,
        inactive_subscriptions: inactive,
        total_revenue: totalRevenue,
        average_subscription_value: averageValue,
        total_apps: uniqueApps,
      };
    },
  });

  const { data: appStats, isLoading: appStatsLoading } = useQuery({
    queryKey: ["subscriptions-by-app"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user?.id)
        .single();

      if (!profile?.company) throw new Error("Company not found");

      const { data: subscriptions } = await supabase
        .from("client_subscriptions")
        .select("*")
        .eq('company', profile.company);

      if (!subscriptions) return [];

      const appStatsMap = subscriptions.reduce((acc, sub) => {
        if (!acc[sub.app]) {
          acc[sub.app] = {
            app: sub.app,
            total: 0,
            active: 0,
            revenue: 0
          };
        }
        acc[sub.app].total += 1;
        if (sub.payment_status !== 'inactive') {
          acc[sub.app].active += 1;
          acc[sub.app].revenue += Number(sub.amount);
        }
        return acc;
      }, {} as Record<string, any>);

      return Object.values(appStatsMap);
    },
  });

  if (statsLoading || appStatsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Estatísticas de Assinaturas</h1>
      </div>
      
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
              <BarChart data={appStats || []}>
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
    </div>
  );
};

export default Statistics;