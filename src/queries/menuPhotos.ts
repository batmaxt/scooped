import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export interface MenuPhoto {
  id: string;
  location_id: string;
  uploaded_by: string;
  photo_url: string;
  extracted_flavors: string[];
  new_flavors_added: number;
  created_at: string;
  profile?: { username: string; display_name: string | null; avatar_url: string | null };
}

// Upload a menu photo to storage and return the public URL
export async function uploadMenuPhoto(
  userId: string,
  file: File
): Promise<string> {
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const filePath = `${userId}/${timestamp}-${random}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("menu-photos")
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage.from("menu-photos").getPublicUrl(filePath);
  return data.publicUrl;
}

// Save a menu photo record after scanning
export async function saveMenuPhotoRecord(
  locationId: string,
  uploadedBy: string,
  photoUrl: string,
  extractedFlavors: string[],
  newFlavorsAdded: number
): Promise<MenuPhoto> {
  const { data, error } = await supabase
    .from("menu_photos")
    .insert({
      location_id: locationId,
      uploaded_by: uploadedBy,
      photo_url: photoUrl,
      extracted_flavors: extractedFlavors,
      new_flavors_added: newFlavorsAdded,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as MenuPhoto;
}

// Get recent menu photos for a location
export async function fetchMenuPhotos(
  locationId: string,
  limit: number = 10
): Promise<MenuPhoto[]> {
  const { data, error } = await supabase
    .from("menu_photos")
    .select("*, profile:profiles(username, display_name, avatar_url)")
    .eq("location_id", locationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching menu photos:", error);
    return [];
  }

  return (data || []) as MenuPhoto[];
}
