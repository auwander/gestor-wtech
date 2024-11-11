import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  app: z.string().min(1, "Selecione um app"),
  amount: z.string().min(1, "Digite o valor"),
  due_date: z.string().min(1, "Selecione uma data"),
  is_combo: z.boolean().default(false),
  combo_app: z.string().optional(),
});

const APP_OPTIONS = [
  "Redplay",
  "Duna",
  "TVE",
  "Blue",
  "pix",
  "Eppi",
] as const;

const COMBO_OPTIONS = [
  "Eppi Redplay",
  "Eppi Duna",
  "Eppi TVE",
  "Eppi Blue",
  "Eppi pix",
] as const;

export function SubscriptionForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      is_combo: false,
    },
  });

  const isCombo = form.watch("is_combo");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.from("client_subscriptions").insert({
        name: values.name,
        phone: values.phone,
        app: values.app,
        amount: parseFloat(values.amount),
        due_date: values.due_date,
        is_combo: values.is_combo,
        combo_app: values.combo_app,
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
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(00) 00000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="app"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um app" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {APP_OPTIONS.map((app) => (
                    <SelectItem key={app} value={app}>
                      {app}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="due_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Vencimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_combo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Combo?</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {isCombo && (
          <FormField
            control={form.control}
            name="combo_app"
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Combo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COMBO_OPTIONS.map((app) => (
                      <SelectItem key={app} value={app}>
                        {app}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Registrar Assinatura</Button>
      </form>
    </Form>
  );
}