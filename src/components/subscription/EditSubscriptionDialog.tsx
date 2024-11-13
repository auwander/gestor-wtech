import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Subscription } from "@/types/subscription";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import { FormFields } from "./FormFields";
import { updateSubscription } from "@/utils/supabaseOperations";
import type { z } from "zod";

interface EditSubscriptionDialogProps {
  subscription: Subscription;
}

export function EditSubscriptionDialog({ subscription }: EditSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subscription.name,
      phone: subscription.phone,
      app: subscription.app,
      amount: subscription.amount.toString(),
      due_date: subscription.due_date,
      is_combo: subscription.is_combo,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateSubscription(subscription.id, {
        name: values.name,
        phone: values.phone,
        app: values.app,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
      });

      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      
      toast({
        title: "Assinatura atualizada com sucesso!",
        description: "Os dados foram atualizados no sistema.",
      });

      setOpen(false);
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar assinatura",
        description: error.message || "Tente novamente mais tarde.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormFields form={form} />
            <Button type="submit">Salvar Alterações</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}