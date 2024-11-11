import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { APP_OPTIONS } from "./schema";
import { UseFormReturn } from "react-hook-form";

interface FormFieldsProps {
  form: UseFormReturn<any>;
}

export function FormFields({ form }: FormFieldsProps) {
  return (
    <>
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
            <Select 
              onValueChange={(value) => {
                const isCombo = form.getValues("is_combo");
                field.onChange(isCombo ? `${value} Eppi` : value);
              }} 
              value={field.value?.replace(" Eppi", "")}
            >
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
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  const currentApp = form.getValues("app")?.replace(" Eppi", "");
                  if (currentApp) {
                    form.setValue("app", checked ? `${currentApp} Eppi` : currentApp);
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Combo?</FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}