import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciamento de Assinaturas</h1>
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