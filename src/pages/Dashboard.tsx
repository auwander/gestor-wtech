import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, isBefore, isEqual, parseISO, startOfDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Users, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Dashboard() {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
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

        // Get user's company
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

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (error.message.includes('session_not_found')) {
          toast.success("Logout realizado com sucesso");
          navigate("/login");
          return;
        }
        toast.error("Erro ao fazer logout: " + error.message);
      } else {
        toast.success("Logout realizado com sucesso");
        navigate("/login");
      }
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    }
  };

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
        const dueDate = startOfDay(parseISO(sub.due_date));
        return isBefore(dueDate, today) && sub.payment_status !== 'inactive';
      }).length || 0;

      const dueTodayCount = subscriptions?.filter(sub => {
        const dueDate = startOfDay(parseISO(sub.due_date));
        return isEqual(dueDate, today);
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
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>
          {userEmail && (
            <p className="text-sm text-muted-foreground">
              Logado como: {userEmail}
            </p>
          )}
          {userCompany && (
            <p className="text-sm text-muted-foreground">
              Empresa: {userCompany}
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:gap-4 items-center">
          <Button
            onClick={() => navigate("/subscriptions")}
            variant="outline"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Users className="h-4 w-4" />
            Visualizar Clientes
          </Button>
          <Button
            onClick={() => navigate("/home")}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Cadastrar Cliente
          </Button>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="w-full cursor-pointer hover:bg-accent transition-colors border-2"
          onClick={() => navigate("/subscriptions?filter=all")}
        >
          <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Total de Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <div className="text-4xl font-bold">{stats?.totalClients || 0}</div>
          </CardContent>
        </Card>

        <Card 
          className="w-full cursor-pointer hover:bg-accent transition-colors border-2"
          onClick={() => navigate("/subscriptions?filter=inactive")}
        >
          <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Clientes Inadimplentes
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <div className="text-4xl font-bold text-red-500">{stats?.overdueClients || 0}</div>
          </CardContent>
        </Card>

        <Card 
          className="w-full cursor-pointer hover:bg-accent transition-colors border-2"
          onClick={() => navigate("/subscriptions?filter=due-today")}
        >
          <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Vencimentos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <div className="text-4xl font-bold text-yellow-500">{stats?.dueTodayClients || 0}</div>
          </CardContent>
        </Card>

        <Card className="w-full border-2">
          <CardHeader className="flex flex-col items-center justify-center space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              Faturamento Mensal
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center pt-4">
            <div className="text-4xl font-bold text-green-500">
              R$ {stats?.monthlyRevenue.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}