import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardStats } from "@/components/dashboard/DashboardStats";

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userCompany, setUserCompany] = useState<string | null>(null);

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          if (error.message.includes('session_not_found')) {
            navigate("/login");
            return;
          }
          throw error;
        }
        setUserEmail(user?.email || null);

        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('company')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            return;
          }

          if (profileData) {
            setUserCompany(profileData.company);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };
    getUserEmail();
  }, [navigate]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard-stats", userCompany],
    queryFn: async () => {
      if (!userCompany) return null;

      const { data: allClients, count: totalCount } = await supabase
        .from("client_subscriptions")
        .select("id", { count: "exact", head: true })
        .eq('company', userCompany);

      const { data: subscriptions } = await supabase
        .from("client_subscriptions")
        .select("due_date, amount, payment_status")
        .eq('company', userCompany);

      const overdueCount = subscriptions?.filter(sub => {
        const dueDate = new Date(sub.due_date);
        return dueDate < today && sub.payment_status !== 'inactive';
      }).length || 0;

      const dueTodayCount = subscriptions?.filter(sub => {
        const dueDate = new Date(sub.due_date);
        return dueDate.toDateString() === today.toDateString();
      }).length || 0;

      const monthlyRevenue = subscriptions?.reduce((acc, curr) => {
        if (curr.payment_status === 'active') {
          return acc + Number(curr.amount);
        }
        return acc;
      }, 0) || 0;

      return {
        totalClients: totalCount || 0,
        overdueClients: overdueCount,
        dueTodayClients: dueTodayCount,
        monthlyRevenue: monthlyRevenue,
      };
    },
    enabled: !!userCompany,
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <DashboardHeader userEmail={userEmail} userCompany={userCompany} />
        <DashboardActions />
      </div>
      <DashboardStats stats={stats} />
    </div>
  );
}