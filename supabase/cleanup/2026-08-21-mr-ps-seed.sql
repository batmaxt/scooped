-- Mr P's Homemade Ice Cream (1397 Nostrand Ave, Brooklyn 11226) — 2026-08-21
-- Source: https://mr-ps-homemade-ice-cream.com/flavors
-- 16 scoopable flavors. Cakes EXCLUDED (Strawberry/Carrot/Lemon/Yellow/
-- Chocolate cake/Red Velvet + vegan cakes). Site misspellings corrected:
-- CHOCLATE -> Chocolate, SORELL -> Sorrel, "Beat & Ginger" -> Beet & Ginger.
-- Run the whole file at once in the Supabase SQL Editor.

-- Step 1: create the 11 genuinely-new generic flavors (skips any that exist)
INSERT INTO flavors (name, slug, category, tags)
SELECT v.name, v.slug, v.category, v.tags::text[]
FROM (VALUES
  ('Avocado',        'avocado',        'fruit',   '{vegan}'),
  ('Charcoal',       'charcoal',       'novelty', '{vegan}'),
  ('Grape Nut',      'grape-nut',      'classic', '{}'),
  ('Mauby',          'mauby',          'novelty', '{}'),
  ('Peanut',         'peanut',         'nut',     '{}'),
  ('Sea Moss',       'sea-moss',       'novelty', '{vegan}'),
  ('Coconut Ginger', 'coconut-ginger', 'fruit',   '{vegan}'),
  ('Lemon Ginger',   'lemon-ginger',   'fruit',   '{vegan}'),
  ('Sorrel Ginger',  'sorrel-ginger',  'novelty', '{}'),
  ('Soursop',        'soursop',        'fruit',   '{}'),
  ('Beet & Ginger',  'beet-ginger',    'novelty', '{}')
) AS v(name, slug, category, tags)
WHERE NOT EXISTS (
  SELECT 1 FROM flavors f WHERE lower(f.name) = lower(v.name) AND f.brand_id IS NULL
);

-- Step 2: seed availability for all 16 flavors (5 existing + 11 new)
INSERT INTO availability (location_id, flavor_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.name = 'Mr P''s Homemade Ice Cream'
  AND f.brand_id IS NULL
  AND f.name IN (
    'Avocado','Charcoal','Coconut','Butter Pecan','Chocolate','Coffee',
    'Cookies and Cream','Grape Nut','Mauby','Peanut','Sea Moss',
    'Coconut Ginger','Lemon Ginger','Sorrel Ginger','Soursop','Beet & Ginger')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Result check: should show 16 rows for Mr P's
SELECT f.name, a.source
FROM availability a
JOIN flavors f ON f.id = a.flavor_id
JOIN locations l ON l.id = a.location_id
WHERE l.name = 'Mr P''s Homemade Ice Cream'
ORDER BY f.name;
