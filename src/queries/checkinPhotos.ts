import { createClient } from "@/lib/supabase/client";
import { checkImageSafety, ModerationError } from "@/lib/moderation/nsfwCheck";

const supabase = createClient();

/**
 * Upload a check-in photo to Supabase Storage.
 * Returns the public URL of the uploaded image.
 */
export async function uploadCheckinPhoto(
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
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const filePath = `${userId}/${timestamp}-${random}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("checkin-photos")
    .upload(filePath, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data } = supabase.storage
    .from("checkin-photos")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
