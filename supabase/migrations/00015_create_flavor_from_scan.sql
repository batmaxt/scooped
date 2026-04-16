-- RPC to create a new flavor from a menu scan
-- Uses SECURITY DEFINER to bypass RLS on flavors table
CREATE OR REPLACE FUNCTION create_flavor_from_scan(
  p_name TEXT,
  p_slug TEXT,
  p_category TEXT DEFAULT 'ice_cream'
)
RETURNS TABLE (out_id UUID, out_name TEXT, out_slug TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO flavors (name, slug, category)
  VALUES (p_name, p_slug, p_category)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING flavors.id, flavors.name, flavors.slug;
END;
$$;
