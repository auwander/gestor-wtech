import { format } from "date-fns";
import { Subscription } from "@/types/subscription";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditSubscriptionDialog } from "./EditSubscriptionDialog";
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

interface SubscriptionRowProps {
  subscription: Subscription;
  onDelete: (id: string) => Promise<void>;
  className?: string;
}

export function SubscriptionRow({ subscription, onDelete, className }: SubscriptionRowProps) {
  return (
    <TableRow className={className}>
      <TableCell>{subscription.name}</TableCell>
      <TableCell>{subscription.phone}</TableCell>
      <TableCell>{subscription.account || '-'}</TableCell>
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
          {subscription.payment_status === "active" ? "Ativo" : "Inativo"}
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
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir a assinatura de {subscription.name}? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(subscription.id)}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}