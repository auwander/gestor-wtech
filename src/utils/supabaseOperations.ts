import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/subscription";

export async function deleteSubscription(id: string) {
  const { error } = await supabase
    .from("client_subscriptions")
    .delete()
    .match({ id });
  
  if (error) throw error;
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const { error } = await supabase
    .from("client_subscriptions")
    .update(data)
    .match({ id });
  
  if (error) throw error;
}

export async function getSubscription(id: string) {
  const { data, error } = await supabase
    .from("client_subscriptions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}