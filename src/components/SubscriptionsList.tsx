import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parseISO, isBefore, isEqual, differenceInDays } from "date-fns";
import { Subscription } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionRow } from "./subscription/SubscriptionRow";
import { deleteSubscription } from "@/utils/supabaseOperations";

interface SubscriptionsListProps {
  filter?: string | null;
  searchTerm?: string;
}

const compareDates = (dateStr: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const date = new Date(dateStr + 'T00:00:00');
  const daysDifference = differenceInDays(today, date);
  return { 
    date, 
    isBeforeToday: isBefore(date, today),
    isToday: isEqual(date, today),
    daysDifference
  };
};

export function SubscriptionsList({ filter, searchTerm }: SubscriptionsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", filter, searchTerm],
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

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,account.ilike.%${searchTerm}%`);
      }

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

      switch (filter) {
        case 'inactive':
          return subscriptionsData.filter(sub => {
            const { isBeforeToday } = compareDates(sub.due_date);
            return isBeforeToday && sub.payment_status !== 'inactive';
          });
        case 'due-today':
          return subscriptionsData.filter(sub => {
            const { isToday } = compareDates(sub.due_date);
            return isToday;
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
    const { isBeforeToday, isToday } = compareDates(dueDate);
    
    if (isBeforeToday) {
      return "bg-red-50 hover:bg-red-100 transition-colors";
    }
    if (isToday) {
      return "bg-blue-50 hover:bg-blue-100 transition-colors";
    }
    return "bg-emerald-50 hover:bg-emerald-100 transition-colors";
  };

  if (isLoading) return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div className="rounded-xl border border-purple-200 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
            <TableHead className="font-semibold text-purple-900">Nome</TableHead>
            <TableHead className="font-semibold text-purple-900">Telefone</TableHead>
            <TableHead className="font-semibold text-purple-900">Conta</TableHead>
            <TableHead className="font-semibold text-purple-900">App</TableHead>
            <TableHead className="font-semibold text-purple-900">Valor</TableHead>
            <TableHead className="font-semibold text-purple-900">Vencimento</TableHead>
            <TableHead className="font-semibold text-purple-900">Duração</TableHead>
            <TableHead className="font-semibold text-purple-900">Ações</TableHead>
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