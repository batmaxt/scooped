import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/queries/notifications";
import type { CheckinComment } from "@/types/models";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Likes
// ---------------------------------------------------------------------------

export async function likeCheckin(userId: string, checkinId: string) {
  const { error } = await supabase
    .from("checkin_likes")
    .insert({ user_id: userId, checkin_id: checkinId });

  if (error && error.code !== "23505") {
    throw new Error(error.message);
  }

  // Notify the checkin owner (fire-and-forget)
  supabase
    .from("checkins")
    .select("user_id")
    .eq("id", checkinId)
    .single()
    .then(({ data }) => {
      if (data?.user_id) {
        createNotification(userId, data.user_id, "like", checkinId).catch(() => {});
      }
    });
}

export async function unlikeCheckin(userId: string, checkinId: string) {
  const { error } = await supabase
    .from("checkin_likes")
    .delete()
    .eq("user_id", userId)
    .eq("checkin_id", checkinId);

  if (error) throw new Error(error.message);
}

/**
 * Check which checkin IDs from a list the user has liked.
 * Returns a Set of checkin IDs that are liked.
 */
export async function fetchLikedCheckinIds(
  userId: string,
  checkinIds: string[]
): Promise<Set<string>> {
  if (checkinIds.length === 0) return new Set();

  const { data, error } = await supabase
    .from("checkin_likes")
    .select("checkin_id")
    .eq("user_id", userId)
    .in("checkin_id", checkinIds);

  if (error) {
    console.error("Error fetching liked checkins:", error.message);
    return new Set();
  }

  return new Set((data || []).map((row) => row.checkin_id));
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function fetchComments(
  checkinId: string
): Promise<CheckinComment[]> {
  const { data, error } = await supabase
    .from("checkin_comments")
    .select(
      `
      *,
      profile:profiles!checkin_comments_user_id_profiles_fkey(id, username, display_name, avatar_url)
    `
    )
    .eq("checkin_id", checkinId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }

  return (data || []) as unknown as CheckinComment[];
}

export async function addComment(
  userId: string,
  checkinId: string,
  content: string
): Promise<CheckinComment> {
  const { data, error } = await supabase
    .from("checkin_comments")
    .insert({ user_id: userId, checkin_id: checkinId, content })
    .select(
      `
      *,
      profile:profiles!checkin_comments_user_id_profiles_fkey(id, username, display_name, avatar_url)
    `
    )
    .single();

  if (error) throw new Error(error.message);

  // Notify the checkin owner (fire-and-forget)
  supabase
    .from("checkins")
    .select("user_id")
    .eq("id", checkinId)
    .single()
    .then(({ data: checkin }) => {
      if (checkin?.user_id) {
        createNotification(userId, checkin.user_id, "comment", checkinId).catch(() => {});
      }
    });

  return data as unknown as CheckinComment;
}

export async function deleteComment(commentId: string) {
  const { error } = await supabase
    .from("checkin_comments")
    .delete()
    .eq("id", commentId);

  if (error) throw new Error(error.message);
}
