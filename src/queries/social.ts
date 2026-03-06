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
// Feed — public check-ins from people you follow
// ---------------------------------------------------------------------------

export async function fetchFeed(
  userId: string,
  limit: number = 20,
  cursor?: string | null
): Promise<FeedItem[]> {
  // First get the list of users this person follows
  const { data: followData, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followError) {
    console.error("Error fetching follows:", followError);
    return [];
  }

  const followingIds = (followData || []).map((r) => r.following_id);
  // Include the user's own check-ins too
  followingIds.push(userId);

  if (followingIds.length === 0) return [];

  let query = supabase
    .from("checkins")
    .select(
      `
      id,
      user_id,
      location_id,
      flavor_id,
      brand_id,
      location_rating,
      flavor_rating,
      brand_rating,
      selection_rating,
      photo_url,
      notes,
      tags,
      is_public,
      created_at,
      profile:profiles!checkins_user_id_fkey(username, display_name, avatar_url),
      location:locations!checkins_location_id_fkey(name, slug, city, location_type),
      flavor:flavors!checkins_flavor_id_fkey(name, slug),
      brand:brands!checkins_brand_id_fkey(name, slug),
      checkin_likes(count),
      checkin_comments(count)
    `
    )
    .eq("is_public", true)
    .in("user_id", followingIds)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching feed:", error);
    return [];
  }

  return (data || []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    location_id: row.location_id,
    flavor_id: row.flavor_id,
    brand_id: row.brand_id,
    location_rating: row.location_rating,
    flavor_rating: row.flavor_rating,
    brand_rating: row.brand_rating,
    selection_rating: row.selection_rating,
    photo_url: row.photo_url,
    notes: row.notes,
    tags: row.tags,
    is_public: row.is_public,
    created_at: row.created_at,
    like_count: row.checkin_likes?.[0]?.count ?? 0,
    comment_count: row.checkin_comments?.[0]?.count ?? 0,
    profile_username: row.profile?.username ?? "",
    profile_display_name: row.profile?.display_name,
    profile_avatar_url: row.profile?.avatar_url,
    location_name: row.location?.name ?? "",
    location_slug: row.location?.slug ?? "",
    location_city: row.location?.city ?? "",
    location_type: row.location?.location_type ?? "",
    flavor_name: row.flavor?.name,
    flavor_slug: row.flavor?.slug,
    brand_name: row.brand?.name,
    brand_slug: row.brand?.slug,
  })) as FeedItem[];
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

  if (!data) return null;

  // Compute follower/following counts
  const [followerResult, followingResult] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", data.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", data.id),
  ]);

  return {
    ...data,
    follower_count: followerResult.count ?? 0,
    following_count: followingResult.count ?? 0,
  } as Profile;
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
