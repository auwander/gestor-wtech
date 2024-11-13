import { SubscriptionsList } from "@/components/SubscriptionsList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, PlusCircle, Search } from "lucide-react";
import { useState } from "react";

const Subscriptions = () => {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

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
            {filter === 'inactive' ? 'Clientes Inadimplentes' : 'Meus clientes'}
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

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Pesquisar por nome, telefone ou conta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <SubscriptionsList filter={filter} searchTerm={searchTerm} />
    </div>
  );
};

export default Subscriptions;