-- RPC function to search locations by flavor/brand name with PostGIS proximity
CREATE OR REPLACE FUNCTION search_locations_by_flavor(
  search_term TEXT,
  user_lat DOUBLE PRECISION,
  user_lng DOUBLE PRECISION,
  radius_meters DOUBLE PRECISION DEFAULT 80000
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
  distance_meters DOUBLE PRECISION,
  matching_flavor_name TEXT,
  matching_brand_name TEXT,
  last_confirmed_at TIMESTAMPTZ,
  availability_source TEXT
)
LANGUAGE sql STABLE
AS $$
  SELECT DISTINCT ON (l.id)
    l.id,
    l.name,
    l.slug,
    l.location_type::TEXT,
    l.address_line1,
    l.city,
    l.state,
    l.zip,
    l.phone,
    l.website,
    l.instagram,
    l.hours,
    l.photo_url,
    l.avg_rating,
    l.total_ratings,
    l.total_checkins,
    l.is_claimed,
    ST_Y(l.coordinates::geometry) AS latitude,
    ST_X(l.coordinates::geometry) AS longitude,
    ST_Distance(l.coordinates, ST_MakePoint(user_lng, user_lat)::geography) AS distance_meters,
    f.name AS matching_flavor_name,
    b.name AS matching_brand_name,
    a.last_confirmed_at,
    a.source::TEXT AS availability_source
  FROM locations l
  JOIN availability a ON a.location_id = l.id AND a.is_available = TRUE
  JOIN flavors f ON f.id = a.flavor_id
  LEFT JOIN brands b ON b.id = a.brand_id
  WHERE l.is_active = TRUE
    AND (
      f.name ILIKE '%' || search_term || '%'
      OR b.name ILIKE '%' || search_term || '%'
    )
    AND ST_DWithin(
      l.coordinates,
      ST_MakePoint(user_lng, user_lat)::geography,
      radius_meters
    )
  ORDER BY l.id, a.last_confirmed_at DESC NULLS LAST;
$$;
