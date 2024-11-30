import { Button } from "@/components/ui/button";
import { CreditCard, MessageSquare, LayoutPanelLeft } from "lucide-react";

export const IntegrationsPage = () => {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Integrações</h1>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <CreditCard className="h-5 w-5" />
          Mercado Pago
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <MessageSquare className="h-5 w-5" />
          WhatsApp
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <LayoutPanelLeft className="h-5 w-5" />
          Panel
        </Button>
      </div>
    </div>
  );
};