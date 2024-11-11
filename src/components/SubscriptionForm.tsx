import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { formSchema } from "./subscription/schema";
import { FormFields } from "./subscription/FormFields";
import type { z } from "zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SubscriptionForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userCompany, setUserCompany] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_combo: false,
    },
  });

  useEffect(() => {
    async function getUserCompany() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('company')
          .eq('id', user.id)
          .single();
        
        if (error) {
          toast({
            variant: "destructive",
            title: "Erro ao carregar perfil",
            description: "Por favor, faça login novamente.",
          });
          await supabase.auth.signOut();
          navigate('/login');
          return;
        }
        
        if (profile) {
          setUserCompany(profile.company);
        }
      }
    }
    getUserCompany();
  }, [toast, navigate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userCompany) {
      toast({
        variant: "destructive",
        title: "Erro ao registrar assinatura",
        description: "Empresa não encontrada para o usuário.",
      });
      return;
    }

    try {
      const { error } = await supabase.from("client_subscriptions").insert({
        name: values.name,
        phone: values.phone,
        app: values.app,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
        company: userCompany,
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