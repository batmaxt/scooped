-- Clean up duplicate and inactive locations
-- 1. Delete all 74 inactive locations (test data, exact dupes, near-dupes)
DELETE FROM locations WHERE is_active = false;

-- 2. Remove active duplicates: keep the one with the suffix (more descriptive name)
-- Exact same address duplicates - keep the one with longer/better name
DELETE FROM locations WHERE id IN (
  -- Bald Hill Farmstand (exact dupe - keep either, delete by picking one)
  (SELECT id FROM locations WHERE name = 'Bald Hill Farmstand' AND address_line1 = '2397 Route 25' ORDER BY created_at ASC LIMIT 1),
  -- Chinatown Ice Cream Factory (exact dupe)
  (SELECT id FROM locations WHERE name = 'Chinatown Ice Cream Factory' AND address_line1 = '65 Bayard St' ORDER BY created_at ASC LIMIT 1),
  -- Taiyaki NYC - Chinatown (exact dupe)
  (SELECT id FROM locations WHERE name = 'Taiyaki NYC - Chinatown' AND address_line1 = '119 Baxter St' ORDER BY created_at ASC LIMIT 1),
  -- Trader Joe's - Westbury (exact dupe)
  (SELECT id FROM locations WHERE name = 'Trader Joe''s - Westbury' AND address_line1 = '937 Old Country Rd' ORDER BY created_at ASC LIMIT 1),
  -- Whole Foods - Jericho (exact dupe)
  (SELECT id FROM locations WHERE name = 'Whole Foods - Jericho' AND address_line1 = '375 N Broadway' ORDER BY created_at ASC LIMIT 1)
);

-- 3. Remove near-duplicates at same address (keep the more descriptive name with suffix)
DELETE FROM locations WHERE id IN (
  -- Ample Hills - keep "Prospect Heights", delete "Vanderbilt"
  (SELECT id FROM locations WHERE name = 'Ample Hills - Vanderbilt' AND address_line1 = '623 Vanderbilt Ave' LIMIT 1),
  -- Eddie's Sweet Shop - keep with suffix
  (SELECT id FROM locations WHERE name = 'Eddie''s Sweet Shop' AND address_line1 = '105-29 Metropolitan Ave' LIMIT 1),
  -- Emack & Bolio's - keep with suffix "- UWS"
  (SELECT id FROM locations WHERE name = 'Emack & Bolio''s' AND address_line1 = '389 Amsterdam Ave' LIMIT 1),
  -- Fudge Company - keep with suffix "- Huntington"
  (SELECT id FROM locations WHERE name = 'Fudge Company' AND address_line1 = '67 Wall St' LIMIT 1),
  -- Magic Fountain - keep with suffix "- Mattituck"
  (SELECT id FROM locations WHERE name = 'Magic Fountain' AND address_line1 = '9825 Main Rd' LIMIT 1),
  -- Mikey Likes It - keep with suffix "- LES"
  (SELECT id FROM locations WHERE name = 'Mikey Likes It Ice Cream' AND address_line1 = '199 Avenue A' LIMIT 1),
  -- Sip'N Soda - keep with suffix "- Southampton"
  (SELECT id FROM locations WHERE name = 'Sip''N Soda' AND address_line1 = '40 Hampton Rd' LIMIT 1),
  -- Sugar Hill Creamery - keep with suffix "- Harlem"
  (SELECT id FROM locations WHERE name = 'Sugar Hill Creamery' AND address_line1 = '184 Lenox Ave' LIMIT 1),
  -- Wegmans - keep "Brooklyn Navy Yard" (shorter, cleaner), delete "Brooklyn Navy Yard Ice"
  (SELECT id FROM locations WHERE name = 'Wegmans - Brooklyn Navy Yard Ice' AND address_line1 = '21 Flushing Ave' LIMIT 1),
  -- Handel's - keep "Handel's Homemade - Roslyn" (with location), delete bare name
  (SELECT id FROM locations WHERE name = 'Handel''s Homemade Ice Cream' AND address_line1 = '1025 Northern Blvd' LIMIT 1),
  -- Snowflake - keep "Snowflake Ice Cream Shoppe" (proper name), delete with suffix
  (SELECT id FROM locations WHERE name = 'Snowflake Ice Cream - Riverhead' AND address_line1 = '76 Flanders Rd' LIMIT 1),
  -- Trader Joe's Court St - 3 entries for same store, keep "Cobble Hill"
  (SELECT id FROM locations WHERE name = 'Trader Joe''s - Atlantic Ave' AND address_line1 = '130 Court St' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Trader Joe''s - Brooklyn' AND address_line1 = '130 Court St' LIMIT 1)
);

-- 4. Fix Carvel - Harlem: two entries with different addresses, both may be real
-- 301 W 125th St and 301 W 145th St are different locations, so keep both (not dupes)
