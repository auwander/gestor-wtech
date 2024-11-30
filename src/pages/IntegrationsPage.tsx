import { Button } from "@/components/ui/button";
import { CreditCard, MessageSquare, LayoutPanelLeft } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const IntegrationsPage = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isBotActive, setIsBotActive] = useState(false);

  const handleWhatsAppClick = () => {
    // Toggle connection status for demonstration
    setIsConnected(!isConnected);
  };

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

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={handleWhatsAppClick}
          >
            <MessageSquare className="h-5 w-5" />
            WhatsApp
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            Status: 
            <span className={`font-medium ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={isBotActive}
              onCheckedChange={setIsBotActive}
              id="bot-mode"
            />
            <label htmlFor="bot-mode" className="text-sm">
              {isBotActive ? 'Bot Ativo' : 'Bot Inativo'}
            </label>
          </div>
        </div>

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