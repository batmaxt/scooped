-- =============================================================================
-- Phase 3: Social Features Migration
-- Run via Supabase Management API (dashboard → SQL editor)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Add like_count and comment_count to checkins
-- ---------------------------------------------------------------------------
ALTER TABLE checkins
  ADD COLUMN IF NOT EXISTS like_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INTEGER NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- 2. Create checkin_likes table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checkin_likes (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, checkin_id)
);

-- RLS
ALTER TABLE checkin_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view likes"
  ON checkin_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can like"
  ON checkin_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike their own"
  ON checkin_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: increment like_count on insert
CREATE OR REPLACE FUNCTION increment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE checkins SET like_count = like_count + 1 WHERE id = NEW.checkin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_increment_like_count
  AFTER INSERT ON checkin_likes
  FOR EACH ROW EXECUTE FUNCTION increment_like_count();

-- Trigger: decrement like_count on delete
CREATE OR REPLACE FUNCTION decrement_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE checkins SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.checkin_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_decrement_like_count
  AFTER DELETE ON checkin_likes
  FOR EACH ROW EXECUTE FUNCTION decrement_like_count();

-- ---------------------------------------------------------------------------
-- 3. Create checkin_comments table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS checkin_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_id UUID NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) <= 500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_checkin_comments_checkin_id ON checkin_comments(checkin_id, created_at);

-- RLS
ALTER TABLE checkin_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON checkin_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can comment"
  ON checkin_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON checkin_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger: increment comment_count on insert
CREATE OR REPLACE FUNCTION increment_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE checkins SET comment_count = comment_count + 1 WHERE id = NEW.checkin_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_increment_comment_count
  AFTER INSERT ON checkin_comments
  FOR EACH ROW EXECUTE FUNCTION increment_comment_count();

-- Trigger: decrement comment_count on delete
CREATE OR REPLACE FUNCTION decrement_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE checkins SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.checkin_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_decrement_comment_count
  AFTER DELETE ON checkin_comments
  FOR EACH ROW EXECUTE FUNCTION decrement_comment_count();

-- ---------------------------------------------------------------------------
-- 4. Add follower/following counts to profiles
-- ---------------------------------------------------------------------------
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS follower_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS following_count INTEGER NOT NULL DEFAULT 0;

-- Trigger: update follower/following counts on follow
CREATE OR REPLACE FUNCTION update_follow_counts_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  UPDATE profiles SET follower_count = follower_count + 1 WHERE id = NEW.following_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_follow_counts_insert
  AFTER INSERT ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts_on_insert();

-- Trigger: update follower/following counts on unfollow
CREATE OR REPLACE FUNCTION update_follow_counts_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
  UPDATE profiles SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = OLD.following_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_follow_counts_delete
  AFTER DELETE ON follows
  FOR EACH ROW EXECUTE FUNCTION update_follow_counts_on_delete();

-- ---------------------------------------------------------------------------
-- 5. Update get_feed() to include like_count, comment_count, tags, profile
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_feed(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 20,
  p_cursor TIMESTAMPTZ DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  location_id UUID,
  flavor_id UUID,
  brand_id UUID,
  location_rating SMALLINT,
  flavor_rating SMALLINT,
  brand_rating SMALLINT,
  selection_rating SMALLINT,
  photo_url TEXT,
  notes TEXT,
  tags TEXT[],
  is_public BOOLEAN,
  like_count INTEGER,
  comment_count INTEGER,
  created_at TIMESTAMPTZ,
  -- profile fields
  profile_username TEXT,
  profile_display_name TEXT,
  profile_avatar_url TEXT,
  -- location fields
  location_name TEXT,
  location_slug TEXT,
  location_city TEXT,
  location_type TEXT,
  -- flavor fields
  flavor_name TEXT,
  flavor_slug TEXT,
  -- brand fields
  brand_name TEXT,
  brand_slug TEXT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.id,
    c.user_id,
    c.location_id,
    c.flavor_id,
    c.brand_id,
    c.location_rating,
    c.flavor_rating,
    c.brand_rating,
    c.selection_rating,
    c.photo_url,
    c.notes,
    c.tags,
    c.is_public,
    c.like_count,
    c.comment_count,
    c.created_at,
    p.username AS profile_username,
    p.display_name AS profile_display_name,
    p.avatar_url AS profile_avatar_url,
    l.name AS location_name,
    l.slug AS location_slug,
    l.city AS location_city,
    l.location_type::TEXT AS location_type,
    f.name AS flavor_name,
    f.slug AS flavor_slug,
    b.name AS brand_name,
    b.slug AS brand_slug
  FROM checkins c
  JOIN profiles p ON p.id = c.user_id
  JOIN locations l ON l.id = c.location_id
  LEFT JOIN flavors f ON f.id = c.flavor_id
  LEFT JOIN brands b ON b.id = c.brand_id
  WHERE c.is_public = true
    AND (
      c.user_id = p_user_id  -- own checkins
      OR c.user_id IN (SELECT following_id FROM follows WHERE follower_id = p_user_id)
    )
    AND (p_cursor IS NULL OR c.created_at < p_cursor)
  ORDER BY c.created_at DESC
  LIMIT p_limit;
$$;

-- ---------------------------------------------------------------------------
-- 6. Enhanced check_badges() — handles all badge requirement types
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_badges(p_user_id UUID)
RETURNS SETOF UUID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  badge_rec RECORD;
  met BOOLEAN;
  stat_val INTEGER;
BEGIN
  FOR badge_rec IN
    SELECT b.id, b.requirement_type, b.requirement_value
    FROM badges b
    WHERE NOT EXISTS (
      SELECT 1 FROM user_badges ub WHERE ub.badge_id = b.id AND ub.user_id = p_user_id
    )
  LOOP
    met := false;

    CASE badge_rec.requirement_type
      WHEN 'checkin_count' THEN
        SELECT total_checkins INTO stat_val FROM profiles WHERE id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'unique_flavors' THEN
        SELECT total_unique_flavors INTO stat_val FROM profiles WHERE id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'unique_locations' THEN
        SELECT total_unique_locations INTO stat_val FROM profiles WHERE id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'follow_count' THEN
        SELECT following_count INTO stat_val FROM profiles WHERE id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'follower_count' THEN
        SELECT follower_count INTO stat_val FROM profiles WHERE id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'photo_checkins' THEN
        SELECT COUNT(*) INTO stat_val FROM checkins WHERE user_id = p_user_id AND photo_url IS NOT NULL;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'noted_checkins' THEN
        SELECT COUNT(*) INTO stat_val FROM checkins WHERE user_id = p_user_id AND notes IS NOT NULL AND notes <> '';
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'like_given' THEN
        SELECT COUNT(*) INTO stat_val FROM checkin_likes WHERE user_id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      WHEN 'comment_given' THEN
        SELECT COUNT(*) INTO stat_val FROM checkin_comments WHERE user_id = p_user_id;
        met := (stat_val >= badge_rec.requirement_value);

      ELSE
        met := false;
    END CASE;

    IF met THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (p_user_id, badge_rec.id)
        ON CONFLICT DO NOTHING;
      RETURN NEXT badge_rec.id;
    END IF;
  END LOOP;

  RETURN;
END;
$$;

-- ---------------------------------------------------------------------------
-- 7. Grant access to the new tables
-- ---------------------------------------------------------------------------
GRANT SELECT ON checkin_likes TO anon, authenticated;
GRANT INSERT, DELETE ON checkin_likes TO authenticated;

GRANT SELECT ON checkin_comments TO anon, authenticated;
GRANT INSERT, DELETE ON checkin_comments TO authenticated;
