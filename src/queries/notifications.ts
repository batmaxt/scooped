import { createClient } from "@/lib/supabase/client";
import type { AppNotification } from "@/types/models";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Fetch notifications
// ---------------------------------------------------------------------------

export async function fetchNotifications(
  userId: string,
  limit: number = 50
): Promise<AppNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      *,
      actor:profiles!notifications_actor_id_fkey(id, username, display_name, avatar_url),
      badge:badges(id, name, slug, icon_url),
      location:locations(id, name, slug),
      flavor:flavors(id, name, slug)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }

  return (data || []) as unknown as AppNotification[];
}

// ---------------------------------------------------------------------------
// Unread count
// ---------------------------------------------------------------------------

export async function fetchUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }

  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Mark as read
// ---------------------------------------------------------------------------

export async function markAsRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) console.error("Error marking notification as read:", error);
}

export async function markAllAsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) console.error("Error marking all notifications as read:", error);
}

// ---------------------------------------------------------------------------
// Create notification
// ---------------------------------------------------------------------------

/**
 * Creates an in-app notification. Skips if actor === target (don't notify yourself),
 * except for badge notifications. Also checks the target user's notification preferences.
 */
export async function createNotification(
  actorId: string,
  userId: string,
  type: "follow" | "like" | "comment" | "badge" | "claim" | "alert",
  checkinId?: string,
  badgeId?: string
) {
  // Don't notify yourself (except for badges and claims)
  if (actorId === userId && type !== "badge" && type !== "claim") return;

  // Check target user's notification preferences
  if (type === "follow" || type === "like" || type === "comment") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("notify_new_followers, notify_likes_comments")
      .eq("id", userId)
      .single();

    if (profile) {
      if (type === "follow" && !profile.notify_new_followers) return;
      if ((type === "like" || type === "comment") && !profile.notify_likes_comments) return;
    }
  }

  const { error } = await supabase.from("notifications").insert({
    user_id: userId,
    type,
    actor_id: actorId,
    checkin_id: checkinId || null,
    badge_id: badgeId || null,
  });

  if (error && error.code !== "23505") {
    console.error("Error creating notification:", error);
  }
}

// ---------------------------------------------------------------------------
// Delete notification
// ---------------------------------------------------------------------------

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);

  if (error) console.error("Error deleting notification:", error);
}
