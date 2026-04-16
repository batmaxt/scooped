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
    console.error("Error fetching flavors:", error);
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
    console.error("Error fetching brands:", error);
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
    console.error("Error fetching flavor:", error);
    return null;
  }

  return data as Flavor;
}
