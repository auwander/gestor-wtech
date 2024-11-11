import { SubscriptionsList } from "@/components/SubscriptionsList";

const Subscriptions = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Lista de Assinaturas</h1>
      <SubscriptionsList />
    </div>
  );
};

export default Subscriptions;