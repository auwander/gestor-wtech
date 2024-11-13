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
          <h1 className="text-3xl font-bold">Gerenciamento de Assinaturas</h1>
        </div>
        <Link to="/subscriptions">
          <Button variant="outline">Ver Lista de Assinaturas</Button>
        </Link>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Nova Assinatura</h2>
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
};

export default Index;