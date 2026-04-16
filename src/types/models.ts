export type LocationType =
  | "scoop_shop"
  | "supermarket";

export interface Location {
  id: string;
  name: string;
  slug: string;
  location_type: LocationType;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  hours?: Record<string, { open: string; close: string }>;
  photo_url?: string;
  avg_rating: number;
  total_ratings: number;
  total_checkins: number;
  is_claimed: boolean;
  claimed_by?: string;
  latitude: number;
  longitude: number;
  distance_meters?: number;
  is_chain?: boolean;
  chain_name?: string | null;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  website?: string;
  brand_type: "national" | "regional" | "local_creamery" | "artisan";
  avg_rating: number;
  total_ratings: number;
}

export interface Flavor {
  id: string;
  name: string;
  slug: string;
  description?: string;
  brand_id?: string;
  brand?: Brand;
  category?: string;
  tags?: string[];
  photo_url?: string;
  avg_rating: number;
  total_ratings: number;
}

export interface Availability {
  id: string;
  location_id: string;
  flavor_id: string;
  brand_id?: string;
  is_available: boolean;
  price?: number;
  added_at: string;
  last_confirmed_at: string;
  source: "business" | "user_report" | "seed";
  flavor?: Flavor;
  brand?: Brand;
}

export interface Checkin {
  id: string;
  user_id: string;
  location_id: string;
  flavor_id?: string;
  brand_id?: string;
  location_rating?: number;
  flavor_rating?: number;
  brand_rating?: number;
  selection_rating?: number;
  photo_url?: string;
  notes?: string;
  tags?: string[];
  is_public: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  location?: Location;
  flavor?: Flavor;
  brand?: Brand;
  profile?: Profile;
}

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  favorite_flavor?: string;
  total_checkins: number;
  total_unique_flavors: number;
  total_unique_locations: number;
  follower_count: number;
  following_count: number;
  notify_new_followers: boolean;
  notify_likes_comments: boolean;
  notify_flavor_alerts: boolean;
  created_at: string;
}

export interface Badge {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url?: string;
  category: "checkins" | "flavors" | "locations" | "social" | "special";
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: "flavor" | "brand" | "location";
  flavor_id?: string;
  brand_id?: string;
  location_id?: string;
  radius_meters: number;
  is_active: boolean;
  last_triggered_at?: string;
  created_at: string;
  flavor?: Flavor;
  brand?: Brand;
  location?: Location;
}

export interface FeedItem {
  id: string;
  user_id: string;
  location_id: string;
  flavor_id?: string;
  brand_id?: string;
  location_rating?: number;
  flavor_rating?: number;
  brand_rating?: number;
  selection_rating?: number;
  photo_url?: string;
  notes?: string;
  tags?: string[];
  is_public: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  profile_username: string;
  profile_display_name?: string;
  profile_avatar_url?: string;
  location_name: string;
  location_slug: string;
  location_city: string;
  location_type: string;
  flavor_name?: string;
  flavor_slug?: string;
  brand_name?: string;
  brand_slug?: string;
}

export interface CheckinComment {
  id: string;
  user_id: string;
  checkin_id: string;
  content: string;
  created_at: string;
  profile?: Profile;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export type ListItemType = "location" | "flavor" | "brand";

export interface List {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListItem {
  id: string;
  list_id: string;
  item_type: ListItemType;
  location_id?: string;
  flavor_id?: string;
  brand_id?: string;
  note?: string;
  position: number;
  created_at: string;
  location?: Location;
  flavor?: Flavor;
  brand?: Brand;
}

export type ClaimStatus = "pending" | "approved" | "rejected";

export interface BusinessClaim {
  id: string;
  location_id: string;
  user_id: string;
  business_name: string;
  contact_email: string;
  contact_phone?: string;
  verification_method?: string;
  status: ClaimStatus;
  admin_notes?: string;
  created_at: string;
  reviewed_at?: string;
  location?: Location;
}

export type NotificationType = "follow" | "like" | "comment" | "badge" | "claim" | "alert";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  actor_id: string;
  checkin_id?: string;
  badge_id?: string;
  location_id?: string;
  flavor_id?: string;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
  badge?: Badge;
  location?: Location;
  flavor?: Flavor;
}
