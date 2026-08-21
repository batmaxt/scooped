-- Chain-core availability seed — 2026-08-20
-- Seeds every active chain location with its brand's always-carried staples.
-- source='seed' → shows as "On the menu" in the app; user confirmations
-- upgrade records to time-based freshness. Never fires alert pushes.

-- Carvel: 9 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Carvel'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'carvel')
  AND f.name IN ('Vanilla Soft Serve','Chocolate Soft Serve','Vanilla & Chocolate Twist Soft Serve','Vanilla','Chocolate','Strawberry','Mint Chocolate Chip','Cookies & Cream','Chocolate Chip Cookie Dough')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Cold Stone Creamery: 10 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Cold Stone Creamery'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'cold-stone-creamery')
  AND f.name IN ('Sweet Cream','French Vanilla','Chocolate','Cake Batter','Strawberry','Coffee','Mint','Cookie Dough','Cheesecake','Butter Pecan')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Baskin-Robbins: 12 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Baskin-Robbins'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'baskin-robbins')
  AND f.name IN ('Vanilla','Chocolate','Mint Chocolate Chip','Pralines ''n Cream','Jamoca Almond Fudge','Chocolate Chip Cookie Dough','Very Berry Strawberry','Oreo Cookies ''n Cream','Rainbow Sherbet','Rocky Road','World Class Chocolate','Old Fashioned Butter Pecan')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Dairy Queen: 2 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Dairy Queen'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'dairy-queen')
  AND f.name IN ('Vanilla Soft Serve','Chocolate Soft Serve')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Van Leeuwen: 11 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Van Leeuwen'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'van-leeuwen')
  AND f.name IN ('Vanilla Bean','Honeycomb','Salted Caramel','Sicilian Pistachio','Cookies & Cream','Mint Chip','Earl Grey Tea','Strawberry','Cookie Dough','Vegan Mint Chip','Vegan Chocolate Fudge Brownie')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Ben & Jerry's: 8 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Ben & Jerry''s'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'ben-and-jerrys')
  AND f.name IN ('Cherry Garcia','Half Baked','Phish Food','Chocolate Fudge Brownie','Chocolate Chip Cookie Dough','Americone Dream','Chunky Monkey','Tonight Dough')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Häagen-Dazs: 10 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Häagen-Dazs'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'haagen-dazs')
  AND f.name IN ('Vanilla','Chocolate','Strawberry','Coffee','Cookies & Cream','Dulce de Leche','Butter Pecan','Mint Chip','Rocky Road','Pistachio')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Mister Softee: 4 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Mister Softee'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'mister-softee')
  AND f.name IN ('Vanilla','Chocolate','Vanilla Chocolate Twist','Strawberry')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Insomnia Cookies: 10 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Insomnia Cookies'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'insomnia-cookies')
  AND f.name IN ('Chocolate Ice Cream','Cookie Dough Ice Cream','Cookies N Dream','Dreamweaver','Mint','Minterstellar','Moon Tracks','Salted Caramel','Strawberry','Vanilla Ice Cream')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Ample Hills: 5 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Ample Hills'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'ample-hills')
  AND f.name IN ('Ooey Gooey Butter Cake','Salted Crack Caramel','The Munchies','PB Wins the Cup','Snap Mallow Pop')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Milk Bar: 3 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Milk Bar'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'milk-bar')
  AND f.name IN ('Cereal Milk Soft Serve','Birthday Cake','Milk Bar Pie')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Hoffman's Ice Cream: 10 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Hoffman''s Ice Cream'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'hoffmans-ice-cream')
  AND f.name IN ('Vanilla','Chocolate','Chocolate Chip','Strawberry','Mint Chocolate Chip','Cookie Dough','Salted Caramel Pretzel','Black Raspberry','Peanut Butter Pandemonium','Cake Batter')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Friendly's: 8 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Friendly''s'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'friendlys')
  AND f.name IN ('Vanilla','Chocolate','Strawberry','Cookies N Cream','Mint Chocolate Chip','Butter Pecan','Black Raspberry','Forbidden Chocolate')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Arethusa Farm Dairy: 12 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Arethusa Farm Dairy'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'arethusa-farm-dairy')
  AND f.name IN ('Old Fashioned Vanilla','Chocolate','Strawberry','Coffee','Mint Chip','Salted Caramel','Butter Pecan','Maple Walnut','Pistachio','Sweet Cream Chocolate Chip','Lemon Custard','Raspberry')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Jeni's Splendid: 8 staples
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, true, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_active = true
  AND l.location_type = 'scoop_shop'
  AND l.chain_name = 'Jeni''s Splendid'
  AND f.brand_id = (SELECT id FROM brands WHERE slug = 'jenis-splendid-ice-creams')
  AND f.name IN ('Brambleberry Crisp','Salty Caramel','Brown Butter Almond Brittle','Darkest Chocolate in the World','Honey Vanilla Bean','Gooey Butter Cake','Wildberry Lavender','Green Mint Chip')
ON CONFLICT (location_id, flavor_id) DO NOTHING;
