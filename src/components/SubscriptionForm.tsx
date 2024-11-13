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
      account: "",
    },
  });

  useEffect(() => {
    async function getUserCompany() {
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

        console.log("Current user:", user); // Debug log

        // Primeiro, tentar obter o perfil existente
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('company')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.log("Profile error:", profileError); // Debug log
          
          // Se o perfil não existir, criar um novo
          const companyName = user.email?.split('@')[0] || 'default-company';
          console.log("Attempting to create profile with company:", companyName); // Debug log
          
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([
              { id: user.id, company: companyName }
            ])
            .select()
            .single();

          if (insertError) {
            console.error("Error creating profile:", insertError);
            toast({
              variant: "destructive",
              title: "Erro ao criar perfil",
              description: "Por favor, contate o suporte.",
            });
            return;
          }

          if (newProfile) {
            console.log("New profile created:", newProfile); // Debug log
            setUserCompany(newProfile.company);
          }
        } else if (profile) {
          console.log("Existing profile found:", profile); // Debug log
          setUserCompany(profile.company);
        }
      } catch (error) {
        console.error("Error in getUserCompany:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar perfil",
          description: "Por favor, tente novamente mais tarde.",
        });
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
      const dueDate = values.due_date;

      const { error } = await supabase.from("client_subscriptions").insert({
        name: values.name,
        phone: values.phone,
        app: values.app,
        amount: parseFloat(values.amount),
        due_date: dueDate,
        is_combo: values.is_combo,
        combo_app: values.is_combo ? "Eppi" : null,
        company: userCompany,
        account: values.account || null,
      });

      if (error) throw error;

      toast({
        title: "Assinatura registrada com sucesso!",
        description: "O cliente foi cadastrado no sistema.",
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