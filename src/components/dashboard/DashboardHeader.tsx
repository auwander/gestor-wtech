import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DashboardHeaderProps {
  userEmail: string | null;
  userCompany: string | null;
}

export const DashboardHeader = ({ userEmail, userCompany }: DashboardHeaderProps) => {
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
  );
};