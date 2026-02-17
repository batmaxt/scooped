import { createClient } from "@/lib/supabase/client";
import type { Alert } from "@/types/models";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Fetch user's alerts
// ---------------------------------------------------------------------------

export async function fetchUserAlerts(userId: string): Promise<Alert[]> {
  const { data, error } = await supabase
    .from("alerts")
    .select(
      `
      *,
      flavor:flavors(id, name, slug),
      brand:brands(id, name, slug, logo_url),
      location:locations(id, name, slug, city, state)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user alerts:", error);
    return [];
  }
  return (data || []) as unknown as Alert[];
}

// ---------------------------------------------------------------------------
// Fetch alert count (for limit display)
// ---------------------------------------------------------------------------

export async function fetchAlertCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching alert count:", error);
    return 0;
  }
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Create alert (enforces 3-alert limit for free users)
// ---------------------------------------------------------------------------

export async function createAlert(
  userId: string,
  alertType: "flavor" | "brand" | "location",
  targetId: string
): Promise<Alert> {
  const insertData: Record<string, unknown> = {
    user_id: userId,
    alert_type: alertType,
    is_active: true,
  };

  if (alertType === "flavor") insertData.flavor_id = targetId;
  else if (alertType === "brand") insertData.brand_id = targetId;
  else if (alertType === "location") insertData.location_id = targetId;

  const { data, error } = await supabase
    .from("alerts")
    .insert(insertData)
    .select(
      `
      *,
      flavor:flavors(id, name, slug),
      brand:brands(id, name, slug, logo_url),
      location:locations(id, name, slug, city, state)
    `
    )
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as Alert;
}

// ---------------------------------------------------------------------------
// Toggle alert active/inactive
// ---------------------------------------------------------------------------

export async function toggleAlert(
  alertId: string,
  isActive: boolean
): Promise<void> {
  const { error } = await supabase
    .from("alerts")
    .update({ is_active: isActive })
    .eq("id", alertId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Delete alert
// ---------------------------------------------------------------------------

export async function deleteAlert(alertId: string): Promise<void> {
  const { error } = await supabase
    .from("alerts")
    .delete()
    .eq("id", alertId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Trigger alert matching (called after business adds flavor)
// ---------------------------------------------------------------------------

export async function triggerAlertMatching(
  locationId: string,
  flavorId: string,
  brandId: string | null,
  actorId: string
): Promise<number> {
  const { data, error } = await supabase.rpc("match_alerts_for_availability", {
    p_location_id: locationId,
    p_flavor_id: flavorId,
    p_brand_id: brandId,
    p_actor_id: actorId,
  });

  if (error) {
    console.error("Error matching alerts:", error);
    return 0;
  }
  return data as number;
}

// ---------------------------------------------------------------------------
// Fetch brands (for AddAlertSheet search)
// ---------------------------------------------------------------------------

export async function fetchBrands(searchQuery: string) {
  const query = supabase
    .from("brands")
    .select("id, name, slug, logo_url")
    .order("name");

  if (searchQuery.trim()) {
    query.ilike("name", `%${searchQuery.trim()}%`);
  }

  const { data, error } = await query.limit(30);

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
  return data || [];
}
