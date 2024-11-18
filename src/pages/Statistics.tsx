import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { StatisticsCards } from "@/components/statistics/StatisticsCards";
import { AppStatisticsChart } from "@/components/statistics/AppStatisticsChart";

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

        if (profileError || !profile?.company) {
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
      <StatisticsHeader />
      <StatisticsCards stats={stats} />
      <AppStatisticsChart appStats={appStats} />
    </div>
  );
};

export default Statistics;