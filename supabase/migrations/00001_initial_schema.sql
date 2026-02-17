-- ============================================
-- SCOOPED - Initial Database Schema
-- ============================================

-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  favorite_flavor TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMPTZ,
  stripe_customer_id TEXT,
  total_checkins INTEGER DEFAULT 0,
  total_unique_flavors INTEGER DEFAULT 0,
  total_unique_locations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || LEFT(NEW.id::TEXT, 8)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- LOCATIONS
-- ============================================
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN (
    'scoop_shop', 'supermarket', 'farmers_market', 'restaurant', 'food_truck'
  )),
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL DEFAULT 'New York',
  state TEXT NOT NULL DEFAULT 'NY',
  zip TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  coordinates GEOGRAPHY(POINT, 4326) NOT NULL,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  hours JSONB,
  photo_url TEXT,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  total_checkins INTEGER DEFAULT 0,
  is_claimed BOOLEAN DEFAULT FALSE,
  claimed_by UUID REFERENCES profiles(id),
  yelp_id TEXT,
  google_place_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_coordinates ON locations USING GIST(coordinates);
CREATE INDEX idx_locations_type ON locations(location_type);
CREATE INDEX idx_locations_city ON locations(city);
CREATE INDEX idx_locations_slug ON locations(slug);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Locations are viewable by everyone" ON locations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert locations" ON locations FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ============================================
-- BRANDS
-- ============================================
CREATE TABLE brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  brand_type TEXT NOT NULL CHECK (brand_type IN (
    'national', 'regional', 'local_creamery', 'artisan'
  )),
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brands are viewable by everyone" ON brands FOR SELECT USING (true);

-- ============================================
-- FLAVORS
-- ============================================
CREATE TABLE flavors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  brand_id UUID REFERENCES brands(id),
  category TEXT CHECK (category IN (
    'classic', 'chocolate', 'fruit', 'nut', 'novelty',
    'dairy_free', 'sorbet', 'gelato', 'soft_serve', 'other'
  )),
  tags TEXT[],
  photo_url TEXT,
  avg_rating NUMERIC(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, brand_id)
);

CREATE INDEX idx_flavors_brand ON flavors(brand_id);
CREATE INDEX idx_flavors_category ON flavors(category);
CREATE INDEX idx_flavors_tags ON flavors USING GIN(tags);

ALTER TABLE flavors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Flavors are viewable by everyone" ON flavors FOR SELECT USING (true);

-- ============================================
-- AVAILABILITY (real-time flavor tracking)
-- ============================================
CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  flavor_id UUID NOT NULL REFERENCES flavors(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id),
  is_available BOOLEAN DEFAULT TRUE,
  price NUMERIC(5,2),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  last_confirmed_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_by UUID REFERENCES profiles(id),
  source TEXT CHECK (source IN ('business', 'user_report', 'seed')),
  UNIQUE(location_id, flavor_id)
);

CREATE INDEX idx_availability_location ON availability(location_id) WHERE is_available = TRUE;
CREATE INDEX idx_availability_flavor ON availability(flavor_id) WHERE is_available = TRUE;

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Availability is viewable by everyone" ON availability FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report availability" ON availability FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Claimed owners can update availability" ON availability FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM locations
    WHERE locations.id = availability.location_id
    AND locations.claimed_by = auth.uid()
  )
  OR source = 'user_report' AND confirmed_by = auth.uid()
);

-- ============================================
-- CHECK-INS (core user action)
-- ============================================
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id),
  flavor_id UUID REFERENCES flavors(id),
  brand_id UUID REFERENCES brands(id),
  location_rating SMALLINT CHECK (location_rating BETWEEN 1 AND 5),
  flavor_rating SMALLINT CHECK (flavor_rating BETWEEN 1 AND 5),
  brand_rating SMALLINT CHECK (brand_rating BETWEEN 1 AND 5),
  selection_rating SMALLINT CHECK (selection_rating BETWEEN 1 AND 5),
  photo_url TEXT,
  notes TEXT,
  tags TEXT[],
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_checkins_user ON checkins(user_id, created_at DESC);
CREATE INDEX idx_checkins_location ON checkins(location_id, created_at DESC);
CREATE INDEX idx_checkins_flavor ON checkins(flavor_id);
CREATE INDEX idx_checkins_created ON checkins(created_at DESC);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public checkins are viewable by everyone" ON checkins FOR SELECT USING (is_public = TRUE OR user_id = auth.uid());
CREATE POLICY "Users can create own checkins" ON checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own checkins" ON checkins FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FOLLOWS (social connections)
-- ============================================
CREATE TABLE follows (
  follower_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_following ON follows(following_id);

ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Follows are viewable by everyone" ON follows FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can unfollow" ON follows FOR DELETE USING (auth.uid() = follower_id);

-- ============================================
-- ALERTS (notification subscriptions)
-- ============================================
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('flavor', 'brand', 'location')),
  flavor_id UUID REFERENCES flavors(id),
  brand_id UUID REFERENCES brands(id),
  location_id UUID REFERENCES locations(id),
  radius_meters INTEGER DEFAULT 5000,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT alert_target CHECK (
    (alert_type = 'flavor' AND flavor_id IS NOT NULL) OR
    (alert_type = 'brand' AND brand_id IS NOT NULL) OR
    (alert_type = 'location' AND location_id IS NOT NULL)
  )
);

CREATE INDEX idx_alerts_user ON alerts(user_id) WHERE is_active = TRUE;
CREATE INDEX idx_alerts_flavor ON alerts(flavor_id) WHERE is_active = TRUE;
CREATE INDEX idx_alerts_brand ON alerts(brand_id) WHERE is_active = TRUE;

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own alerts" ON alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own alerts" ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON alerts FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- BADGES (achievement definitions)
-- ============================================
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT CHECK (category IN (
    'checkins', 'flavors', 'locations', 'social', 'special'
  )),
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);

-- ============================================
-- USER_BADGES (earned badges)
-- ============================================
CREATE TABLE user_badges (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User badges are viewable by everyone" ON user_badges FOR SELECT USING (true);

-- ============================================
-- BUSINESS CLAIMS
-- ============================================
CREATE TABLE business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  business_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  verification_method TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE business_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own claims" ON business_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can submit claims" ON business_claims FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PUSH SUBSCRIPTIONS
-- ============================================
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  subscription_json JSONB NOT NULL,
  device_type TEXT DEFAULT 'web',
  onesignal_player_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own push subscriptions" ON push_subscriptions FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- DATABASE FUNCTIONS
-- ============================================

-- Find nearby locations
CREATE OR REPLACE FUNCTION nearby_locations(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 5000,
  location_types TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT,
  location_type TEXT,
  address_line1 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  hours JSONB,
  photo_url TEXT,
  avg_rating NUMERIC,
  total_ratings INTEGER,
  total_checkins INTEGER,
  is_claimed BOOLEAN,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_meters DOUBLE PRECISION
)
LANGUAGE sql STABLE
AS $$
  SELECT
    l.id, l.name, l.slug, l.location_type, l.address_line1,
    l.city, l.state, l.zip, l.phone, l.website, l.instagram,
    l.hours, l.photo_url, l.avg_rating, l.total_ratings,
    l.total_checkins, l.is_claimed,
    ST_Y(l.coordinates::geometry) AS latitude,
    ST_X(l.coordinates::geometry) AS longitude,
    ST_Distance(l.coordinates, ST_MakePoint(lng, lat)::geography) AS distance_meters
  FROM locations l
  WHERE ST_DWithin(l.coordinates, ST_MakePoint(lng, lat)::geography, radius_meters)
    AND l.is_active = TRUE
    AND (location_types IS NULL OR l.location_type = ANY(location_types))
  ORDER BY distance_meters ASC;
$$;

-- Get social feed
CREATE OR REPLACE FUNCTION get_feed(
  requesting_user_id UUID,
  page_size INTEGER DEFAULT 20,
  cursor_timestamp TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  checkin_id UUID,
  user_id UUID,
  username TEXT,
  display_name TEXT,
  avatar_url TEXT,
  location_name TEXT,
  location_id UUID,
  location_slug TEXT,
  flavor_name TEXT,
  flavor_rating SMALLINT,
  location_rating SMALLINT,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.id, c.user_id, p.username, p.display_name, p.avatar_url,
    l.name, l.id, l.slug, f.name,
    c.flavor_rating, c.location_rating, c.photo_url, c.notes, c.created_at
  FROM checkins c
  JOIN profiles p ON c.user_id = p.id
  JOIN locations l ON c.location_id = l.id
  LEFT JOIN flavors f ON c.flavor_id = f.id
  WHERE c.user_id IN (
    SELECT following_id FROM follows WHERE follower_id = requesting_user_id
  )
    AND c.is_public = TRUE
    AND c.created_at < cursor_timestamp
  ORDER BY c.created_at DESC
  LIMIT page_size;
$$;

-- Check and award badges
CREATE OR REPLACE FUNCTION check_badges(target_user_id UUID)
RETURNS SETOF badges
LANGUAGE plpgsql
AS $$
DECLARE
  badge_record RECORD;
  stat_value INTEGER;
BEGIN
  FOR badge_record IN SELECT * FROM badges LOOP
    CONTINUE WHEN EXISTS (
      SELECT 1 FROM user_badges
      WHERE user_id = target_user_id AND badge_id = badge_record.id
    );

    CASE badge_record.requirement_type
      WHEN 'checkin_count' THEN
        SELECT total_checkins INTO stat_value FROM profiles WHERE id = target_user_id;
      WHEN 'unique_flavors' THEN
        SELECT total_unique_flavors INTO stat_value FROM profiles WHERE id = target_user_id;
      WHEN 'unique_locations' THEN
        SELECT total_unique_locations INTO stat_value FROM profiles WHERE id = target_user_id;
      ELSE
        stat_value := 0;
    END CASE;

    IF stat_value >= badge_record.requirement_value THEN
      INSERT INTO user_badges (user_id, badge_id) VALUES (target_user_id, badge_record.id);
      RETURN NEXT badge_record;
    END IF;
  END LOOP;
END;
$$;

-- Update profile stats after check-in
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles SET
    total_checkins = (SELECT COUNT(*) FROM checkins WHERE user_id = NEW.user_id),
    total_unique_flavors = (SELECT COUNT(DISTINCT flavor_id) FROM checkins WHERE user_id = NEW.user_id AND flavor_id IS NOT NULL),
    total_unique_locations = (SELECT COUNT(DISTINCT location_id) FROM checkins WHERE user_id = NEW.user_id),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_checkin_created
  AFTER INSERT ON checkins
  FOR EACH ROW EXECUTE FUNCTION update_profile_stats();

-- Update location stats after check-in
CREATE OR REPLACE FUNCTION update_location_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE locations SET
    total_checkins = (SELECT COUNT(*) FROM checkins WHERE location_id = NEW.location_id),
    total_ratings = (SELECT COUNT(*) FROM checkins WHERE location_id = NEW.location_id AND location_rating IS NOT NULL),
    avg_rating = COALESCE((SELECT AVG(location_rating)::NUMERIC(3,2) FROM checkins WHERE location_id = NEW.location_id AND location_rating IS NOT NULL), 0),
    updated_at = NOW()
  WHERE id = NEW.location_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_checkin_location_stats
  AFTER INSERT ON checkins
  FOR EACH ROW EXECUTE FUNCTION update_location_stats();

-- Update flavor stats after check-in
CREATE OR REPLACE FUNCTION update_flavor_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.flavor_id IS NOT NULL THEN
    UPDATE flavors SET
      total_ratings = (SELECT COUNT(*) FROM checkins WHERE flavor_id = NEW.flavor_id AND flavor_rating IS NOT NULL),
      avg_rating = COALESCE((SELECT AVG(flavor_rating)::NUMERIC(3,2) FROM checkins WHERE flavor_id = NEW.flavor_id AND flavor_rating IS NOT NULL), 0)
    WHERE id = NEW.flavor_id;
  END IF;

  IF NEW.brand_id IS NOT NULL THEN
    UPDATE brands SET
      total_ratings = (SELECT COUNT(*) FROM checkins WHERE brand_id = NEW.brand_id AND brand_rating IS NOT NULL),
      avg_rating = COALESCE((SELECT AVG(brand_rating)::NUMERIC(3,2) FROM checkins WHERE brand_id = NEW.brand_id AND brand_rating IS NOT NULL), 0)
    WHERE id = NEW.brand_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_checkin_flavor_stats
  AFTER INSERT ON checkins
  FOR EACH ROW EXECUTE FUNCTION update_flavor_stats();

-- ============================================
-- ENABLE REALTIME on key tables
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE availability;
