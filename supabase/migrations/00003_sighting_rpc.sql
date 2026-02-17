-- RPC function for user-reported flavor sightings
-- Uses SECURITY DEFINER to bypass RLS so any user can report

CREATE OR REPLACE FUNCTION report_flavor_sighting(
  p_location_id UUID,
  p_flavor_id UUID,
  p_brand_id UUID DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, confirmed_by, last_confirmed_at)
  VALUES (p_location_id, p_flavor_id, p_brand_id, true, 'user_report', p_user_id, NOW())
  ON CONFLICT (location_id, flavor_id)
  DO UPDATE SET
    is_available = true,
    last_confirmed_at = NOW(),
    confirmed_by = COALESCE(p_user_id, availability.confirmed_by),
    source = CASE
      WHEN availability.source = 'business' THEN 'business'
      ELSE 'user_report'
    END
  RETURNING id INTO result_id;

  RETURN result_id;
END;
$$;
