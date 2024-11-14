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

  // Extract base app name if it's a combo
  const baseApp = subscription.is_combo ? subscription.app.replace(" Eppi", "") : subscription.app;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subscription.name,
      phone: subscription.phone,
      app: baseApp,
      amount: subscription.amount.toString(),
      due_date: subscription.due_date,
      is_combo: Boolean(subscription.is_combo), // Explicitly convert to boolean
      account: subscription.account || "",
      subscription_duration: subscription.subscription_duration || 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const appName = values.is_combo ? `${values.app} Eppi` : values.app;

      await updateSubscription(subscription.id, {
        name: values.name,
        phone: values.phone,
        app: appName,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
        account: values.account || null,
        subscription_duration: values.subscription_duration,
      });

      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      
      toast({
        title: "Cliente atualizado com sucesso!",
        description: values.is_combo 
          ? "Os dados foram atualizados com combo Eppi."
          : "Os dados foram atualizados no sistema.",
      });

      setOpen(false);
    } catch (error: any) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar cliente",
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