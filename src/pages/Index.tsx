import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Index = () => {
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
        
        <div className="p-6 rounded-lg shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
};

export default Index;