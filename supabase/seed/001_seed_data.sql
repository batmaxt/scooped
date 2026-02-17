-- ============================================
-- SCOOPED - Seed Data: Brands, Flavors, Locations, Badges
-- NYC + Long Island
-- ============================================

-- ============================================
-- BRANDS
-- ============================================
INSERT INTO brands (name, slug, description, brand_type, website) VALUES
-- National brands
('Ben & Jerry''s', 'ben-and-jerrys', 'Vermont-based ice cream company known for creative flavors', 'national', 'https://www.benjerry.com'),
('Häagen-Dazs', 'haagen-dazs', 'Premium ice cream brand founded in Brooklyn', 'national', 'https://www.haagendazs.us'),
('Baskin-Robbins', 'baskin-robbins', '31 flavors and counting', 'national', 'https://www.baskinrobbins.com'),
('Talenti', 'talenti', 'Gelato and sorbetto made with fine ingredients', 'national', 'https://www.talentigelato.com'),
('Blue Bunny', 'blue-bunny', 'Fun and affordable ice cream', 'national', 'https://www.bluebunny.com'),
('Breyers', 'breyers', 'Classic American ice cream since 1866', 'national', 'https://www.breyers.com'),
('Turkey Hill', 'turkey-hill', 'Pennsylvania-based ice cream and drinks', 'national', 'https://www.turkeyhill.com'),

-- NYC / Regional brands
('Van Leeuwen', 'van-leeuwen', 'Artisan ice cream made with clean ingredients', 'artisan', 'https://vanleeuwenicecream.com'),
('Ample Hills Creamery', 'ample-hills', 'Brooklyn-born craft ice cream', 'local_creamery', 'https://www.amplehills.com'),
('Big Gay Ice Cream', 'big-gay-ice-cream', 'Soft serve and inventive sundaes', 'local_creamery', 'https://www.biggayicecream.com'),
('OddFellows Ice Cream Co.', 'oddfellows', 'Small-batch creative ice cream', 'artisan', 'https://www.oddfellowsnyc.com'),
('Morgenstern''s Finest', 'morgensterns', 'Artisanal ice cream with unexpected flavors', 'artisan', 'https://morgensternsnyc.com'),
('Davey''s Ice Cream', 'daveys', 'Brooklyn-made ice cream with bold flavors', 'local_creamery', 'https://www.daveysicecream.com'),
('Soft Swerve', 'soft-swerve', 'Asian-inspired soft serve in NYC', 'local_creamery', NULL),
('Salt & Straw', 'salt-and-straw', 'Artisan ice cream with adventurous flavors', 'artisan', 'https://saltandstraw.com'),
('Jeni''s Splendid Ice Creams', 'jenis', 'Creative flavors made with grass-fed milk', 'artisan', 'https://jenis.com'),
('Mister Softee', 'mister-softee', 'Classic NYC soft serve truck', 'regional', NULL),
('Taiyaki NYC', 'taiyaki-nyc', 'Japanese fish-shaped waffle cone ice cream', 'local_creamery', 'https://taiyakinyc.com'),
('Caffè Panna', 'caffe-panna', 'Italian-inspired gelato in Gramercy', 'artisan', NULL),
('il laboratorio del gelato', 'il-laboratorio', 'Over 200 flavors of gelato and sorbet', 'artisan', 'https://www.laboratoriodelgelato.com'),

-- Long Island brands
('Ralph''s Italian Ices', 'ralphs-italian-ices', 'Famous Long Island Italian ices since 1928', 'regional', NULL),
('Carvel', 'carvel', 'Soft serve and ice cream cakes since 1929', 'regional', 'https://www.carvel.com');

-- ============================================
-- FLAVORS (brand-specific + shop-original)
-- ============================================

-- Van Leeuwen flavors
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
('Honeycomb', 'van-leeuwen-honeycomb', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'classic', ARRAY['signature']),
('Salted Caramel', 'van-leeuwen-salted-caramel', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'classic', ARRAY['signature', 'popular']),
('Planet Earth', 'van-leeuwen-planet-earth', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'novelty', ARRAY['vegan', 'seasonal']),
('Pistachio', 'van-leeuwen-pistachio', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'nut', ARRAY['popular']),
('Vegan Mint Chip', 'van-leeuwen-vegan-mint-chip', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'dairy_free', ARRAY['vegan']),
('Earl Grey Tea', 'van-leeuwen-earl-grey', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'classic', ARRAY['unique']),
('Sicilian Pistachio', 'van-leeuwen-sicilian-pistachio', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'nut', ARRAY['premium']),
('Oat Milk Brown Sugar Chunk', 'van-leeuwen-oat-milk-brown-sugar', (SELECT id FROM brands WHERE slug = 'van-leeuwen'), 'dairy_free', ARRAY['vegan', 'popular']),

-- Ample Hills flavors
('Ooey Gooey Butter Cake', 'ample-hills-ooey-gooey', (SELECT id FROM brands WHERE slug = 'ample-hills'), 'classic', ARRAY['signature', 'popular']),
('The Munchies', 'ample-hills-munchies', (SELECT id FROM brands WHERE slug = 'ample-hills'), 'novelty', ARRAY['signature']),
('Salted Crack Caramel', 'ample-hills-salted-crack-caramel', (SELECT id FROM brands WHERE slug = 'ample-hills'), 'classic', ARRAY['signature', 'popular']),
('PB Wins the Cup', 'ample-hills-pb-wins-the-cup', (SELECT id FROM brands WHERE slug = 'ample-hills'), 'nut', ARRAY['popular']),
('Mexican Hot Chocolate', 'ample-hills-mexican-hot-choc', (SELECT id FROM brands WHERE slug = 'ample-hills'), 'chocolate', ARRAY['seasonal']),

-- OddFellows flavors
('Miso Cherry', 'oddfellows-miso-cherry', (SELECT id FROM brands WHERE slug = 'oddfellows'), 'fruit', ARRAY['unique', 'signature']),
('Chorizo Caramel Swirl', 'oddfellows-chorizo-caramel', (SELECT id FROM brands WHERE slug = 'oddfellows'), 'novelty', ARRAY['unique', 'adventurous']),
('Cornbread', 'oddfellows-cornbread', (SELECT id FROM brands WHERE slug = 'oddfellows'), 'novelty', ARRAY['unique']),
('Thai Iced Tea', 'oddfellows-thai-iced-tea', (SELECT id FROM brands WHERE slug = 'oddfellows'), 'classic', ARRAY['unique']),

-- Morgenstern's flavors
('Burnt Honey Vanilla', 'morgensterns-burnt-honey-vanilla', (SELECT id FROM brands WHERE slug = 'morgensterns'), 'classic', ARRAY['signature']),
('Black Coconut Ash', 'morgensterns-black-coconut-ash', (SELECT id FROM brands WHERE slug = 'morgensterns'), 'novelty', ARRAY['unique', 'instagram']),
('Salt & Pepper Pineapple', 'morgensterns-salt-pepper-pineapple', (SELECT id FROM brands WHERE slug = 'morgensterns'), 'fruit', ARRAY['unique']),

-- Big Gay Ice Cream flavors
('Salty Pimp', 'big-gay-salty-pimp', (SELECT id FROM brands WHERE slug = 'big-gay-ice-cream'), 'classic', ARRAY['signature', 'popular']),
('American Globs', 'big-gay-american-globs', (SELECT id FROM brands WHERE slug = 'big-gay-ice-cream'), 'classic', ARRAY['signature']),
('Dorothy', 'big-gay-dorothy', (SELECT id FROM brands WHERE slug = 'big-gay-ice-cream'), 'soft_serve', ARRAY['signature']),

-- Salt & Straw flavors
('Sea Salt with Caramel Ribbons', 'salt-straw-sea-salt-caramel', (SELECT id FROM brands WHERE slug = 'salt-and-straw'), 'classic', ARRAY['signature', 'popular']),
('Honey Lavender', 'salt-straw-honey-lavender', (SELECT id FROM brands WHERE slug = 'salt-and-straw'), 'classic', ARRAY['popular']),
('Strawberry Honey Balsamic', 'salt-straw-strawberry-balsamic', (SELECT id FROM brands WHERE slug = 'salt-and-straw'), 'fruit', ARRAY['unique']),
('Double Fold Vanilla', 'salt-straw-double-fold-vanilla', (SELECT id FROM brands WHERE slug = 'salt-and-straw'), 'classic', ARRAY['popular']),

-- Jeni's flavors
('Salty Caramel', 'jenis-salty-caramel', (SELECT id FROM brands WHERE slug = 'jenis'), 'classic', ARRAY['signature', 'popular']),
('Brambleberry Crisp', 'jenis-brambleberry-crisp', (SELECT id FROM brands WHERE slug = 'jenis'), 'fruit', ARRAY['popular']),
('Brown Butter Almond Brittle', 'jenis-brown-butter-almond', (SELECT id FROM brands WHERE slug = 'jenis'), 'nut', ARRAY['signature']),
('Gooey Butter Cake', 'jenis-gooey-butter-cake', (SELECT id FROM brands WHERE slug = 'jenis'), 'classic', ARRAY['popular']),

-- Ben & Jerry's flavors
('Half Baked', 'bj-half-baked', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'chocolate', ARRAY['popular', 'classic']),
('Cherry Garcia', 'bj-cherry-garcia', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'fruit', ARRAY['classic']),
('Phish Food', 'bj-phish-food', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'chocolate', ARRAY['popular']),
('Tonight Dough', 'bj-tonight-dough', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'chocolate', ARRAY['popular']),
('Americone Dream', 'bj-americone-dream', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'classic', ARRAY['popular']),
('Strawberry Cheesecake', 'bj-strawberry-cheesecake', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'fruit', ARRAY['classic']),
('Netflix & Chilll''d', 'bj-netflix-chilld', (SELECT id FROM brands WHERE slug = 'ben-and-jerrys'), 'novelty', ARRAY['limited-edition']),

-- Häagen-Dazs flavors
('Vanilla', 'hd-vanilla', (SELECT id FROM brands WHERE slug = 'haagen-dazs'), 'classic', ARRAY['classic']),
('Belgian Chocolate', 'hd-belgian-chocolate', (SELECT id FROM brands WHERE slug = 'haagen-dazs'), 'chocolate', ARRAY['classic']),
('Strawberry', 'hd-strawberry', (SELECT id FROM brands WHERE slug = 'haagen-dazs'), 'fruit', ARRAY['classic']),
('Coffee', 'hd-coffee', (SELECT id FROM brands WHERE slug = 'haagen-dazs'), 'classic', ARRAY['popular']),
('Dulce de Leche', 'hd-dulce-de-leche', (SELECT id FROM brands WHERE slug = 'haagen-dazs'), 'classic', ARRAY['popular']),

-- Talenti flavors
('Sea Salt Caramel', 'talenti-sea-salt-caramel', (SELECT id FROM brands WHERE slug = 'talenti'), 'gelato', ARRAY['popular']),
('Mediterranean Mint', 'talenti-mediterranean-mint', (SELECT id FROM brands WHERE slug = 'talenti'), 'gelato', ARRAY['popular']),
('Alphonso Mango', 'talenti-alphonso-mango', (SELECT id FROM brands WHERE slug = 'talenti'), 'sorbet', ARRAY['dairy-free']),

-- Generic / shop-original flavors (no brand)
('Vanilla', 'vanilla', NULL, 'classic', ARRAY['classic']),
('Chocolate', 'chocolate', NULL, 'chocolate', ARRAY['classic']),
('Strawberry', 'strawberry', NULL, 'fruit', ARRAY['classic']),
('Mint Chocolate Chip', 'mint-chocolate-chip', NULL, 'classic', ARRAY['classic', 'popular']),
('Cookies and Cream', 'cookies-and-cream', NULL, 'classic', ARRAY['classic', 'popular']),
('Cookie Dough', 'cookie-dough', NULL, 'classic', ARRAY['popular']),
('Rocky Road', 'rocky-road', NULL, 'chocolate', ARRAY['classic']),
('Butter Pecan', 'butter-pecan', NULL, 'nut', ARRAY['classic']),
('Pistachio', 'pistachio', NULL, 'nut', ARRAY['classic']),
('Mango Sorbet', 'mango-sorbet', NULL, 'sorbet', ARRAY['dairy-free']),
('Lemon Sorbet', 'lemon-sorbet', NULL, 'sorbet', ARRAY['dairy-free']),
('Black Sesame', 'black-sesame', NULL, 'novelty', ARRAY['unique', 'asian']),
('Ube', 'ube', NULL, 'novelty', ARRAY['unique', 'asian', 'popular']),
('Matcha', 'matcha', NULL, 'novelty', ARRAY['unique', 'asian']);

-- ============================================
-- LOCATIONS - NYC
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, coordinates, phone, website, instagram, is_claimed) VALUES
-- Manhattan Scoop Shops
('Van Leeuwen - East Village', 'van-leeuwen-east-village', 'scoop_shop', '48 E 7th St', 'New York', 'NY', '10003', ST_MakePoint(-73.9876, 40.7267)::geography, '(646) 476-0626', 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Van Leeuwen - West Village', 'van-leeuwen-west-village', 'scoop_shop', '224 W 4th St', 'New York', 'NY', '10014', ST_MakePoint(-74.0019, 40.7335)::geography, NULL, 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Van Leeuwen - NoHo', 'van-leeuwen-noho', 'scoop_shop', '10 E 4th St', 'New York', 'NY', '10012', ST_MakePoint(-73.9939, 40.7275)::geography, NULL, 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Van Leeuwen - Upper West Side', 'van-leeuwen-uws', 'scoop_shop', '587 Amsterdam Ave', 'New York', 'NY', '10024', ST_MakePoint(-73.9727, 40.7901)::geography, NULL, 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Morgenstern''s Finest Ice Cream', 'morgensterns-les', 'scoop_shop', '2 Rivington St', 'New York', 'NY', '10002', ST_MakePoint(-73.9932, 40.7206)::geography, '(212) 209-7684', 'https://morgensternsnyc.com', 'morgensternsnyc', true),
('Big Gay Ice Cream - East Village', 'big-gay-east-village', 'scoop_shop', '125 E 7th St', 'New York', 'NY', '10009', ST_MakePoint(-73.984, 40.7261)::geography, '(212) 533-9333', 'https://www.biggayicecream.com', 'biggayicecream', true),
('Soft Swerve - Lower East Side', 'soft-swerve-les', 'scoop_shop', '85B Allen St', 'New York', 'NY', '10002', ST_MakePoint(-73.9903, 40.7183)::geography, NULL, NULL, 'softswerve', false),
('Salt & Straw - West Village', 'salt-straw-west-village', 'scoop_shop', '171 W 4th St', 'New York', 'NY', '10014', ST_MakePoint(-74.0003, 40.7321)::geography, NULL, 'https://saltandstraw.com', 'saltandstraw', true),
('Jeni''s Splendid - Greenwich Village', 'jenis-greenwich-village', 'scoop_shop', '130 W 3rd St', 'New York', 'NY', '10012', ST_MakePoint(-74.0003, 40.7308)::geography, NULL, 'https://jenis.com', 'jenisicecreams', true),
('Jeni''s Splendid - Upper West Side', 'jenis-uws', 'scoop_shop', '495 Amsterdam Ave', 'New York', 'NY', '10024', ST_MakePoint(-73.9746, 40.7862)::geography, NULL, 'https://jenis.com', 'jenisicecreams', true),
('Davey''s Ice Cream - East Village', 'daveys-east-village', 'scoop_shop', '137 1st Ave', 'New York', 'NY', '10003', ST_MakePoint(-73.9848, 40.7277)::geography, '(212) 228-2210', 'https://www.daveysicecream.com', 'daveysicecream', true),
('Taiyaki NYC - Chinatown', 'taiyaki-chinatown', 'scoop_shop', '119 Baxter St', 'New York', 'NY', '10013', ST_MakePoint(-73.9993, 40.7169)::geography, NULL, 'https://taiyakinyc.com', 'taiyakinyc', false),
('Caffè Panna', 'caffe-panna-gramercy', 'scoop_shop', '77 Irving Pl', 'New York', 'NY', '10003', ST_MakePoint(-73.9879, 40.7348)::geography, NULL, NULL, 'caffepanna', true),
('il laboratorio del gelato', 'il-laboratorio-les', 'scoop_shop', '188 Ludlow St', 'New York', 'NY', '10002', ST_MakePoint(-73.988, 40.7215)::geography, '(212) 343-9922', 'https://www.laboratoriodelgelato.com', 'illaboratoriodelgelato', true),
('Mikey Likes It Ice Cream', 'mikey-likes-it-east-village', 'scoop_shop', '199 Avenue A', 'New York', 'NY', '10009', ST_MakePoint(-73.9792, 40.7294)::geography, '(212) 228-0078', NULL, 'mikeylikesiticecream', true),
('Emack & Bolio''s', 'emack-bolios-uws', 'scoop_shop', '389 Amsterdam Ave', 'New York', 'NY', '10024', ST_MakePoint(-73.9762, 40.7823)::geography, '(212) 362-2747', NULL, NULL, false),
('Sundaes and Cones', 'sundaes-cones-east-village', 'scoop_shop', '95 E 10th St', 'New York', 'NY', '10003', ST_MakePoint(-73.9907, 40.7306)::geography, '(212) 979-9398', NULL, NULL, false),
('Chinatown Ice Cream Factory', 'chinatown-ice-cream-factory', 'scoop_shop', '65 Bayard St', 'New York', 'NY', '10013', ST_MakePoint(-73.9988, 40.7155)::geography, '(212) 608-4170', NULL, 'chinatownicecreamfactory', true),

-- Brooklyn Scoop Shops
('Ample Hills - Gowanus', 'ample-hills-gowanus', 'scoop_shop', '305 Nevins St', 'Brooklyn', 'NY', '11215', ST_MakePoint(-73.9857, 40.6785)::geography, '(347) 725-4061', 'https://www.amplehills.com', 'amplehills', true),
('Ample Hills - Prospect Heights', 'ample-hills-prospect-heights', 'scoop_shop', '623 Vanderbilt Ave', 'Brooklyn', 'NY', '11238', ST_MakePoint(-73.9689, 40.6803)::geography, NULL, 'https://www.amplehills.com', 'amplehills', true),
('OddFellows - Williamsburg', 'oddfellows-williamsburg', 'scoop_shop', '175 Kent Ave', 'Brooklyn', 'NY', '11249', ST_MakePoint(-73.9613, 40.7144)::geography, '(347) 599-0556', 'https://www.oddfellowsnyc.com', 'oddfellowsnyc', true),
('OddFellows - Dumbo', 'oddfellows-dumbo', 'scoop_shop', '68 Jay St', 'Brooklyn', 'NY', '11201', ST_MakePoint(-73.9865, 40.7028)::geography, NULL, 'https://www.oddfellowsnyc.com', 'oddfellowsnyc', true),
('Van Leeuwen - Williamsburg', 'van-leeuwen-williamsburg', 'scoop_shop', '204 Wythe Ave', 'Brooklyn', 'NY', '11249', ST_MakePoint(-73.9592, 40.7137)::geography, NULL, 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Van Leeuwen - Boerum Hill', 'van-leeuwen-boerum-hill', 'scoop_shop', '128 Smith St', 'Brooklyn', 'NY', '11201', ST_MakePoint(-73.9895, 40.6857)::geography, NULL, 'https://vanleeuwenicecream.com', 'vanleeuwenicecream', true),
('Brooklyn Ice Cream Factory', 'brooklyn-ice-cream-factory', 'scoop_shop', '1 Water St', 'Brooklyn', 'NY', '11201', ST_MakePoint(-73.9936, 40.7025)::geography, '(718) 246-3963', NULL, NULL, true),

-- Queens / Bronx
('Max & Mina''s', 'max-minas-flushing', 'scoop_shop', '71-26 Main St', 'Flushing', 'NY', '11367', ST_MakePoint(-73.8277, 40.7272)::geography, '(718) 793-8629', NULL, NULL, false),
('Eddie''s Sweet Shop', 'eddies-sweet-shop', 'scoop_shop', '105-29 Metropolitan Ave', 'Forest Hills', 'NY', '11375', ST_MakePoint(-73.8462, 40.7134)::geography, '(718) 520-8514', NULL, NULL, true),

-- Long Island Scoop Shops
('Magic Fountain', 'magic-fountain-mattituck', 'scoop_shop', '9825 Main Rd', 'Mattituck', 'NY', '11952', ST_MakePoint(-72.5335, 40.9913)::geography, '(631) 298-4908', NULL, NULL, false),
('Snowflake Ice Cream Shoppe', 'snowflake-riverhead', 'scoop_shop', '76 Flanders Rd', 'Riverhead', 'NY', '11901', ST_MakePoint(-72.6882, 40.9168)::geography, '(631) 727-4394', NULL, NULL, false),
('Jim & Rob''s Fresh Squeez''d', 'jim-robs-huntington', 'scoop_shop', '265 New York Ave', 'Huntington', 'NY', '11743', ST_MakePoint(-73.4257, 40.8718)::geography, '(631) 424-7300', NULL, NULL, false),
('Krisch''s Restaurant & Ice Cream Parlour', 'krischs-massapequa', 'scoop_shop', '11 Central Ave', 'Massapequa', 'NY', '11758', ST_MakePoint(-73.4704, 40.6727)::geography, '(516) 798-9775', NULL, NULL, false),
('Bald Hill Farmstand', 'bald-hill-farmstand', 'scoop_shop', '2397 Route 25', 'Calverton', 'NY', '11933', ST_MakePoint(-72.7457, 40.9058)::geography, NULL, NULL, NULL, false),
('Ice Cream Social', 'ice-cream-social-northport', 'scoop_shop', '136 Main St', 'Northport', 'NY', '11768', ST_MakePoint(-73.3432, 40.9005)::geography, '(631) 651-4444', NULL, 'icecreamsocialnorthport', false),
('Hildebrandt''s', 'hildebrandts-williston-park', 'scoop_shop', '84 Hillside Ave', 'Williston Park', 'NY', '11596', ST_MakePoint(-73.6451, 40.7562)::geography, '(516) 741-0608', NULL, NULL, true),
('Jahn''s Ice Cream Parlor', 'jahns-jackson-heights', 'scoop_shop', '81-04 37th Ave', 'Jackson Heights', 'NY', '11372', ST_MakePoint(-73.8862, 40.7495)::geography, '(718) 651-0700', NULL, NULL, false),
('Uncle Louie G', 'uncle-louie-g-floral-park', 'scoop_shop', '256 Jericho Turnpike', 'Floral Park', 'NY', '11001', ST_MakePoint(-73.6994, 40.7243)::geography, '(516) 352-4566', NULL, NULL, false),
('Sip''N Soda', 'sip-n-soda-southampton', 'scoop_shop', '40 Hampton Rd', 'Southampton', 'NY', '11968', ST_MakePoint(-72.3907, 40.8847)::geography, '(631) 283-9752', NULL, NULL, false),
('Fudge Company', 'fudge-company-huntington', 'scoop_shop', '67 Wall St', 'Huntington', 'NY', '11743', ST_MakePoint(-73.4270, 40.8689)::geography, '(631) 549-3834', NULL, NULL, false),
('Handel''s Homemade Ice Cream', 'handels-roslyn', 'scoop_shop', '1025 Northern Blvd', 'Roslyn', 'NY', '11576', ST_MakePoint(-73.6533, 40.7924)::geography, '(516) 625-5900', NULL, NULL, false),

-- NYC Supermarkets
('Whole Foods - Bowery', 'whole-foods-bowery', 'supermarket', '95 E Houston St', 'New York', 'NY', '10002', ST_MakePoint(-73.9916, 40.7242)::geography, '(212) 420-1320', 'https://www.wholefoodsmarket.com', NULL, false),
('Whole Foods - Columbus Circle', 'whole-foods-columbus-circle', 'supermarket', '10 Columbus Cir', 'New York', 'NY', '10019', ST_MakePoint(-73.9819, 40.7686)::geography, '(212) 823-9600', 'https://www.wholefoodsmarket.com', NULL, false),
('Trader Joe''s - Union Square', 'trader-joes-union-square', 'supermarket', '142 E 14th St', 'New York', 'NY', '10003', ST_MakePoint(-73.9877, 40.7337)::geography, '(212) 529-4612', 'https://www.traderjoes.com', NULL, false),
('Trader Joe''s - Brooklyn', 'trader-joes-brooklyn', 'supermarket', '130 Court St', 'Brooklyn', 'NY', '11201', ST_MakePoint(-73.9919, 40.6888)::geography, '(718) 246-8460', 'https://www.traderjoes.com', NULL, false),
('Wegmans - Brooklyn Navy Yard', 'wegmans-brooklyn', 'supermarket', '21 Flushing Ave', 'Brooklyn', 'NY', '11205', ST_MakePoint(-73.9742, 40.6992)::geography, '(718) 412-1940', 'https://www.wegmans.com', NULL, false),

-- Long Island Supermarkets
('Whole Foods - Jericho', 'whole-foods-jericho', 'supermarket', '375 N Broadway', 'Jericho', 'NY', '11753', ST_MakePoint(-73.5371, 40.7919)::geography, '(516) 334-3060', 'https://www.wholefoodsmarket.com', NULL, false),
('Trader Joe''s - Westbury', 'trader-joes-westbury', 'supermarket', '937 Old Country Rd', 'Westbury', 'NY', '11590', ST_MakePoint(-73.5652, 40.7489)::geography, '(516) 228-0677', 'https://www.traderjoes.com', NULL, false),

-- Farmers Markets
('Smorgasburg Williamsburg', 'smorgasburg-williamsburg', 'farmers_market', '90 Kent Ave', 'Brooklyn', 'NY', '11249', ST_MakePoint(-73.9614, 40.7216)::geography, NULL, 'https://www.smorgasburg.com', 'smorgasburg', false),
('Union Square Greenmarket', 'union-square-greenmarket', 'farmers_market', '1 Union Square W', 'New York', 'NY', '10003', ST_MakePoint(-73.9903, 40.7359)::geography, NULL, NULL, 'greenabormarket', false),

-- Restaurants with homemade ice cream
('Grimaldi''s Pizzeria', 'grimaldis-dumbo', 'restaurant', '1 Front St', 'Brooklyn', 'NY', '11201', ST_MakePoint(-73.9934, 40.7027)::geography, '(718) 858-4300', 'https://www.grimaldis.com', NULL, false),
('Momofuku Milk Bar', 'momofuku-milk-bar', 'restaurant', '382 Metropolitan Ave', 'Brooklyn', 'NY', '11211', ST_MakePoint(-73.9567, 40.7137)::geography, NULL, 'https://milkbarstore.com', 'milkbarstore', true);

-- ============================================
-- BADGES
-- ============================================
INSERT INTO badges (name, slug, description, category, requirement_type, requirement_value, sort_order) VALUES
('First Scoop', 'first-scoop', 'Check in your first ice cream', 'checkins', 'checkin_count', 1, 1),
('Regular', 'regular', 'Check in 10 times', 'checkins', 'checkin_count', 10, 2),
('Ice Cream Fanatic', 'ice-cream-fanatic', 'Check in 50 times', 'checkins', 'checkin_count', 50, 3),
('Century Club', 'century-club', 'Check in 100 times', 'checkins', 'checkin_count', 100, 4),
('Flavor Explorer', 'flavor-explorer', 'Try 10 unique flavors', 'flavors', 'unique_flavors', 10, 5),
('Flavor Connoisseur', 'flavor-connoisseur', 'Try 50 unique flavors', 'flavors', 'unique_flavors', 50, 6),
('Flavor Master', 'flavor-master', 'Try 100 unique flavors', 'flavors', 'unique_flavors', 100, 7),
('Shop Hopper', 'shop-hopper', 'Visit 5 different locations', 'locations', 'unique_locations', 5, 8),
('Neighborhood Explorer', 'neighborhood-explorer', 'Visit 10 different locations', 'locations', 'unique_locations', 10, 9),
('NYC Ice Cream Tour', 'nyc-ice-cream-tour', 'Visit 25 different locations', 'locations', 'unique_locations', 25, 10),
('Globe Trotter', 'globe-trotter', 'Visit 50 different locations', 'locations', 'unique_locations', 50, 11),
('Social Butterfly', 'social-butterfly', 'Follow 10 users', 'social', 'follow_count', 10, 12),
('Trendsetter', 'trendsetter', 'Get 10 followers', 'social', 'follower_count', 10, 13),
('Photographer', 'photographer', 'Post 10 check-ins with photos', 'special', 'photo_checkins', 10, 14),
('Critic', 'critic', 'Leave notes on 20 check-ins', 'special', 'noted_checkins', 20, 15);
