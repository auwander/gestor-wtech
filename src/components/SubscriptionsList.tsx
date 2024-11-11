import { useQuery } from "@tanstack/react-query";
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

export function SubscriptionsList() {
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
                <EditSubscriptionDialog subscription={subscription} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}