import { createClient } from "@/lib/supabase/client";

// ---------------------------------------------------------------------------
// Save push subscription to database
// ---------------------------------------------------------------------------

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
): Promise<void> {
  const supabase = createClient();
  const sub = subscription.toJSON();

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: userId,
      endpoint: sub.endpoint,
      subscription_json: sub,
      device_type: "web",
      is_active: true,
    },
    {
      onConflict: "user_id,endpoint",
    }
  );

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Remove push subscription from database
// ---------------------------------------------------------------------------

export async function removePushSubscription(
  userId: string,
  endpoint: string
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("endpoint", endpoint);

  if (error) throw error;
}
