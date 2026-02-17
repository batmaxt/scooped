import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/queries/notifications";
import type { Badge, UserBadge } from "@/types/models";

const supabase = createClient();

export async function fetchAllBadges(): Promise<Badge[]> {
  const { data, error } = await supabase
    .from("badges")
    .select("*")
    .order("category")
    .order("requirement_value");

  if (error) {
    console.error("Error fetching badges:", error);
    return [];
  }

  return (data || []) as Badge[];
}

export async function fetchUserBadges(userId: string): Promise<UserBadge[]> {
  const { data, error } = await supabase
    .from("user_badges")
    .select(
      `
      *,
      badge:badges(*)
    `
    )
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  if (error) {
    console.error("Error fetching user badges:", error);
    return [];
  }

  return (data || []) as unknown as UserBadge[];
}

/**
 * Calls the check_badges RPC function which checks all unearned badges
 * and awards any that the user now qualifies for.
 * Returns an array of newly awarded badge IDs.
 */
export async function checkAndAwardBadges(
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase.rpc("check_badges", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error checking badges:", error);
    return [];
  }

  const badgeIds = (data || []) as string[];

  // Create a notification for each newly earned badge (fire-and-forget)
  for (const badgeId of badgeIds) {
    createNotification(userId, userId, "badge", undefined, badgeId).catch(() => {});
  }

  return badgeIds;
}
