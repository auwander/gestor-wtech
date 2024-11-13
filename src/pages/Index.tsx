import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Cadastrar Cliente
          </h1>
        </div>
        <Link to="/subscriptions">
          <Button variant="outline" className="hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
            Ver Lista de Assinaturas
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <h2 className="text-xl font-semibold mb-6 text-purple-800">Novo Cadastro</h2>
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
};

export default Index;