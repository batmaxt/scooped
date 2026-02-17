import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/queries/notifications";
import { triggerAlertMatching } from "@/queries/alerts";
import type { BusinessClaim, Availability, Location } from "@/types/models";

const supabase = createClient();
const ADMIN_ID = "ed1906c8-2e71-4b6c-ac4a-8af4466edc1c";

// ---------------------------------------------------------------------------
// Claim Submission
// ---------------------------------------------------------------------------

export interface SubmitClaimData {
  location_id: string;
  user_id: string;
  business_name: string;
  contact_email: string;
  contact_phone?: string;
  verification_method?: string;
}

export async function submitClaim(data: SubmitClaimData): Promise<BusinessClaim> {
  const { data: claim, error } = await supabase
    .from("business_claims")
    .insert(data)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  // Notify admin of new claim (fire-and-forget)
  createNotification(data.user_id, ADMIN_ID, "claim").catch(() => {});

  return claim as unknown as BusinessClaim;
}

// ---------------------------------------------------------------------------
// Fetch user's claims
// ---------------------------------------------------------------------------

export async function fetchUserClaims(userId: string): Promise<BusinessClaim[]> {
  const { data, error } = await supabase
    .from("business_claims")
    .select(
      `
      *,
      location:locations(id, name, slug, address_line1, city, state)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user claims:", error);
    return [];
  }
  return (data || []) as unknown as BusinessClaim[];
}

// ---------------------------------------------------------------------------
// Fetch claimed location for current user
// ---------------------------------------------------------------------------

export async function fetchClaimedLocation(
  userId: string
): Promise<Location | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("claimed_by", userId)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Error fetching claimed location:", error);
    return null;
  }
  return data as unknown as Location | null;
}

// ---------------------------------------------------------------------------
// Admin: fetch all claims
// ---------------------------------------------------------------------------

export async function fetchAllClaims(
  statusFilter?: string
): Promise<BusinessClaim[]> {
  let query = supabase
    .from("business_claims")
    .select(
      `
      *,
      location:locations(id, name, slug, address_line1, city, state)
    `
    )
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching all claims:", error);
    return [];
  }
  return (data || []) as unknown as BusinessClaim[];
}

// ---------------------------------------------------------------------------
// Admin: approve a claim
// ---------------------------------------------------------------------------

export async function approveClaim(
  claimId: string,
  locationId: string,
  userId: string,
  adminNotes?: string
): Promise<void> {
  // 1. Update claim status
  const { error: claimError } = await supabase
    .from("business_claims")
    .update({
      status: "approved",
      admin_notes: adminNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", claimId);

  if (claimError) throw new Error(claimError.message);

  // 2. Update location to mark as claimed
  const { error: locError } = await supabase
    .from("locations")
    .update({
      is_claimed: true,
      claimed_by: userId,
    })
    .eq("id", locationId);

  if (locError) throw new Error(locError.message);
}

// ---------------------------------------------------------------------------
// Admin: reject a claim
// ---------------------------------------------------------------------------

export async function rejectClaim(
  claimId: string,
  adminNotes?: string
): Promise<void> {
  const { error } = await supabase
    .from("business_claims")
    .update({
      status: "rejected",
      admin_notes: adminNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", claimId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Business: fetch availability for managed location
// ---------------------------------------------------------------------------

export async function fetchBusinessAvailability(
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
    .order("added_at", { ascending: false });

  if (error) {
    console.error("Error fetching business availability:", error);
    return [];
  }
  return (data || []) as unknown as Availability[];
}

// ---------------------------------------------------------------------------
// Business: add flavor to menu
// ---------------------------------------------------------------------------

export async function addFlavorToMenu(
  locationId: string,
  flavorId: string,
  brandId: string | null,
  userId: string,
  price?: number
): Promise<Availability> {
  const { data, error } = await supabase
    .from("availability")
    .upsert(
      {
        location_id: locationId,
        flavor_id: flavorId,
        brand_id: brandId,
        is_available: true,
        price: price || null,
        source: "business",
        confirmed_by: userId,
        last_confirmed_at: new Date().toISOString(),
      },
      { onConflict: "location_id,flavor_id" }
    )
    .select(
      `
      *,
      flavor:flavors(*),
      brand:brands(*)
    `
    )
    .single();

  if (error) throw new Error(error.message);

  // Fire-and-forget: match alerts for this new flavor availability
  triggerAlertMatching(locationId, flavorId, brandId, userId).catch(() => {});

  return data as unknown as Availability;
}

// ---------------------------------------------------------------------------
// Business: toggle flavor availability
// ---------------------------------------------------------------------------

export async function toggleFlavorAvailability(
  availabilityId: string,
  isAvailable: boolean
): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .update({
      is_available: isAvailable,
      last_confirmed_at: new Date().toISOString(),
    })
    .eq("id", availabilityId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Business: update flavor price
// ---------------------------------------------------------------------------

export async function updateFlavorPrice(
  availabilityId: string,
  price: number | null
): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .update({ price })
    .eq("id", availabilityId);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Business: confirm all flavors (refresh last_confirmed_at)
// ---------------------------------------------------------------------------

export async function confirmAllFlavors(locationId: string): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .update({ last_confirmed_at: new Date().toISOString() })
    .eq("location_id", locationId)
    .eq("is_available", true);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Business: bulk toggle flavors (set multiple available/unavailable)
// ---------------------------------------------------------------------------

export async function bulkToggleFlavors(
  ids: string[],
  isAvailable: boolean
): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .update({
      is_available: isAvailable,
      last_confirmed_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) throw new Error(error.message);
}

// ---------------------------------------------------------------------------
// Business: remove flavor from menu
// ---------------------------------------------------------------------------

export async function removeFlavorFromMenu(
  availabilityId: string
): Promise<void> {
  const { error } = await supabase
    .from("availability")
    .delete()
    .eq("id", availabilityId);

  if (error) throw new Error(error.message);
}
