import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema } from "./subscription/schema";
import { FormFields } from "./subscription/FormFields";
import type { z } from "zod";

export function SubscriptionForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_combo: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("client_subscriptions").insert({
        name: values.name,
        phone: values.phone,
        app: values.app,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
      });

      if (error) throw error;

      toast({
        title: "Assinatura registrada com sucesso!",
        description: "O cliente foi cadastrado no sistema.",
      });

      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar assinatura",
        description: "Tente novamente mais tarde.",
      });
      console.error("Error details:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFields form={form} />
        <Button type="submit">Registrar Assinatura</Button>
      </form>
    </Form>
  );
}