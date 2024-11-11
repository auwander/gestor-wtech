import * as z from "zod";

export const formSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  app: z.string().min(1, "Selecione um app"),
  amount: z.string().min(1, "Digite o valor"),
  due_date: z.string().min(1, "Selecione uma data"),
  is_combo: z.boolean().default(false),
});

export const APP_OPTIONS = [
  "Redplay",
  "Duna",
  "TVE",
  "Blue",
  "pix",
  "Eppi",
] as const;