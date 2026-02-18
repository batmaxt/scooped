-- ============================================
-- FIX: handle_new_user() trigger
--
-- Problems:
--   1. Username fallback 'user_' || LEFT(id, 8) can collide
--   2. No error handling — any conflict kills the INSERT into auth.users
--   3. Google OAuth doesn't provide 'username' in metadata
--
-- Fix:
--   - Use full UUID (without dashes) for fallback username to avoid collisions
--   - Add EXCEPTION handler so a profile conflict never blocks auth signup
--   - Better metadata extraction for Google OAuth (name, picture)
-- ============================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_username TEXT;
  new_display_name TEXT;
  new_avatar TEXT;
BEGIN
  -- Extract display name: try various metadata fields Google/email may provide
  new_display_name := COALESCE(
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );

  -- Extract avatar: Google provides 'avatar_url' or 'picture'
  new_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    ''
  );

  -- Generate username: prefer explicit, then derive from name, then UUID fallback
  new_username := NEW.raw_user_meta_data->>'username';

  IF new_username IS NULL OR new_username = '' THEN
    -- Try to derive from display name
    IF new_display_name IS NOT NULL AND new_display_name != '' THEN
      new_username := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(new_display_name, '\s+', '.', 'g'), '[^a-z0-9.]', '', 'g'));
    END IF;
  END IF;

  -- If still empty or too short, use UUID-based fallback
  IF new_username IS NULL OR LENGTH(new_username) < 3 THEN
    new_username := 'user_' || REPLACE(NEW.id::TEXT, '-', '');
  END IF;

  -- Ensure uniqueness: if username taken, append random suffix
  IF EXISTS (SELECT 1 FROM profiles WHERE username = new_username) THEN
    new_username := new_username || '_' || LEFT(REPLACE(gen_random_uuid()::TEXT, '-', ''), 6);
  END IF;

  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (NEW.id, new_username, new_display_name, new_avatar);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never let a profile creation error block the auth signup
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
