import { SubscriptionsList } from "@/components/SubscriptionsList";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, PlusCircle } from "lucide-react";

const Subscriptions = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            {filter === 'inactive' ? 'Clientes Inadimplentes' : 'Lista de Assinaturas'}
          </h1>
        </div>
        <Button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Cadastrar Cliente
        </Button>
      </div>
      <SubscriptionsList filter={filter} />
    </div>
  );
};

export default Subscriptions;