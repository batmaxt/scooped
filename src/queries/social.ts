import { createClient } from "@/lib/supabase/client";
import { createNotification } from "@/queries/notifications";
import { checkImageSafety, ModerationError } from "@/lib/moderation/nsfwCheck";
import type { Profile, FeedItem } from "@/types/models";

const supabase = createClient();

// ---------------------------------------------------------------------------
// Follow / Unfollow
// ---------------------------------------------------------------------------

export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) {
    if (error.code === "23505") return; // already following
    throw new Error(error.message);
  }

  // Trigger notification (fire-and-forget)
  createNotification(followerId, followingId, "follow").catch(() => {});
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) throw new Error(error.message);
}

export async function checkIfFollowing(
  followerId: string,
  followingId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

// ---------------------------------------------------------------------------
// Follower / Following lists
// ---------------------------------------------------------------------------

export async function fetchFollowers(
  userId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("follower:profiles!follows_follower_id_fkey(*)")
    .eq("following_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching followers:", error);
    return [];
  }

  return (data || []).map((row: any) => row.follower) as Profile[];
}

export async function fetchFollowing(
  userId: string
): Promise<Profile[]> {
  const { data, error } = await supabase
    .from("follows")
    .select("following:profiles!follows_following_id_fkey(*)")
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching following:", error);
    return [];
  }

  return (data || []).map((row: any) => row.following) as Profile[];
}

// ---------------------------------------------------------------------------
// Feed (calls get_feed RPC)
// ---------------------------------------------------------------------------

export async function fetchFeed(
  userId: string,
  limit: number = 20,
  cursor?: string | null
): Promise<FeedItem[]> {
  const { data, error } = await supabase.rpc("get_feed", {
    p_user_id: userId,
    p_limit: limit,
    p_cursor: cursor || null,
  });

  if (error) {
    console.error("Error fetching feed:", error);
    return [];
  }

  return (data || []) as FeedItem[];
}

// ---------------------------------------------------------------------------
// User search
// ---------------------------------------------------------------------------

export async function searchUsers(query: string): Promise<Profile[]> {
  if (!query.trim() || query.trim().length < 2) return [];

  const q = `%${query.trim()}%`;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`username.ilike.${q},display_name.ilike.${q}`)
    .limit(20);

  if (error) {
    console.error("Error searching users:", error);
    return [];
  }

  return (data || []) as Profile[];
}

// ---------------------------------------------------------------------------
// Profile by username
// ---------------------------------------------------------------------------

export async function fetchProfileByUsername(
  username: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) {
    console.error("Error fetching profile by username:", error);
    return null;
  }

  return data as Profile;
}

// ---------------------------------------------------------------------------
// Update profile
// ---------------------------------------------------------------------------

export async function updateNotificationPrefs(
  userId: string,
  prefs: {
    notify_new_followers?: boolean;
    notify_likes_comments?: boolean;
    notify_flavor_alerts?: boolean;
  }
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update(prefs)
    .eq("id", userId);

  if (error) throw new Error(error.message);
}

export async function updateProfile(
  userId: string,
  updates: { display_name?: string; bio?: string; favorite_flavor?: string; avatar_url?: string }
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select("*")
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<string> {
  // NSFW moderation gate
  const moderationResult = await checkImageSafety(file);
  if (!moderationResult.safe) {
    throw new ModerationError(
      moderationResult.flaggedCategory!,
      moderationResult.confidence!
    );
  }

  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  // Append cache-buster so the browser doesn't show the old image
  return `${data.publicUrl}?t=${Date.now()}`;
}
