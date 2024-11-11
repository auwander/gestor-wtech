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
      // First check if the subscription exists
      const { data: existingData, error: checkError } = await supabase
        .from("client_subscriptions")
        .select()
        .eq("id", subscription.id);

      if (checkError) {
        console.error("Error checking subscription:", checkError);
        toast({
          variant: "destructive",
          title: "Erro ao verificar assinatura",
          description: checkError.message,
        });
        return;
      }

      if (!existingData || existingData.length === 0) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar assinatura",
          description: "Assinatura não encontrada.",
        });
        return;
      }

      // If subscription exists, proceed with update
      const { error: updateError } = await supabase
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

      if (updateError) {
        console.error("Supabase update error:", updateError);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar assinatura",
          description: updateError.message,
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      
      toast({
        title: "Assinatura atualizada com sucesso!",
        description: "Os dados foram atualizados no sistema.",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar assinatura",
        description: "Tente novamente mais tarde.",
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