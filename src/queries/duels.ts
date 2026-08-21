import { createClient } from "@/lib/supabase/client";
import { flavorNameKey } from "@/lib/flavor-utils";

const supabase = createClient();

export interface DuelOpponent {
  locationId: string;
  locationName: string;
  locationSlug: string;
}

// After checking in flavor F at shop B: has this user previously scooped the
// same (canonical) flavor at a DIFFERENT shop? Returns the most recent one.
export async function findDuelOpponent(
  userId: string,
  flavorName: string,
  currentLocationId: string
): Promise<DuelOpponent | null> {
  const { data, error } = await supabase
    .from("checkins")
    .select(
      `created_at,
       flavor:flavors(name),
       location:locations(id, name, slug)`
    )
    .eq("user_id", userId)
    .not("flavor_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error || !data) return null;

  const key = flavorNameKey(flavorName);
  for (const row of data as unknown as {
    flavor: { name: string } | null;
    location: { id: string; name: string; slug: string } | null;
  }[]) {
    if (!row.flavor || !row.location) continue;
    if (row.location.id === currentLocationId) continue;
    if (flavorNameKey(row.flavor.name) === key) {
      return {
        locationId: row.location.id,
        locationName: row.location.name,
        locationSlug: row.location.slug,
      };
    }
  }
  return null;
}

// Record the verdict. Upserts so a re-duel updates the earlier verdict, and
// removes the mirrored pairing if the user changed their mind.
export async function recordDuel(
  userId: string,
  flavorName: string,
  winnerLocationId: string,
  loserLocationId: string
): Promise<void> {
  const key = flavorNameKey(flavorName);

  // Clear an opposite-direction verdict for this pairing, if any
  await supabase
    .from("flavor_duels")
    .delete()
    .eq("user_id", userId)
    .eq("flavor_name_key", key)
    .eq("winner_location_id", loserLocationId)
    .eq("loser_location_id", winnerLocationId);

  const { error } = await supabase.from("flavor_duels").upsert(
    {
      user_id: userId,
      flavor_name: flavorName,
      flavor_name_key: key,
      winner_location_id: winnerLocationId,
      loser_location_id: loserLocationId,
    },
    { onConflict: "user_id,flavor_name_key,winner_location_id,loser_location_id" }
  );

  if (error) throw new Error(error.message);
}
