-- Scope trim: keep ONLY Long Island + NYC (5 boros). 2026-08-21 (v2).
-- Pulls all NJ (500), all CT (220), and upstate/Hudson Valley NY (182) = 902 locations.
-- Keeps 469 locations whose zip prefix is Manhattan (100-102), Staten Island (103),
-- Bronx (104), Nassau (110, 115), Queens (111, 113, 114, 116), Brooklyn (112),
-- Suffolk (117-119).
-- availability, menu_photos, flavor_duels cascade automatically;
-- checkins, alerts, business_claims are cleaned up explicitly first.
-- No temp table: the dashboard SQL editor runs statements on separate
-- connections, so the scope condition is inlined in every DELETE.

DELETE FROM checkins WHERE location_id IN (
  SELECT id FROM locations
  WHERE state IN ('NJ','CT')
     OR (state = 'NY' AND substring(zip from 1 for 3) NOT IN
         ('100','101','102','103','104','110','111','112','113','114','115','116','117','118','119')));

DELETE FROM alerts WHERE location_id IN (
  SELECT id FROM locations
  WHERE state IN ('NJ','CT')
     OR (state = 'NY' AND substring(zip from 1 for 3) NOT IN
         ('100','101','102','103','104','110','111','112','113','114','115','116','117','118','119')));

DELETE FROM business_claims WHERE location_id IN (
  SELECT id FROM locations
  WHERE state IN ('NJ','CT')
     OR (state = 'NY' AND substring(zip from 1 for 3) NOT IN
         ('100','101','102','103','104','110','111','112','113','114','115','116','117','118','119')));

DELETE FROM locations
WHERE state IN ('NJ','CT')
   OR (state = 'NY' AND substring(zip from 1 for 3) NOT IN
       ('100','101','102','103','104','110','111','112','113','114','115','116','117','118','119'));

-- Result check: should show one row -- NY | 469
SELECT state, count(*) FROM locations GROUP BY state;
