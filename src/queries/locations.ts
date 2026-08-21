import { createClient } from "@/lib/supabase/client";
import type { Location } from "@/types/models";

const supabase = createClient();

export async function fetchNearbyLocations(
  lat: number,
  lng: number,
  radiusMeters: number = 800000,
  locationTypes?: string[]
): Promise<Location[]> {
  // Supabase caps responses at 1000 rows (server max_rows setting).
  // Paginate to fetch all results.
  const PAGE_SIZE = 1000;
  const allData: Location[] = [];
  let offset = 0;
  let keepGoing = true;

  while (keepGoing) {
    const { data, error } = await supabase
      .rpc("nearby_locations", {
        lat,
        lng,
        radius_meters: radiusMeters,
        location_types: locationTypes && locationTypes.length > 0 ? locationTypes : null,
      })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      if (error.message?.includes("AbortError") || error.code === "20") {
        return [];
      }
      console.error("Error fetching nearby locations:", error.message);
      return allData;
    }

    const rows = (data || []) as Location[];
    allData.push(...rows);

    if (rows.length < PAGE_SIZE) {
      keepGoing = false;
    } else {
      offset += PAGE_SIZE;
    }
  }

  return allData;
}

export async function fetchAllLocations(): Promise<Location[]> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching locations:", error.message);
    return [];
  }

  // Transform coordinates from PostGIS to lat/lng
  return (data || []).map((loc: Record<string, unknown>) => ({
    ...loc,
    latitude: 0, // Will be populated by RPC function
    longitude: 0,
  })) as Location[];
}

export async function fetchLocationBySlug(slug: string): Promise<Location | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    console.error("Error fetching location:", error.message);
    return null;
  }

  return data as unknown as Location;
}

export async function fetchLocationFlavors(locationId: string) {
  const { data, error } = await supabase.rpc("get_location_flavors", {
    p_location_id: locationId,
  });

  if (error) {
    console.error("Error fetching location flavors:", error.message);
    return [];
  }

  return data || [];
}

// ---------------------------------------------------------------------------
// Search locations that carry a specific flavor/brand
// ---------------------------------------------------------------------------

export interface FlavorSearchResult {
  id: string;
  name: string;
  slug: string;
  location_type: string;
  address_line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  hours: Record<string, unknown> | null;
  photo_url: string | null;
  avg_rating: number;
  total_ratings: number;
  total_checkins: number;
  is_claimed: boolean;
  latitude: number;
  longitude: number;
  distance_meters: number;
  matching_flavor_name: string;
  matching_brand_name: string | null;
  last_confirmed_at: string | null;
  availability_source: string;
  is_chain: boolean;
  chain_name: string | null;
}

export async function searchLocationsByFlavor(
  searchTerm: string,
  lat: number,
  lng: number,
  // Flavor search points you beyond your zone — cover the whole territory.
  radiusMeters: number = 250000
): Promise<FlavorSearchResult[]> {
  // Normalize "and" ↔ "&" so "ben and jerrys" matches "Ben & Jerry's"
  const normalized = searchTerm.replace(/\band\b/gi, "&");
  const term = normalized !== searchTerm ? normalized : searchTerm;

  const run = async (t: string): Promise<FlavorSearchResult[] | null> => {
    const { data, error } = await supabase.rpc("search_locations_by_flavor", {
      search_term: t,
      user_lat: lat,
      user_lng: lng,
      radius_meters: radiusMeters,
    });
    if (error) {
      if (error.message?.includes("AbortError") || error.code === "20") return null;
      console.error("Error searching locations by flavor:", error.message);
      return [];
    }
    return (data || []) as FlavorSearchResult[];
  };

  let results = await run(term);
  if (results === null) return [];
  // "waffles" should still find "Waffle Cone Crunch" — retry singular
  if (results.length === 0 && /s$/i.test(term.trim())) {
    results = (await run(term.trim().replace(/s$/i, ""))) ?? [];
  }
  // The RPC returns rows in location-id order; closest first is the product.
  return results.sort(
    (a, b) => (a.distance_meters ?? Infinity) - (b.distance_meters ?? Infinity)
  );
}

export async function fetchFeaturedLocation(
  lat: number,
  lng: number
): Promise<Location | null> {
  // Featured creamery comes from the same 5-mile "nearby" radius
  const locations = await fetchNearbyLocations(lat, lng, 8047, ["scoop_shop"]);
  if (locations.length === 0) return null;

  // Best: highest-rated scoop shop with check-ins
  const withCheckins = locations.filter((l) => l.total_checkins > 0);
  if (withCheckins.length > 0) {
    withCheckins.sort((a, b) => b.avg_rating - a.avg_rating);
    return withCheckins[0];
  }

  // Fallback: first scoop shop by distance (already sorted by distance from RPC)
  return locations[0];
}

export async function fetchLocationCheckins(locationId: string, limit: number = 20) {
  const { data, error } = await supabase
    .from("checkins")
    .select(`
      *,
      profile:profiles(username, display_name, avatar_url),
      flavor:flavors(name, slug),
      brand:brands(name, slug)
    `)
    .eq("location_id", locationId)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching location checkins:", error.message);
    return [];
  }

  return data || [];
}

// ---------------------------------------------------------------------------
// Recent availability confirmations (for the home "Freshly confirmed" shelf)
// ---------------------------------------------------------------------------

export interface RecentConfirmation {
  id: string;
  last_confirmed_at: string;
  flavor: { id: string; name: string; slug: string } | null;
  location: { id: string; name: string; slug: string; city: string } | null;
}

export async function fetchRecentConfirmations(
  limit: number = 8
): Promise<RecentConfirmation[]> {
  const { data, error } = await supabase
    .from("availability")
    .select(
      `id, last_confirmed_at,
       flavor:flavors(id, name, slug),
       location:locations(id, name, slug, city)`
    )
    .eq("is_available", true)
    .order("last_confirmed_at", { ascending: false })
    .limit(limit * 2);

  if (error) {
    console.error("Error fetching recent confirmations:", error.message);
    return [];
  }

  // One entry per location so a single shop's big menu doesn't flood the shelf
  const seen = new Set<string>();
  const rows: RecentConfirmation[] = [];
  for (const r of (data || []) as unknown as RecentConfirmation[]) {
    if (!r.flavor || !r.location) continue;
    if (seen.has(r.location.id)) continue;
    seen.add(r.location.id);
    rows.push(r);
    if (rows.length >= limit) break;
  }
  return rows;
}
