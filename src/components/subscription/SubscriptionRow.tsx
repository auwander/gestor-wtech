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
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year.slice(2)}`;
  };

  return (
    <TableRow className={className}>
      <TableCell>{subscription.name}</TableCell>
      <TableCell>{subscription.phone}</TableCell>
      <TableCell>{subscription.account || '-'}</TableCell>
      <TableCell>{subscription.app}</TableCell>
      <TableCell>R$ {subscription.amount.toFixed(2)}</TableCell>
      <TableCell>{formatDate(subscription.due_date)}</TableCell>
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