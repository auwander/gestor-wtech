import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isBefore, isToday } from "date-fns";
import { Subscription } from "@/types/subscription";
import { EditSubscriptionDialog } from "./subscription/EditSubscriptionDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionsListProps {
  filter?: string | null;
}

export function SubscriptionsList({ filter }: SubscriptionsListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", filter],
    queryFn: async () => {
      let query = supabase
        .from("client_subscriptions")
        .select("*")
        .order("due_date", { ascending: true });

      const { data, error } = await query;
      if (error) throw error;

      const subscriptionsData = data as Subscription[];
      const today = new Date();

      switch (filter) {
        case 'inactive':
          // Filter overdue subscriptions
          return subscriptionsData.filter(sub => 
            isBefore(new Date(sub.due_date), today) && 
            sub.payment_status !== 'inactive'
          );
        case 'due-today':
          // Filter subscriptions due today
          return subscriptionsData.filter(sub => 
            isToday(new Date(sub.due_date))
          );
        case 'all':
          // Return all subscriptions
          return subscriptionsData;
        default:
          return subscriptionsData;
      }
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from("client_subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao deletar assinatura",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Assinatura deletada com sucesso",
    });
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>App</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subscriptions?.map((subscription) => (
            <TableRow key={subscription.id}>
              <TableCell>{subscription.name}</TableCell>
              <TableCell>{subscription.phone}</TableCell>
              <TableCell>{subscription.app}</TableCell>
              <TableCell>R$ {subscription.amount.toFixed(2)}</TableCell>
              <TableCell>
                {format(new Date(subscription.due_date), "dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    subscription.payment_status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {subscription.payment_status === "active"
                    ? "Ativo"
                    : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="flex items-center gap-2">
                <EditSubscriptionDialog subscription={subscription} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Confirmar exclusão
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir a assinatura de {subscription.name}? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(subscription.id)}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}