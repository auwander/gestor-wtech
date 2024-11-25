import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { appFormSchema } from "./schema";
import { AppFormFields } from "./AppFormFields";
import type { z } from "zod";
import { useNavigate } from "react-router-dom";

export function AppForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof appFormSchema>>({
    resolver: zodResolver(appFormSchema),
    defaultValues: {
      app: "",
      plano: "",
      descricao: "",
      categoria: "",
      preco: "",
    },
  });

  async function onSubmit(values: z.infer<typeof appFormSchema>) {
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

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('company')
        .eq('id', user.id)
        .single();

      if (profileError || !profile?.company) {
        toast({
          variant: "destructive",
          title: "Erro ao registrar app",
          description: "Empresa não encontrada para o usuário.",
        });
        return;
      }

      const { error } = await supabase.from("my_apps").insert({
        app: values.app,
        plano: values.plano,
        descricao: values.descricao,
        categoria: values.categoria,
        preco: parseFloat(values.preco),
        empresa: profile.company,
      });

      if (error) throw error;

      toast({
        title: "App registrado com sucesso!",
        description: "O app foi cadastrado no sistema.",
      });

      form.reset();
    } catch (error) {
      console.error("Error details:", error);
      toast({
        variant: "destructive",
        title: "Erro ao registrar app",
        description: "Tente novamente mais tarde.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AppFormFields form={form} />
        <Button type="submit">Salvar App</Button>
      </form>
    </Form>
  );
}