import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export const StatisticsHeader = () => (
  <div className="flex items-center gap-4 mb-8">
    <Link to="/">
      <Button variant="outline" size="icon">
        <Home className="h-4 w-4" />
      </Button>
    </Link>
    <h1 className="text-3xl font-bold">Estatísticas de Assinaturas</h1>
  </div>
);