import * as z from "zod";

export const appFormSchema = z.object({
  app: z.string().min(2, "Nome do app deve ter pelo menos 2 caracteres"),
  plano: z.string().min(1, "Selecione um plano"),
  descricao: z.string().min(1, "Digite uma descrição"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  preco: z.string().min(1, "Digite o valor"),
});

export const PLANO_OPTIONS = [
  "Mensal",
  "Anual",
  "Vitalício",
] as const;

export const CATEGORIA_OPTIONS = [
  "Streaming",
  "VPN",
  "Utilitários",
  "Jogos",
  "Outros",
] as const;