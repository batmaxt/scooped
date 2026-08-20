-- Flavor alerts are brand/location agnostic: an alert on "Lemon Custard"
-- fires when ANY flavor with that name appears at ANY location — including
-- shops the user has never heard of. That's the product.

CREATE OR REPLACE FUNCTION match_alerts_for_availability(
  p_location_id UUID,
  p_flavor_id UUID,
  p_brand_id UUID DEFAULT NULL,
  p_actor_id UUID DEFAULT NULL
) RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_flavor_name TEXT;
  v_count INTEGER := 0;
BEGIN
  SELECT name INTO v_flavor_name FROM flavors WHERE id = p_flavor_id;
  IF v_flavor_name IS NULL THEN
    RETURN 0;
  END IF;

  WITH matched AS (
    SELECT DISTINCT a.id AS alert_id, a.user_id
    FROM alerts a
    LEFT JOIN flavors af ON af.id = a.flavor_id
    JOIN profiles pr ON pr.id = a.user_id
    WHERE a.is_active
      AND pr.notify_flavor_alerts
      AND (
        -- Name-based flavor match: any brand, any shop
        (a.alert_type = 'flavor' AND lower(af.name) = lower(v_flavor_name))
        OR (a.alert_type = 'brand' AND p_brand_id IS NOT NULL AND a.brand_id = p_brand_id)
        OR (a.alert_type = 'location' AND a.location_id = p_location_id)
      )
      AND (p_actor_id IS NULL OR a.user_id <> p_actor_id)
  ),
  upd AS (
    UPDATE alerts SET last_triggered_at = NOW()
    WHERE id IN (SELECT alert_id FROM matched)
  ),
  ins AS (
    INSERT INTO notifications (user_id, type, actor_id, flavor_id, location_id)
    SELECT m.user_id, 'alert', p_actor_id, p_flavor_id, p_location_id
    FROM matched m
    ON CONFLICT DO NOTHING
    RETURNING 1
  )
  SELECT count(*) INTO v_count FROM ins;

  RETURN v_count;
END;
$$;

-- Sightings/scans now trigger alerts too — but only when the flavor is NEW
-- at that location (or returning), never on simple re-confirms.
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
  v_was_available BOOLEAN;
BEGIN
  SELECT is_available INTO v_was_available
  FROM availability
  WHERE location_id = p_location_id AND flavor_id = p_flavor_id;

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

  -- Fire alerts only when this flavor is newly (re)appearing here
  IF v_was_available IS DISTINCT FROM true THEN
    PERFORM match_alerts_for_availability(p_location_id, p_flavor_id, p_brand_id, p_user_id);
  END IF;

  RETURN result_id;
END;
$$;
