import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Report a flavor sighting at a location
// ---------------------------------------------------------------------------

export async function reportSighting(
  locationId: string,
  flavorId: string,
  brandId?: string | null,
  userId?: string | null
): Promise<string> {
  const { data, error } = await supabase.rpc("report_flavor_sighting", {
    p_location_id: locationId,
    p_flavor_id: flavorId,
    p_brand_id: brandId || null,
    p_user_id: userId || null,
  });

  if (error) throw new Error(error.message);
  return data as string;
}
