import { createClient } from "@/lib/supabase/client";
import type { Checkin, Flavor, Availability } from "@/types/models";

const supabase = createClient();

export interface CreateCheckinData {
  user_id: string;
  location_id: string;
  flavor_id?: string | null;
  brand_id?: string | null;
  location_rating?: number | null;
  flavor_rating?: number | null;
  brand_rating?: number | null;
  selection_rating?: number | null;
  notes?: string | null;
  tags?: string[] | null;
  photo_url?: string | null;
  is_public?: boolean;
}

export async function createCheckin(data: CreateCheckinData): Promise<Checkin> {
  const payload: Record<string, unknown> = {
    user_id: data.user_id,
    location_id: data.location_id,
    is_public: data.is_public ?? true,
  };

  // Only include optional fields if they have values
  if (data.flavor_id) payload.flavor_id = data.flavor_id;
  if (data.brand_id) payload.brand_id = data.brand_id;
  if (data.location_rating && data.location_rating > 0)
    payload.location_rating = data.location_rating;
  if (data.flavor_rating && data.flavor_rating > 0)
    payload.flavor_rating = data.flavor_rating;
  if (data.brand_rating && data.brand_rating > 0)
    payload.brand_rating = data.brand_rating;
  if (data.selection_rating && data.selection_rating > 0)
    payload.selection_rating = data.selection_rating;
  if (data.notes) payload.notes = data.notes;
  if (data.tags && data.tags.length > 0) payload.tags = data.tags;
  if (data.photo_url) payload.photo_url = data.photo_url;

  const { data: checkin, error } = await supabase
    .from("checkins")
    .insert(payload)
    .select(
      `
      *,
      location:locations(id, name, slug),
      flavor:flavors(id, name, slug),
      brand:brands(id, name, slug)
    `
    )
    .single();

  if (error) {
    console.error("Error creating checkin:", error);
    throw new Error(error.message);
  }

  return checkin as unknown as Checkin;
}

export async function fetchUserCheckins(
  userId: string,
  limit: number = 20
): Promise<Checkin[]> {
  const { data, error } = await supabase
    .from("checkins")
    .select(
      `
      *,
      location:locations(id, name, slug, city, state, address_line1, location_type),
      flavor:flavors(id, name, slug, photo_url),
      brand:brands(id, name, slug, logo_url)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching user checkins:", error);
    return [];
  }

  return (data || []) as unknown as Checkin[];
}

export async function fetchFlavors(searchQuery: string): Promise<Flavor[]> {
  const query = supabase
    .from("flavors")
    .select(
      `
      *,
      brand:brands(id, name, slug)
    `
    )
    .order("name");

  if (searchQuery.trim()) {
    const term = searchQuery.trim();
    // Search with both "and" and "&" variants so "ben and jerrys" matches "Ben & Jerry's"
    const withAnd = term.replace(/&/g, " and ");
    const withAmpersand = term.replace(/\band\b/gi, "&");
    if (withAnd !== withAmpersand) {
      query.or(`name.ilike.%${withAnd}%,name.ilike.%${withAmpersand}%`);
    } else {
      query.ilike("name", `%${term}%`);
    }
  }

  const { data, error } = await query.limit(30);

  if (error) {
    console.error("Error fetching flavors:", error);
    return [];
  }

  return (data || []) as unknown as Flavor[];
}

export async function fetchLocationFlavors(
  locationId: string
): Promise<Availability[]> {
  const { data, error } = await supabase
    .from("availability")
    .select(
      `
      *,
      flavor:flavors(*),
      brand:brands(*)
    `
    )
    .eq("location_id", locationId)
    .eq("is_available", true)
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching location flavors:", error);
    return [];
  }

  return (data || []) as unknown as Availability[];
}

export async function fetchTrendingFlavors(limit: number = 10): Promise<Flavor[]> {
  const { data, error } = await supabase
    .from("flavors")
    .select(`*, brand:brands(id, name, slug)`)
    .eq("is_active", true)
    .gt("total_ratings", 0)
    .order("total_ratings", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching trending flavors:", error);
    return [];
  }

  return (data || []) as unknown as Flavor[];
}

export async function fetchAllFlavorsForMatching(): Promise<Flavor[]> {
  const { data, error } = await supabase
    .from("flavors")
    .select(`*, brand:brands(id, name, slug)`)
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching all flavors for matching:", error);
    return [];
  }

  return (data || []) as unknown as Flavor[];
}
