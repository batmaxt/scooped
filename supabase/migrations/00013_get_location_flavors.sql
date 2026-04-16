-- RPC to get all available flavors at a location with brand info and ratings
CREATE OR REPLACE FUNCTION get_location_flavors(p_location_id UUID)
RETURNS TABLE (
  availability_id UUID,
  flavor_id UUID,
  flavor_name TEXT,
  flavor_slug TEXT,
  brand_id UUID,
  brand_name TEXT,
  is_available BOOLEAN,
  price NUMERIC,
  source TEXT,
  last_confirmed_at TIMESTAMPTZ,
  confirmed_by UUID,
  location_flavor_avg_rating NUMERIC
)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    a.id AS availability_id,
    f.id AS flavor_id,
    f.name AS flavor_name,
    f.slug AS flavor_slug,
    b.id AS brand_id,
    b.name AS brand_name,
    a.is_available,
    a.price,
    a.source,
    a.last_confirmed_at,
    a.confirmed_by,
    COALESCE(
      (SELECT AVG(c.flavor_rating)::NUMERIC(3,2)
       FROM checkins c
       WHERE c.location_id = p_location_id
         AND c.flavor_id = f.id
         AND c.flavor_rating IS NOT NULL
         AND c.flavor_rating > 0),
      0
    ) AS location_flavor_avg_rating
  FROM availability a
  JOIN flavors f ON f.id = a.flavor_id
  LEFT JOIN brands b ON b.id = a.brand_id
  WHERE a.location_id = p_location_id
    AND a.is_available = true
  ORDER BY a.last_confirmed_at DESC NULLS LAST, f.name;
$$;
