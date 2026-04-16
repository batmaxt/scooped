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

// ---------------------------------------------------------------------------
// Create a new flavor from a scan (for unmatched items)
// ---------------------------------------------------------------------------

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createFlavorFromScan(
  name: string
): Promise<{ id: string; name: string; slug: string }> {
  const slug = slugify(name);

  const { data, error } = await supabase.rpc("create_flavor_from_scan", {
    p_name: name,
    p_slug: slug,
    p_category: "ice_cream",
  });

  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return {
    id: row.out_id || row.id,
    name: row.out_name || row.name,
    slug: row.out_slug || row.slug,
  } as { id: string; name: string; slug: string };
}
