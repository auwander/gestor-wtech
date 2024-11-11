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
import { format } from "date-fns";
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

export function SubscriptionsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_subscriptions")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Subscription[];
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
                      <AlertDialogCancel>CancelCertainly! I'll add a "Delete" action to the subscriptions list. We'll need to modify the `SubscriptionsList` component to include a delete button for each subscription and implement the delete functionality.

Let's update the `SubscriptionsList.tsx` file to include this new feature:

<lov-code>
<lov-write file_path="src/components/SubscriptionsList.tsx">
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Subscription } from "@/types/subscription";
import { EditSubscriptionDialog } from "./subscription/EditSubscriptionDialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SubscriptionsList() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_subscriptions")
        .select("*")
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Subscription[];
    },
  });

  const deleteSubscription = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("client_subscriptions")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast({
        title: "Assinatura excluída",
        description: "A assinatura foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao excluir assinatura",
        description: "Ocorreu um erro ao tentar excluir a assinatura.",
        variant: "destructive",
      });
      console.error("Error deleting subscription:", error);
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta assinatura?")) {
      deleteSubscription.mutate(id);
    }
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
              <TableCell>
                <div className="flex items-center space-x-2">
                  <EditSubscriptionDialog subscription={subscription} />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}