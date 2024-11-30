import { Button } from "@/components/ui/button";
import { Users, PlusCircle, AppWindow, Plug, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const DashboardActions = () => {
  const navigate = useNavigate();

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

  return (
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
        onClick={() => navigate("/apps")}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <AppWindow className="h-4 w-4" />
        Cadastrar Apps
      </Button>
      <Button
        onClick={() => navigate("/integrations")}
        className="w-full sm:w-auto flex items-center justify-center gap-2"
      >
        <Plug className="h-4 w-4" />
        Integrações
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
  );
};