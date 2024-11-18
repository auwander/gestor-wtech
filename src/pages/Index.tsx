import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const navigate = useNavigate();
  const [userCompany, setUserCompany] = useState<string | null>(null);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        toast.error("Você precisa estar logado para acessar esta página");
        navigate("/login");
        return null;
      }
      return user;
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("company")
        .eq("id", user?.id)
        .single();

      if (error || !profile?.company) {
        toast.error("Erro ao carregar informações do perfil");
        navigate("/login");
        return null;
      }

      setUserCompany(profile.company);
      return profile;
    },
  });

  const { data: subscriptions, isLoading: isLoadingSubscriptions } = useQuery({
    queryKey: ["subscriptions", userCompany],
    enabled: !!userCompany,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_subscriptions")
        .select("*")
        .eq("company", userCompany)
        .order("due_date", { ascending: true });

      if (error) {
        toast.error("Erro ao carregar assinaturas");
        return [];
      }

      return data;
    },
  });

  if (isLoadingProfile || isLoadingSubscriptions) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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

        {profile && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">
              Informações da Empresa
            </h2>
            <p className="text-gray-700">
              Empresa: <span className="font-medium">{profile.company}</span>
            </p>
            <p className="text-gray-700 mt-2">
              Total de Clientes: <span className="font-medium">{subscriptions?.length || 0}</span>
            </p>
          </div>
        )}
        
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <SubscriptionForm />
        </div>

        {subscriptions && subscriptions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">
              Últimas Assinaturas ({userCompany})
            </h2>
            <div className="space-y-4">
              {subscriptions.slice(0, 5).map((subscription) => (
                <div
                  key={subscription.id}
                  className="p-4 bg-white rounded-lg shadow border border-purple-100"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-purple-900">{subscription.name}</p>
                      <p className="text-sm text-gray-600">{subscription.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-purple-900">
                        R$ {subscription.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Vencimento: {new Date(subscription.due_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;