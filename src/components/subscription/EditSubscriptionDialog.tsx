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
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/subscription";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./schema";
import { FormFields } from "./FormFields";
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
      const { error } = await supabase
        .from("client_subscriptions")
        .update({
          name: values.name,
          phone: values.phone,
          app: values.app,
          amount: parseFloat(values.amount),
          due_date: values.due_date,
          is_combo: values.is_combo,
          combo_app: values.is_combo ? "Eppi" : null,
        })
        .eq("id", subscription.id);

      if (error) throw error;

      toast({
        title: "Assinatura atualizada com sucesso!",
        description: "Os dados foram atualizados no sistema.",
      });

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar assinatura",
        description: "Tente novamente mais tarde.",
      });
      console.error("Error details:", error);
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
          <DialogTitle>Editar Assinatura</DialogTitle>
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