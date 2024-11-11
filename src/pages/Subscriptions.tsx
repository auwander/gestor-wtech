import { SubscriptionsList } from "@/components/SubscriptionsList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const Subscriptions = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline" size="icon">
            <Home className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Lista de Assinaturas</h1>
      </div>
      <SubscriptionsList />
    </div>
  );
};

export default Subscriptions;