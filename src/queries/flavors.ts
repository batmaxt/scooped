import { createClient } from "@/lib/supabase/client";
import type { Flavor, Brand } from "@/types/models";

const supabase = createClient();

export interface BrandFlavorGroup {
  brand: Brand | null;
  flavors: Flavor[];
}

export async function fetchAllFlavorsGroupedByBrand(): Promise<BrandFlavorGroup[]> {
  const { data, error } = await supabase
    .from("flavors")
    .select("*, brand:brands(id, name, slug, logo_url, brand_type, avg_rating, total_ratings)")
    .order("name");

  if (error) {
    console.error("Error fetching flavors:", error.message);
    return [];
  }

  const flavors = (data || []) as Flavor[];

  // Group by brand
  const groups = new Map<string, { brand: Brand | null; flavors: Flavor[] }>();

  for (const flavor of flavors) {
    const key = flavor.brand_id || "__generic__";
    if (!groups.has(key)) {
      groups.set(key, {
        brand: flavor.brand || null,
        flavors: [],
      });
    }
    groups.get(key)!.flavors.push(flavor);
  }

  // Sort groups: named brands alphabetically, generic last
  const sorted = Array.from(groups.values()).sort((a, b) => {
    if (!a.brand) return 1;
    if (!b.brand) return -1;
    return a.brand.name.localeCompare(b.brand.name);
  });

  return sorted;
}

export async function fetchAllBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching brands:", error.message);
    return [];
  }

  return (data || []) as Brand[];
}

export async function fetchFlavorBySlug(slug: string): Promise<Flavor | null> {
  const { data, error } = await supabase
    .from("flavors")
    .select("*, brand:brands(id, name, slug, logo_url, brand_type, avg_rating, total_ratings)")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching flavor:", error.message);
    return null;
  }

  return data as Flavor;
}

export interface NearbyFlavor {
  flavor: Flavor;
  nearestLocationName: string;
  nearestLocationSlug: string;
  distanceMeters: number;
  shopCount: number;
  source: string | null;
  lastConfirmedAt: string | null;
}

// The Flavors tab query: every flavor actually on a menu within the given
// radius, deduped by canonical name, tagged with its nearest shop.
export async function fetchNearbyFlavors(
  lat: number,
  lng: number,
  radiusMeters: number = 8047
): Promise<NearbyFlavor[]> {
  const { fetchNearbyLocations } = await import("./locations");
  const { flavorNameKey } = await import("@/lib/flavor-utils");

  const locations = await fetchNearbyLocations(lat, lng, radiusMeters, ["scoop_shop"]);
  if (locations.length === 0) return [];

  const locById = new Map(locations.map((l) => [l.id, l]));
  const ids = locations.map((l) => l.id);

  // Availability rows for those shops, chunked to keep URLs sane
  type Row = {
    location_id: string;
    source: string | null;
    last_confirmed_at: string | null;
    flavor: Flavor | null;
  };
  const rows: Row[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const { data, error } = await supabase
      .from("availability")
      .select("location_id, source, last_confirmed_at, flavor:flavors(*)")
      .in("location_id", ids.slice(i, i + 50))
      .eq("is_available", true)
      .limit(1000);
    if (error) {
      console.error("Error fetching nearby availability:", error.message);
      continue;
    }
    rows.push(...((data || []) as unknown as Row[]));
  }

  // Dedupe by canonical flavor name, keeping the nearest shop
  const best = new Map<string, NearbyFlavor>();
  const shopsPerKey = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!row.flavor) continue;
    const loc = locById.get(row.location_id);
    if (!loc) continue;
    const dist = loc.distance_meters ?? Number.MAX_SAFE_INTEGER;
    const key = flavorNameKey(row.flavor.name);
    const shops = shopsPerKey.get(key) ?? new Set<string>();
    shops.add(row.location_id);
    shopsPerKey.set(key, shops);
    const existing = best.get(key);
    if (!existing) {
      best.set(key, {
        flavor: row.flavor,
        nearestLocationName: loc.name,
        nearestLocationSlug: loc.slug,
        distanceMeters: dist,
        shopCount: 1,
        source: row.source,
        lastConfirmedAt: row.last_confirmed_at,
      });
    } else {
      existing.shopCount = shops.size;
      if (dist < existing.distanceMeters) {
        existing.flavor = row.flavor;
        existing.nearestLocationName = loc.name;
        existing.nearestLocationSlug = loc.slug;
        existing.distanceMeters = dist;
        existing.source = row.source;
        existing.lastConfirmedAt = row.last_confirmed_at;
      }
    }
  }

  return [...best.values()].sort((a, b) => a.distanceMeters - b.distanceMeters);
}
