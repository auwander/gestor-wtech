import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [userCompany, setUserCompany] = useState<string | null>(null);

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          toast.error("Você precisa estar logado para acessar esta página");
          navigate("/login");
          return;
        }

        // Get user's company from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('company')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          toast.error("Erro ao carregar informações do perfil");
          return;
        }

        setUserCompany(profileData?.company || null);
      } catch (error) {
        console.error("Error in checkUserAccess:", error);
        toast.error("Erro ao verificar acesso");
      }
    };

    checkUserAccess();
  }, [navigate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <Link to="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <Link to="/subscriptions">
          <Button variant="outline" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
            Visualizar Clientes
          </Button>
        </Link>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-center mb-8">
          Cadastrar Cliente
        </h1>
        
        {userCompany && (
          <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
            <SubscriptionForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;