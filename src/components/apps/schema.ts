import * as z from "zod";

export const appFormSchema = z.object({
  app: z.string().min(1, "Selecione um app"),
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

export const APP_OPTIONS = [
  { display: "Tv Express", value: "TVE" },
  { display: "Duna Tv", value: "Duna" },
  { display: "Blue Tv", value: "Blue" },
  { display: "Eppi cinema", value: "Eppi" },
  { display: "Redplay", value: "Redplay" },
  { display: "Boto Tv", value: "Boto" },
  { display: "Tve Latino", value: "TVEL" },
  { display: "Onpix", value: "pix" },
  { display: "Unitv", value: "unitv" },
] as const;