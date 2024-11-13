import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Bem-vindo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Faça login para continuar
          </p>
        </div>
        <div className="mt-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            providers={[]}
          />
        </div>
      </div>
    </div>
  );
}