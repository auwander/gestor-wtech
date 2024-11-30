import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface DashboardStatsProps {
  stats: {
    totalClients: number;
    overdueClients: number;
    dueTodayClients: number;
    monthlyRevenue: number;
  } | null;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const navigate = useNavigate();

  return (
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
  );
};