import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isBefore, isEqual, parseISO, format } from "date-fns";
import { Subscription } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionRow } from "./subscription/SubscriptionRow";
import { deleteSubscription } from "@/utils/supabaseOperations";

interface SubscriptionsListProps {
  filter?: string | null;
}

export function SubscriptionsList({ filter }: SubscriptionsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", filter],
    queryFn: async () => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("company")
        .single();

      let query = supabase
        .from("client_subscriptions")
        .select("*")
        .eq("company", profile.company)
        .order("due_date", { ascending: true });

      const { data, error } = await query;
      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar assinaturas",
          description: error.message,
        });
        throw error;
      }

      const subscriptionsData = data as Subscription[];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (filter) {
        case 'inactive':
          return subscriptionsData.filter(sub => {
            const dueDate = new Date(sub.due_date);
            dueDate.setHours(0, 0, 0, 0);
            return isBefore(dueDate, today) && sub.payment_status !== 'inactive';
          });
        case 'due-today':
          return subscriptionsData.filter(sub => {
            const dueDate = new Date(sub.due_date);
            dueDate.setHours(0, 0, 0, 0);
            return isEqual(dueDate, today);
          });
        case 'all':
          return subscriptionsData;
        default:
          return subscriptionsData;
      }
    },
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteSubscription(id);
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({ title: "Assinatura deletada com sucesso" });
    } catch (error: any) {
      console.error("Error deleting subscription:", error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar assinatura",
        description: error.message || "Ocorreu um erro ao tentar deletar a assinatura.",
      });
    }
  };

  const getRowClassName = (dueDate: string) => {
    const date = new Date(dueDate);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (isBefore(date, today)) {
      return "bg-red-100";
    }
    if (isEqual(date, today)) {
      return "bg-blue-100";
    }
    return "bg-green-100";
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Conta</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <SubscriptionRow
              key={subscription.id}
              subscription={subscription}
              onDelete={handleDelete}
              className={getRowClassName(subscription.due_date)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}