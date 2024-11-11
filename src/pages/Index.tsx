import { SubscriptionForm } from "@/components/SubscriptionForm";

const Index = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciamento de Assinaturas</h1>
      
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