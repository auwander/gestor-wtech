import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema } from "./subscription/schema";
import { FormFields } from "./subscription/FormFields";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";

export function SubscriptionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_combo: false,
      account: "",
      subscription_duration: 30,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          variant: "destructive",
          title: "Erro de autenticação",
          description: "Por favor, faça login novamente.",
        });
        navigate('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      if (!profile?.company) {
        toast({
          variant: "destructive",
          title: "Erro ao registrar assinatura",
          description: "Empresa não encontrada para o usuário.",
        });
        return;
      }

      const appName = values.is_combo ? `${values.app} Eppi` : values.app;
      
      const { error } = await supabase.from("client_subscriptions").insert({
        name: values.name,
        phone: values.phone,
        app: appName,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
        company: profile.company,
        account: values.account || null,
        subscription_duration: values.subscription_duration,
      });

      if (error) throw error;

      toast({
        title: "Assinatura registrada com sucesso!",
        description: values.is_combo 
          ? "O cliente foi cadastrado no sistema com combo Eppi."
          : "O cliente foi cadastrado no sistema.",
        className: "fixed bottom-0 right-0 mb-4 mr-4",
      });

      form.reset({
        name: "",
        phone: "",
        app: "",
        amount: "",
        due_date: "",
        is_combo: false,
        account: "",
        subscription_duration: 30,
      });
    } catch (error) {
      console.error("Error details:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar assinatura",
        description: "Tente novamente mais tarde.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFields form={form} />
        <Button type="submit">Salvar Cadastro</Button>
      </form>
    </Form>
  );
}