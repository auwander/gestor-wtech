import { supabase } from "@/integrations/supabase/client";
import { Subscription } from "@/types/subscription";

export async function deleteSubscription(id: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("company")
    .single();

  const { error } = await supabase
    .from("client_subscriptions")
    .delete()
    .match({ id, company: profile.company });
  
  if (error) throw error;
}

export async function updateSubscription(id: string, data: Partial<Subscription>) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("company")
    .single();

  const { error } = await supabase
    .from("client_subscriptions")
    .update({ ...data, company: profile.company })
    .match({ id, company: profile.company });
  
  if (error) throw error;
}

export async function getSubscription(id: string) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("company")
    .single();

  const { data, error } = await supabase
    .from("client_subscriptions")
    .select("*")
    .match({ id, company: profile.company })
    .single();
  
  if (error) throw error;
  return data;
}