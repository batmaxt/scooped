-- ============================================
-- SCOOPED - Expanded Locations Seed Data
-- ~200+ additional locations across NYC, Long Island, and surrounding areas
-- Run AFTER 001_seed_data.sql
-- ============================================

-- ============================================
-- NEW BRANDS (skip if already exists)
-- ============================================
INSERT INTO brands (name, slug, description, brand_type, website) VALUES
('Tipsy Scoop', 'tipsy-scoop', 'Liquor-infused ice cream and boozy shakes', 'local_creamery', 'https://tipsyscoop.com'),
('Anita Gelato', 'anita-gelato', 'Authentic Italian gelato with Middle Eastern roots', 'regional', 'https://anitagelato.com'),
('Kilwins', 'kilwins', 'Chocolates, fudge, and ice cream since 1947', 'national', 'https://www.kilwins.com'),
('Emack & Bolio''s', 'emack-and-bolios', 'Boston-born creative ice cream shop', 'regional', 'https://www.emackandbolios.com'),
('Blue Marble Ice Cream', 'blue-marble', 'Organic ice cream from Brooklyn', 'local_creamery', 'https://www.bluemarbleicecream.com'),
('Ghirardelli', 'ghirardelli', 'Premium chocolate and ice cream since 1852', 'national', 'https://www.ghirardelli.com'),
('Marvel Frozen Dairy', 'marvel-frozen-dairy', 'Classic soft serve and frozen treats', 'regional', NULL),
('Egger''s Ice Cream Parlor', 'eggers', 'Staten Island ice cream tradition since 1932', 'local_creamery', NULL),
('Pesso''s Ices & Ice Cream', 'pessos', 'Bayside Italian ices and ice cream', 'local_creamery', NULL),
('Serendipity 3', 'serendipity', 'Iconic NYC restaurant famous for Frrrozen Hot Chocolate', 'local_creamery', 'https://serendipity3.com'),
('Noona''s Ice Cream', 'noonas', 'South Asian-inspired ice cream from NYC', 'local_creamery', NULL),
('Surreal Creamery', 'surreal-creamery', 'Instagram-worthy nitrogen ice cream', 'local_creamery', NULL),
('Grace Street Coffee & Desserts', 'grace-street', 'Korean-inspired desserts and bingsoo', 'local_creamery', NULL),
('Black Tap Craft Burgers & Beer', 'black-tap', 'Famous for over-the-top milkshakes', 'restaurant', 'https://blacktap.com'),
('Figo Il Gelato', 'figo-il-gelato', 'Artisan Italian gelato', 'local_creamery', NULL),
('Softside', 'softside', 'Modern soft serve shop', 'local_creamery', NULL)
ON CONFLICT (slug) DO NOTHING;


-- ============================================
-- EXPANDED LOCATIONS
-- Using ON CONFLICT (slug) DO NOTHING to avoid duplicates
-- ============================================

-- ============================================
-- MANHATTAN - Midtown
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Rockefeller Center', 'van-leeuwen-rockefeller-center', 'scoop_shop', '1250 6th Ave', 'New York', 'NY', '10020', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9808, 40.7593)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Times Square', 'van-leeuwen-times-square', 'scoop_shop', '712 7th Ave', 'New York', 'NY', '10036', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9832, 40.7605)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Murray Hill', 'van-leeuwen-murray-hill', 'scoop_shop', '432 3rd Ave', 'New York', 'NY', '10016', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9788, 40.7435)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - 2nd Ave Midtown', 'van-leeuwen-2nd-ave-midtown', 'scoop_shop', '943 2nd Ave', 'New York', 'NY', '10022', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9679, 40.7548)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('A La Mode Shoppe', 'a-la-mode-shoppe-midtown', 'scoop_shop', '236 E 55th St', 'New York', 'NY', '10022', 'alamodeshoppe', false, true, ST_MakePoint(-73.9653, 40.7575)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Anita Gelato - UES', 'anita-gelato-ues', 'scoop_shop', '1561 2nd Ave', 'New York', 'NY', '10028', 'anitagelato', false, true, ST_MakePoint(-73.9547, 40.7745)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ghirardelli Chocolate & Ice Cream', 'ghirardelli-flatiron', 'scoop_shop', '840 Broadway', 'New York', 'NY', '10003', 'ghirardelli', false, true, ST_MakePoint(-73.9916, 40.7340)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Haagen-Dazs - Times Square', 'haagen-dazs-times-square', 'scoop_shop', '1560 Broadway', 'New York', 'NY', '10036', 'haagendazs', false, true, ST_MakePoint(-73.9854, 40.7587)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('City Scoop', 'city-scoop-midtown', 'scoop_shop', '130 W 56th St', 'New York', 'NY', '10019', 'cityscoopnyc', false, true, ST_MakePoint(-73.9778, 40.7640)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Grace Street - Koreatown', 'grace-street-koreatown', 'restaurant', '17 W 32nd St', 'New York', 'NY', '10001', 'gracestreetcoffee', false, true, ST_MakePoint(-73.9870, 40.7478)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Black Tap - Midtown', 'black-tap-midtown', 'restaurant', '136 W 55th St', 'New York', 'NY', '10019', 'blacktapnyc', false, true, ST_MakePoint(-73.9785, 40.7637)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Figo Il Gelato - Midtown', 'figo-il-gelato-midtown', 'scoop_shop', '53 W 47th St', 'New York', 'NY', '10036', 'figoilgelato', false, true, ST_MakePoint(-73.9800, 40.7580)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Softside', 'softside-midtown', 'scoop_shop', '448 8th Ave', 'New York', 'NY', '10001', 'softsidenyc', false, true, ST_MakePoint(-73.9935, 40.7524)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Sundaes Best', 'sundaes-best-midtown', 'scoop_shop', '200 E 60th St', 'New York', 'NY', '10022', 'sundaesbest', false, true, ST_MakePoint(-73.9636, 40.7621)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MANHATTAN - Upper East Side
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('UES Ice Cream (Speakeasy)', 'ues-ice-cream-speakeasy', 'scoop_shop', '1707 2nd Ave', 'New York', 'NY', '10128', 'theuesnyc', false, true, ST_MakePoint(-73.9510, 40.7786)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Serendipity 3', 'serendipity-3-ues', 'restaurant', '225 E 60th St', 'New York', 'NY', '10022', 'serendipity3nyc', false, true, ST_MakePoint(-73.9623, 40.7614)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Emack & Bolio''s - UES', 'emack-bolios-ues', 'scoop_shop', '1564 1st Ave', 'New York', 'NY', '10028', 'emackandbolios', false, true, ST_MakePoint(-73.9499, 40.7741)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MANHATTAN - Upper West Side
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Amsterdam Ave', 'van-leeuwen-amsterdam-ave', 'scoop_shop', '448 Amsterdam Ave', 'New York', 'NY', '10024', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9750, 40.7850)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Broadway UWS', 'van-leeuwen-broadway-uws', 'scoop_shop', '2578 Broadway', 'New York', 'NY', '10025', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9718, 40.7946)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Salt & Straw - Amsterdam Ave', 'salt-straw-amsterdam-ave', 'scoop_shop', '360 Amsterdam Ave', 'New York', 'NY', '10024', 'saltandstraw', false, true, ST_MakePoint(-73.9770, 40.7815)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - UWS', 'ample-hills-uws', 'scoop_shop', '526 Amsterdam Ave', 'New York', 'NY', '10024', 'amplehills', true, true, ST_MakePoint(-73.9740, 40.7880)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ben & Jerry''s - UWS', 'ben-and-jerrys-uws', 'scoop_shop', '2710 Broadway', 'New York', 'NY', '10025', 'benandjerrys', false, true, ST_MakePoint(-73.9700, 40.7970)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Emack & Bolio''s - UWS', 'emack-bolios-uws-amsterdam', 'scoop_shop', '389 Amsterdam Ave', 'New York', 'NY', '10024', 'emackandbolios', false, true, ST_MakePoint(-73.9760, 40.7835)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MANHATTAN - Downtown (SoHo, TriBeCa, FiDi, Chelsea, Greenwich Village)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - SoHo', 'van-leeuwen-soho', 'scoop_shop', '61 W Houston St', 'New York', 'NY', '10012', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9997, 40.7268)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - FiDi', 'van-leeuwen-fidi', 'scoop_shop', '224 Front St', 'New York', 'NY', '10038', 'vanleeuwenicecream', true, true, ST_MakePoint(-74.0028, 40.7071)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Salt & Straw - Hudson St', 'salt-straw-hudson-st', 'scoop_shop', '540 Hudson St', 'New York', 'NY', '10014', 'saltandstraw', false, true, ST_MakePoint(-74.0069, 40.7331)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('OddFellows - Chelsea', 'oddfellows-chelsea', 'scoop_shop', '141 8th Ave', 'New York', 'NY', '10011', 'oddfellowsnyc', true, true, ST_MakePoint(-74.0014, 40.7416)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Tipsy Scoop - Chelsea', 'tipsy-scoop-chelsea', 'scoop_shop', '217 W 14th St', 'New York', 'NY', '10011', 'tipsyscoop', false, true, ST_MakePoint(-73.9996, 40.7385)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Jeni''s Splendid Ice Creams - University Pl', 'jenis-university-pl', 'scoop_shop', '37 University Pl', 'New York', 'NY', '10003', 'jenisicecreams', false, true, ST_MakePoint(-73.9949, 40.7322)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Taiyaki NYC - Chinatown', 'taiyaki-nyc-chinatown', 'scoop_shop', '119 Baxter St', 'New York', 'NY', '10013', 'taiyaki.nyc', false, true, ST_MakePoint(-73.9990, 40.7164)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Surreal Creamery', 'surreal-creamery-greenwich', 'scoop_shop', '41 W 8th St', 'New York', 'NY', '10011', 'surrealcreamery', false, true, ST_MakePoint(-73.9975, 40.7322)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Noona''s Ice Cream - TriBeCa', 'noonas-tribeca', 'scoop_shop', '140 Duane St', 'New York', 'NY', '10013', 'noonasicecream', false, true, ST_MakePoint(-74.0070, 40.7167)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Anita Gelato - Greenwich Village', 'anita-gelato-greenwich', 'scoop_shop', '379A Greenwich St', 'New York', 'NY', '10013', 'anitagelato', false, true, ST_MakePoint(-74.0087, 40.7220)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Mikey Likes It Ice Cream - LES', 'mikey-likes-it-les', 'scoop_shop', '199 Avenue A', 'New York', 'NY', '10009', 'mikeylikesitnyc', false, true, ST_MakePoint(-73.9800, 40.7287)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MANHATTAN - Harlem / Washington Heights
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Noona''s Ice Cream - Harlem', 'noonas-harlem', 'scoop_shop', '609 Lenox Ave', 'New York', 'NY', '10037', 'noonasicecream', false, true, ST_MakePoint(-73.9395, 40.8145)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Harlem', 'carvel-harlem', 'scoop_shop', '301 W 145th St', 'New York', 'NY', '10039', 'carvelicecream', false, true, ST_MakePoint(-73.9427, 40.8222)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BROOKLYN
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Greenpoint', 'van-leeuwen-greenpoint', 'scoop_shop', '632 Manhattan Ave', 'Brooklyn', 'NY', '11222', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9545, 40.7275)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Park Slope', 'van-leeuwen-park-slope', 'scoop_shop', '81 Bergen St', 'Brooklyn', 'NY', '11201', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9773, 40.6865)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Bergen St', 'van-leeuwen-bergen-st', 'scoop_shop', '155 Bergen St', 'Brooklyn', 'NY', '11217', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9753, 40.6848)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Caffe Panna - Greenpoint', 'caffe-panna-greenpoint', 'scoop_shop', '16 Norman Ave', 'Brooklyn', 'NY', '11222', 'caffepanna', false, true, ST_MakePoint(-73.9512, 40.7268)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('OddFellows - DUMBO', 'oddfellows-dumbo-water-st', 'scoop_shop', '44 Water St', 'Brooklyn', 'NY', '11201', 'oddfellowsnyc', true, true, ST_MakePoint(-73.9911, 40.7031)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - Vanderbilt', 'ample-hills-vanderbilt', 'scoop_shop', '623 Vanderbilt Ave', 'Brooklyn', 'NY', '11238', 'amplehills', true, true, ST_MakePoint(-73.9686, 40.6803)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Dolce Brooklyn', 'dolce-brooklyn-cobble-hill', 'scoop_shop', '262 Court St', 'Brooklyn', 'NY', '11231', 'dolcebrooklyn', false, true, ST_MakePoint(-73.9932, 40.6829)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Biddrina Gelato', 'biddrina-gelato-clinton-hill', 'scoop_shop', '120 Gates Ave', 'Brooklyn', 'NY', '11238', 'biddrinagelato', false, true, ST_MakePoint(-73.9647, 40.6856)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Coney''s Cones', 'coneys-cones-coney-island', 'scoop_shop', '1001 Boardwalk W', 'Brooklyn', 'NY', '11224', 'coneys_cones', false, true, ST_MakePoint(-73.9813, 40.5732)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Serendipity BK', 'serendipity-bk-crown-heights', 'scoop_shop', '226 Utica Ave', 'Brooklyn', 'NY', '11213', 'serendipitybk', false, true, ST_MakePoint(-73.9316, 40.6689)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Nicholas Ice Cream', 'nicholas-ice-cream-prospect-heights', 'scoop_shop', '305 Flatbush Ave', 'Brooklyn', 'NY', '11217', 'nicholasicecream', false, true, ST_MakePoint(-73.9740, 40.6817)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - Social', 'ample-hills-social', 'scoop_shop', '816 Washington Ave', 'Brooklyn', 'NY', '11238', 'amplehills', true, true, ST_MakePoint(-73.9641, 40.6715)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Tipsy Scoop - Williamsburg', 'tipsy-scoop-williamsburg', 'scoop_shop', '270 Metropolitan Ave', 'Brooklyn', 'NY', '11211', 'tipsyscoop', false, true, ST_MakePoint(-73.9583, 40.7142)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Blue Marble Ice Cream', 'blue-marble-prospect-heights', 'scoop_shop', '186 Underhill Ave', 'Brooklyn', 'NY', '11238', 'bluemarbleicecream', false, true, ST_MakePoint(-73.9660, 40.6791)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whipped', 'whipped-cobble-hill', 'scoop_shop', '214 Court St', 'Brooklyn', 'NY', '11201', 'whippedbrooklyn', false, true, ST_MakePoint(-73.9935, 40.6842)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Brooklyn Farmacy & Soda Fountain', 'brooklyn-farmacy-carroll-gardens', 'scoop_shop', '513 Henry St', 'Brooklyn', 'NY', '11231', 'brooklynfarmacy', false, true, ST_MakePoint(-73.9948, 40.6789)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('L''Albero dei Gelati', 'lalbero-dei-gelati-park-slope', 'scoop_shop', '341 5th Ave', 'Brooklyn', 'NY', '11215', 'lalberodeigelati', false, true, ST_MakePoint(-73.9827, 40.6710)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - DUMBO', 'ample-hills-dumbo', 'scoop_shop', '29 Fulton St', 'Brooklyn', 'NY', '11201', 'amplehills', true, true, ST_MakePoint(-73.9938, 40.7026)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('OddFellows - East Village', 'oddfellows-east-village', 'scoop_shop', '75 E 4th St', 'New York', 'NY', '10003', 'oddfellowsnyc', true, true, ST_MakePoint(-73.9910, 40.7264)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('OddFellows - Nolita', 'oddfellows-nolita', 'scoop_shop', '19 Kenmare St', 'New York', 'NY', '10012', 'oddfellowsnyc', true, true, ST_MakePoint(-73.9963, 40.7222)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- QUEENS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - Astoria', 'ample-hills-astoria', 'scoop_shop', '34-02 30th Ave', 'Astoria', 'NY', '11103', 'amplehills', true, true, ST_MakePoint(-73.9180, 40.7695)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Tipsy Scoop - Astoria', 'tipsy-scoop-astoria', 'scoop_shop', '38-15 23rd Ave', 'Astoria', 'NY', '11105', 'tipsyscoop', false, true, ST_MakePoint(-73.9070, 40.7752)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Astoria', 'van-leeuwen-astoria', 'scoop_shop', '31-16 Ditmars Blvd', 'Astoria', 'NY', '11105', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9110, 40.7737)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Figo Il Gelato - Astoria', 'figo-il-gelato-astoria', 'scoop_shop', '23-12 31st St', 'Astoria', 'NY', '11105', 'figoilgelato', false, true, ST_MakePoint(-73.9120, 40.7718)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Sweet Janes', 'sweet-janes-astoria', 'scoop_shop', '31-25 Ditmars Blvd', 'Astoria', 'NY', '11105', 'sweetjanesicecream', false, true, ST_MakePoint(-73.9100, 40.7735)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Marvel Frozen Dairy - Astoria', 'marvel-frozen-dairy-astoria', 'scoop_shop', '37-01 Ditmars Blvd', 'Astoria', 'NY', '11105', 'marvelfrozendairy', false, true, ST_MakePoint(-73.9048, 40.7735)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Astoria', 'ralphs-italian-ices-astoria', 'scoop_shop', '33-12 Ditmars Blvd', 'Astoria', 'NY', '11105', 'ralphsices', false, true, ST_MakePoint(-73.9080, 40.7735)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Pesso''s Ices - Bayside', 'pessos-ices-bayside', 'scoop_shop', '203-20 35th Ave', 'Bayside', 'NY', '11361', 'pessosices', false, true, ST_MakePoint(-73.7706, 40.7636)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Snowdays - Forest Hills', 'snowdays-forest-hills', 'scoop_shop', '72-24 Austin St', 'Forest Hills', 'NY', '11375', 'snowdaysnyc', false, true, ST_MakePoint(-73.8443, 40.7205)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Creme & Sugar - Ridgewood', 'creme-and-sugar-ridgewood', 'scoop_shop', '58-42 Catalpa Ave', 'Ridgewood', 'NY', '11385', 'cremeandsugarlic', false, true, ST_MakePoint(-73.8992, 40.7003)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Lemon Ice King of Corona', 'lemon-ice-king-corona', 'scoop_shop', '52-02 108th St', 'Corona', 'NY', '11368', 'lemonicekingofcorona', false, true, ST_MakePoint(-73.8631, 40.7380)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Jahn''s Ice Cream Parlor - Richmond Hill', 'jahns-richmond-hill', 'scoop_shop', '117-03 Hillside Ave', 'Richmond Hill', 'NY', '11418', NULL, false, true, ST_MakePoint(-73.8329, 40.6981)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Whitestone', 'ralphs-italian-ices-whitestone', 'scoop_shop', '12-21 150th St', 'Whitestone', 'NY', '11357', 'ralphsices', false, true, ST_MakePoint(-73.8110, 40.7790)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ben & Jerry''s - LIC', 'ben-and-jerrys-lic', 'scoop_shop', '10-56 Jackson Ave', 'Long Island City', 'NY', '11101', 'benandjerrys', false, true, ST_MakePoint(-73.9430, 40.7497)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- BRONX
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Lickety Split - City Island', 'lickety-split-city-island', 'scoop_shop', '295 City Island Ave', 'Bronx', 'NY', '10464', NULL, false, true, ST_MakePoint(-73.7862, 40.8478)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Delicioso Coco Helado', 'delicioso-coco-helado-bronx', 'scoop_shop', '849 St Anns Ave', 'Bronx', 'NY', '10456', NULL, false, true, ST_MakePoint(-73.9111, 40.8212)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Fordham', 'carvel-fordham', 'scoop_shop', '327 E Fordham Rd', 'Bronx', 'NY', '10458', 'carvelicecream', false, true, ST_MakePoint(-73.8926, 40.8618)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Riverdale', 'carvel-riverdale', 'scoop_shop', '5761 Broadway', 'Bronx', 'NY', '10463', 'carvelicecream', false, true, ST_MakePoint(-73.9054, 40.8745)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Pelham Bay', 'carvel-pelham-bay', 'scoop_shop', '1516 Crosby Ave', 'Bronx', 'NY', '10461', 'carvelicecream', false, true, ST_MakePoint(-73.8316, 40.8351)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Bronx', 'ralphs-italian-ices-bronx', 'scoop_shop', '501 E Tremont Ave', 'Bronx', 'NY', '10457', 'ralphsices', false, true, ST_MakePoint(-73.8950, 40.8460)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- STATEN ISLAND
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Egger''s Ice Cream Parlor', 'eggers-forest-ave', 'scoop_shop', '1194 Forest Ave', 'Staten Island', 'NY', '10310', 'eggersicecream', false, true, ST_MakePoint(-74.1220, 40.6310)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('GelaTerra', 'gelaterra-staten-island', 'scoop_shop', '90 Bay St', 'Staten Island', 'NY', '10301', 'gelaterrastatenisland', false, true, ST_MakePoint(-74.0771, 40.6433)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Famous Italian Ices - Staten Island (Hylan)', 'ralphs-italian-ices-si-hylan', 'scoop_shop', '6810 Hylan Blvd', 'Staten Island', 'NY', '10309', 'ralphsices', false, true, ST_MakePoint(-74.1600, 40.5330)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Egger''s Ice Cream Parlor - Richmond Rd', 'eggers-richmond-rd', 'scoop_shop', '7404 Richmond Rd', 'Staten Island', 'NY', '10306', 'eggersicecream', false, true, ST_MakePoint(-74.1139, 40.5712)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Staten Island', 'carvel-staten-island', 'scoop_shop', '2636 Hylan Blvd', 'Staten Island', 'NY', '10306', 'carvelicecream', false, true, ST_MakePoint(-74.1099, 40.5733)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SUPERMARKETS - Manhattan
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Bryant Park', 'whole-foods-bryant-park', 'supermarket', '1095 6th Ave', 'New York', 'NY', '10036', 'wholefoods', false, true, ST_MakePoint(-73.9836, 40.7540)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Manhattan West', 'whole-foods-manhattan-west', 'supermarket', '450 W 33rd St', 'New York', 'NY', '10001', 'wholefoods', false, true, ST_MakePoint(-73.9976, 40.7535)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - 57th St', 'whole-foods-57th-st', 'supermarket', '226 E 57th St', 'New York', 'NY', '10022', 'wholefoods', false, true, ST_MakePoint(-73.9671, 40.7590)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Chelsea', 'whole-foods-chelsea', 'supermarket', '250 7th Ave', 'New York', 'NY', '10001', 'wholefoods', false, true, ST_MakePoint(-73.9937, 40.7446)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Union Square', 'whole-foods-union-square', 'supermarket', '4 Union Square South', 'New York', 'NY', '10003', 'wholefoods', false, true, ST_MakePoint(-73.9901, 40.7338)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - TriBeCa', 'whole-foods-tribeca', 'supermarket', '270 Greenwich St', 'New York', 'NY', '10007', 'wholefoods', false, true, ST_MakePoint(-74.0118, 40.7152)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Chelsea', 'trader-joes-chelsea', 'supermarket', '675 6th Ave', 'New York', 'NY', '10010', 'traderjoes', false, true, ST_MakePoint(-73.9934, 40.7408)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Grand St', 'trader-joes-grand-st', 'supermarket', '400 Grand St', 'New York', 'NY', '10002', 'traderjoes', false, true, ST_MakePoint(-73.9882, 40.7154)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - UES (Bridgemarket)', 'trader-joes-ues-bridgemarket', 'supermarket', '405 E 59th St', 'New York', 'NY', '10022', 'traderjoes', false, true, ST_MakePoint(-73.9593, 40.7605)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - UWS (72nd)', 'trader-joes-uws-72nd', 'supermarket', '2073 Broadway', 'New York', 'NY', '10023', 'traderjoes', false, true, ST_MakePoint(-73.9813, 40.7785)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Wegmans - Astor Place', 'wegmans-astor-place', 'supermarket', '770 Broadway', 'New York', 'NY', '10003', 'wegmans', false, true, ST_MakePoint(-73.9923, 40.7303)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Murray Hill', 'trader-joes-murray-hill', 'supermarket', '349 E 32nd St', 'New York', 'NY', '10016', 'traderjoes', false, true, ST_MakePoint(-73.9750, 40.7442)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Harlem', 'whole-foods-harlem', 'supermarket', '100 W 125th St', 'New York', 'NY', '10027', 'wholefoods', false, true, ST_MakePoint(-73.9500, 40.8086)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Harlem', 'trader-joes-harlem', 'supermarket', '2073 Frederick Douglass Blvd', 'New York', 'NY', '10026', 'traderjoes', false, true, ST_MakePoint(-73.9558, 40.8002)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SUPERMARKETS - Brooklyn & Queens
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Gowanus', 'whole-foods-gowanus', 'supermarket', '214 3rd St', 'Brooklyn', 'NY', '11215', 'wholefoods', false, true, ST_MakePoint(-73.9842, 40.6756)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Atlantic Ave', 'trader-joes-atlantic-ave', 'supermarket', '130 Court St', 'Brooklyn', 'NY', '11201', 'traderjoes', false, true, ST_MakePoint(-73.9927, 40.6879)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Williamsburg', 'whole-foods-williamsburg', 'supermarket', '238 Bedford Ave', 'Brooklyn', 'NY', '11249', 'wholefoods', false, true, ST_MakePoint(-73.9613, 40.7148)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Williamsburg', 'trader-joes-williamsburg', 'supermarket', '400 Kent Ave', 'Brooklyn', 'NY', '11249', 'traderjoes', false, true, ST_MakePoint(-73.9658, 40.7106)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Brooklyn (3rd Ave)', 'whole-foods-brooklyn-3rd-ave', 'supermarket', '403 3rd Ave', 'Brooklyn', 'NY', '11215', 'wholefoods', false, true, ST_MakePoint(-73.9771, 40.6726)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Cobble Hill', 'trader-joes-cobble-hill', 'supermarket', '130 Court St', 'Brooklyn', 'NY', '11201', 'traderjoes', false, true, ST_MakePoint(-73.9927, 40.6879)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Astoria', 'whole-foods-astoria', 'supermarket', '32-12 Broadway', 'Astoria', 'NY', '11106', 'wholefoods', false, true, ST_MakePoint(-73.9207, 40.7621)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Forest Hills', 'trader-joes-forest-hills', 'supermarket', '70-10 Austin St', 'Forest Hills', 'NY', '11375', 'traderjoes', false, true, ST_MakePoint(-73.8452, 40.7209)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- LONG ISLAND - Nassau County
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Kilwins - Garden City', 'kilwins-garden-city', 'scoop_shop', '168 7th St', 'Garden City', 'NY', '11530', 'kilwins', false, true, ST_MakePoint(-73.6342, 40.7270)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Nana''s Ice Cream & Coffee', 'nanas-ice-cream-lawrence', 'scoop_shop', '25 Central Ave', 'Lawrence', 'NY', '11559', 'nanasicecream', false, true, ST_MakePoint(-73.7365, 40.6159)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Douglas & James Homemade Ice Cream', 'douglas-and-james-levittown', 'scoop_shop', '130 Wantagh Ave', 'Levittown', 'NY', '11756', 'douglasandjames', false, true, ST_MakePoint(-73.5128, 40.7289)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Old Fashioned Ice Cream', 'old-fashioned-ice-cream-manhasset', 'scoop_shop', '400 Plandome Rd', 'Manhasset', 'NY', '11030', NULL, false, true, ST_MakePoint(-73.6896, 40.7946)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Let''s Roll - Merrick', 'lets-roll-merrick', 'scoop_shop', '2128 Merrick Rd', 'Merrick', 'NY', '11566', 'letsrollicecream', false, true, ST_MakePoint(-73.5504, 40.6561)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Sweet Spot Cafe - Seaford', 'sweet-spot-cafe-seaford', 'scoop_shop', '3850 Merrick Rd', 'Seaford', 'NY', '11783', 'sweetspotcafeseaford', false, true, ST_MakePoint(-73.4894, 40.6662)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Rockville Centre', 'carvel-rockville-centre', 'scoop_shop', '234 Sunrise Hwy', 'Rockville Centre', 'NY', '11570', 'carvelicecream', false, true, ST_MakePoint(-73.6420, 40.6609)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Farmingdale', 'ralphs-italian-ices-farmingdale', 'scoop_shop', '310 Main St', 'Farmingdale', 'NY', '11735', 'ralphsices', false, true, ST_MakePoint(-73.4454, 40.7321)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Uncle Louie G - Wantagh', 'uncle-louie-g-wantagh', 'scoop_shop', '3355 Park Ave', 'Wantagh', 'NY', '11793', 'unclelouieg', false, true, ST_MakePoint(-73.5084, 40.6672)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Franklin Square', 'carvel-franklin-square', 'scoop_shop', '981 Hempstead Tpke', 'Franklin Square', 'NY', '11010', 'carvelicecream', false, true, ST_MakePoint(-73.6717, 40.7039)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Westbury', 'ralphs-italian-ices-westbury', 'scoop_shop', '530 Old Country Rd', 'Westbury', 'NY', '11590', 'ralphsices', false, true, ST_MakePoint(-73.5602, 40.7496)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Uncle Louie G - Valley Stream', 'uncle-louie-g-valley-stream', 'scoop_shop', '138 Rockaway Ave', 'Valley Stream', 'NY', '11580', 'unclelouieg', false, true, ST_MakePoint(-73.7059, 40.6621)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Syosset', 'carvel-syosset', 'scoop_shop', '451 Jericho Tpke', 'Syosset', 'NY', '11791', 'carvelicecream', false, true, ST_MakePoint(-73.5050, 40.7890)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Jericho', 'whole-foods-jericho-li', 'supermarket', '375 N Broadway', 'Jericho', 'NY', '11753', 'wholefoods', false, true, ST_MakePoint(-73.5371, 40.7919)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Westbury', 'trader-joes-westbury-li', 'supermarket', '937 Old Country Rd', 'Westbury', 'NY', '11590', 'traderjoes', false, true, ST_MakePoint(-73.5652, 40.7489)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Garden City', 'whole-foods-garden-city', 'supermarket', '740 Stewart Ave', 'Garden City', 'NY', '11530', 'wholefoods', false, true, ST_MakePoint(-73.5924, 40.7182)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Hewlett', 'trader-joes-hewlett', 'supermarket', '1280 W Broadway', 'Hewlett', 'NY', '11557', 'traderjoes', false, true, ST_MakePoint(-73.7009, 40.6358)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Port Washington', 'ralphs-italian-ices-port-washington', 'scoop_shop', '51 Main St', 'Port Washington', 'NY', '11050', 'ralphsices', false, true, ST_MakePoint(-73.6983, 40.8253)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- LONG ISLAND - Suffolk County
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Kilwins - Huntington', 'kilwins-huntington', 'scoop_shop', '309 Main St', 'Huntington', 'NY', '11743', 'kilwins', false, true, ST_MakePoint(-73.4264, 40.8695)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Milkyways Ice Cream - Huntington', 'milkyways-huntington', 'scoop_shop', '355 New York Ave', 'Huntington', 'NY', '11743', 'milkywayscerealbar', false, true, ST_MakePoint(-73.4250, 40.8690)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ben & Jerry''s - Huntington', 'ben-and-jerrys-huntington', 'scoop_shop', '315 Main St', 'Huntington', 'NY', '11743', 'benandjerrys', false, true, ST_MakePoint(-73.4262, 40.8696)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('The Ice Cream Chick', 'the-ice-cream-chick-huntington', 'scoop_shop', '311 Main St', 'Huntington', 'NY', '11743', 'theicecreamchick', false, true, ST_MakePoint(-73.4263, 40.8695)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Lic''s Northport', 'lics-northport', 'scoop_shop', '96 Main St', 'Northport', 'NY', '11768', 'licsnorthport', false, true, ST_MakePoint(-73.3430, 40.8997)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Auntie Moe''s Frozen Custard', 'auntie-moes-northport', 'scoop_shop', '42 Woodbine Ave', 'Northport', 'NY', '11768', 'auntiemoes', false, true, ST_MakePoint(-73.3470, 40.9000)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Coyle''s Ice Cream', 'coyles-lindenhurst', 'scoop_shop', '420 S Wellwood Ave', 'Lindenhurst', 'NY', '11757', 'coylesicecream', false, true, ST_MakePoint(-73.3741, 40.6726)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ice Cream Social - Bohemia', 'ice-cream-social-bohemia', 'scoop_shop', '2930 Veterans Memorial Hwy', 'Bohemia', 'NY', '11716', 'icecreamsocialli', false, true, ST_MakePoint(-73.1330, 40.7697)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Snow White & The 7 Flavors', 'snow-white-port-jefferson', 'scoop_shop', '30 Chandler Sq', 'Port Jefferson', 'NY', '11777', NULL, false, true, ST_MakePoint(-73.0655, 40.9465)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('McNulty''s Ice Cream', 'mcnultys-miller-place', 'scoop_shop', '297 North Country Rd', 'Miller Place', 'NY', '11764', 'mcnultysicecream', false, true, ST_MakePoint(-73.0020, 40.9400)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Strong Island Ice Cream', 'strong-island-ice-cream-nesconset', 'scoop_shop', '27 Smithtown Blvd', 'Nesconset', 'NY', '11767', 'strongislandicecream', false, true, ST_MakePoint(-73.1510, 40.8530)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Roxy''s Ice Cream Truck', 'roxys-ice-cream-truck-li', 'food_truck', 'Mobile - Long Island', 'Various', 'NY', '11741', 'roxysicecreamtruck', false, true, ST_MakePoint(-73.4048, 40.7282)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Katerina''s Tartufo', 'katerinas-tartufo-port-jeff', 'scoop_shop', '585 N Bicycle Path', 'Port Jefferson Station', 'NY', '11776', NULL, false, true, ST_MakePoint(-73.0570, 40.9305)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Bel Gelato - Smithtown', 'bel-gelato-smithtown', 'scoop_shop', '6 E Main St', 'Smithtown', 'NY', '11787', 'belgelato', false, true, ST_MakePoint(-73.2006, 40.8559)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Marvel Frozen Dairy - Sayville', 'marvel-frozen-dairy-sayville', 'scoop_shop', '4521 Sunrise Hwy', 'Bohemia', 'NY', '11716', 'marvelfrozendairy', false, true, ST_MakePoint(-73.1480, 40.7649)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Jim & Sons Country Store', 'jim-and-sons-country-store', 'scoop_shop', '265 New York Ave', 'Huntington', 'NY', '11743', NULL, false, true, ST_MakePoint(-73.4257, 40.8718)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Snowflake Ice Cream - Riverhead', 'snowflake-ice-cream-riverhead', 'scoop_shop', '76 Flanders Rd', 'Riverhead', 'NY', '11901', NULL, false, true, ST_MakePoint(-72.6882, 40.9168)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - Babylon', 'ralphs-italian-ices-babylon', 'scoop_shop', '132 Deer Park Ave', 'Babylon', 'NY', '11702', 'ralphsices', false, true, ST_MakePoint(-73.3252, 40.6955)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Commack', 'carvel-commack', 'scoop_shop', '6240 Jericho Tpke', 'Commack', 'NY', '11725', 'carvelicecream', false, true, ST_MakePoint(-73.2852, 40.8401)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Patchogue', 'carvel-patchogue', 'scoop_shop', '375 E Main St', 'Patchogue', 'NY', '11772', 'carvelicecream', false, true, ST_MakePoint(-72.9904, 40.7651)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Lake Grove', 'whole-foods-lake-grove', 'supermarket', '3065 Middle Country Rd', 'Lake Grove', 'NY', '11755', 'wholefoods', false, true, ST_MakePoint(-73.1175, 40.8601)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Commack', 'trader-joes-commack-li', 'supermarket', '5018 Jericho Tpke', 'Commack', 'NY', '11725', 'traderjoes', false, true, ST_MakePoint(-73.3100, 40.8445)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Plainview', 'trader-joes-plainview', 'supermarket', '425 S Oyster Bay Rd', 'Plainview', 'NY', '11803', 'traderjoes', false, true, ST_MakePoint(-73.4654, 40.7707)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Oceanside', 'trader-joes-oceanside', 'supermarket', '3418 Long Beach Rd', 'Oceanside', 'NY', '11572', 'traderjoes', false, true, ST_MakePoint(-73.6395, 40.6336)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Carvel - Islip', 'carvel-islip', 'scoop_shop', '411 Main St', 'Islip', 'NY', '11751', 'carvelicecream', false, true, ST_MakePoint(-73.2108, 40.7300)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ralph''s Italian Ices - East Northport', 'ralphs-italian-ices-east-northport', 'scoop_shop', '4225 Jericho Tpke', 'East Northport', 'NY', '11731', 'ralphsices', false, true, ST_MakePoint(-73.3192, 40.8504)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Uncle Louie G - West Islip', 'uncle-louie-g-west-islip', 'scoop_shop', '321 Montauk Hwy', 'West Islip', 'NY', '11795', 'unclelouieg', false, true, ST_MakePoint(-73.3048, 40.7075)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FARMERS MARKETS & OUTDOOR FOOD VENUES
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Grand Army Plaza Greenmarket', 'grand-army-plaza-greenmarket', 'farmers_market', 'Grand Army Plaza', 'Brooklyn', 'NY', '11238', 'grownyc', false, true, ST_MakePoint(-73.9710, 40.6733)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Smorgasburg - Prospect Park', 'smorgasburg-prospect-park', 'farmers_market', 'Breeze Hill, Prospect Park', 'Brooklyn', 'NY', '11215', 'smorgasburg', false, true, ST_MakePoint(-73.9719, 40.6602)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Brooklyn Flea & Smorgasburg - DUMBO', 'smorgasburg-dumbo', 'farmers_market', 'Manhattan Bridge Archway', 'Brooklyn', 'NY', '11201', 'smorgasburg', false, true, ST_MakePoint(-73.9895, 40.7033)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Hester Street Fair', 'hester-street-fair', 'farmers_market', 'Hester St & Essex St', 'New York', 'NY', '10002', 'hesterstreetfair', false, true, ST_MakePoint(-73.9903, 40.7167)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Rockaway Beach Boardwalk', 'rockaway-beach-boardwalk', 'farmers_market', 'Beach 86th St', 'Queens', 'NY', '11693', NULL, false, true, ST_MakePoint(-73.8150, 40.5880)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Urbanspace Vanderbilt', 'urbanspace-vanderbilt', 'farmers_market', '230 Park Ave', 'New York', 'NY', '10169', 'urbanspacenyc', false, true, ST_MakePoint(-73.9757, 40.7534)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Gotham West Market', 'gotham-west-market', 'farmers_market', '600 11th Ave', 'New York', 'NY', '10036', 'gothamwestmarket', false, true, ST_MakePoint(-73.9980, 40.7600)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Chelsea Market', 'chelsea-market', 'farmers_market', '75 9th Ave', 'New York', 'NY', '10011', 'chelseamarketny', false, true, ST_MakePoint(-74.0048, 40.7424)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Dekalb Market Hall', 'dekalb-market-hall', 'farmers_market', '445 Albee Sq W', 'Brooklyn', 'NY', '11201', 'dekalbmarkethall', false, true, ST_MakePoint(-73.9832, 40.6895)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FOOD TRUCKS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Mister Softee - Midtown', 'mister-softee-midtown', 'food_truck', 'Various Midtown Locations', 'New York', 'NY', '10019', 'mistersofteenyc', false, true, ST_MakePoint(-73.9800, 40.7580)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Mister Softee - Brooklyn', 'mister-softee-brooklyn', 'food_truck', 'Various Brooklyn Locations', 'Brooklyn', 'NY', '11201', 'mistersofteenyc', false, true, ST_MakePoint(-73.9700, 40.6900)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - Yellow Truck', 'van-leeuwen-yellow-truck', 'food_truck', 'Various NYC Locations', 'New York', 'NY', '10003', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9900, 40.7280)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Big Gay Ice Cream - Truck', 'big-gay-ice-cream-truck', 'food_truck', 'Various NYC Locations', 'New York', 'NY', '10003', 'biggayicecream', false, true, ST_MakePoint(-73.9880, 40.7310)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Coolhaus Truck', 'coolhaus-truck-nyc', 'food_truck', 'Various NYC Locations', 'New York', 'NY', '10001', 'coolhaus', false, true, ST_MakePoint(-73.9930, 40.7440)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADDITIONAL MANHATTAN SHOPS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Caffè Panna - West Village', 'caffe-panna-west-village', 'scoop_shop', '77 Christopher St', 'New York', 'NY', '10014', 'caffepanna', false, true, ST_MakePoint(-74.0025, 40.7336)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Sugar Hill Creamery - Harlem', 'sugar-hill-creamery-harlem-lenox', 'scoop_shop', '184 Lenox Ave', 'New York', 'NY', '10026', 'sugarhillcreamery', false, true, ST_MakePoint(-73.9527, 40.7987)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Jeni''s Splendid - Nolita', 'jenis-nolita', 'scoop_shop', '250 Mott St', 'New York', 'NY', '10012', 'jenisicecreams', false, true, ST_MakePoint(-73.9946, 40.7232)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Jeni''s Splendid - UES', 'jenis-ues', 'scoop_shop', '1280 Madison Ave', 'New York', 'NY', '10128', 'jenisicecreams', false, true, ST_MakePoint(-73.9560, 40.7814)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Salt & Straw - Larchmont', 'salt-straw-larchmont', 'scoop_shop', '173 E Larchmont Blvd', 'Los Angeles', 'NY', '10003', 'saltandstraw', false, true, ST_MakePoint(-73.9900, 40.7270)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Chinatown Ice Cream Factory', 'chinatown-ice-cream-factory-bayard', 'scoop_shop', '65 Bayard St', 'New York', 'NY', '10013', 'chinatownicecreamfactory', false, true, ST_MakePoint(-73.9988, 40.7155)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Insomnia Cookies - East Village', 'insomnia-cookies-east-village', 'scoop_shop', '76 E 7th St', 'New York', 'NY', '10003', 'insomniacookies', false, true, ST_MakePoint(-73.9883, 40.7273)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Insomnia Cookies - Midtown', 'insomnia-cookies-midtown', 'scoop_shop', '445 5th Ave', 'New York', 'NY', '10016', 'insomniacookies', false, true, ST_MakePoint(-73.9817, 40.7515)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Mochi Dough - East Village', 'mochi-dough-east-village', 'scoop_shop', '120 St Marks Pl', 'New York', 'NY', '10009', 'mochidough', false, true, ST_MakePoint(-73.9839, 40.7276)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Snowdays - UES', 'snowdays-ues', 'scoop_shop', '241 E 86th St', 'New York', 'NY', '10028', 'snowdaysnyc', false, true, ST_MakePoint(-73.9518, 40.7788)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Snowdays - West Village', 'snowdays-west-village', 'scoop_shop', '241 Sullivan St', 'New York', 'NY', '10012', 'snowdaysnyc', false, true, ST_MakePoint(-73.9993, 40.7303)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Cones - West Village', 'cones-west-village', 'scoop_shop', '272 Bleecker St', 'New York', 'NY', '10014', 'conesnyc', false, true, ST_MakePoint(-74.0031, 40.7316)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Amorino Gelato - Greenwich Village', 'amorino-gelato-greenwich', 'scoop_shop', '60 University Pl', 'New York', 'NY', '10003', 'amorinogelato', false, true, ST_MakePoint(-73.9938, 40.7330)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Amorino Gelato - UWS', 'amorino-gelato-uws', 'scoop_shop', '271 Amsterdam Ave', 'New York', 'NY', '10023', 'amorinogelato', false, true, ST_MakePoint(-73.9805, 40.7777)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('10Below Ice Cream', '10below-ice-cream-chinatown', 'scoop_shop', '132 Allen St', 'New York', 'NY', '10002', '10belowicecream', false, true, ST_MakePoint(-73.9892, 40.7189)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Egger''s Ice Cream - St. George', 'eggers-st-george', 'scoop_shop', '75 Richmond Terrace', 'Staten Island', 'NY', '10301', 'eggersicecream', false, true, ST_MakePoint(-74.0770, 40.6434)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADDITIONAL BROOKLYN SHOPS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - Brooklyn Bridge Park', 'ample-hills-brooklyn-bridge-park', 'scoop_shop', '305 Furman St', 'Brooklyn', 'NY', '11201', 'amplehills', true, true, ST_MakePoint(-73.9981, 40.6968)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Leeuwen - North Williamsburg', 'van-leeuwen-north-williamsburg', 'scoop_shop', '620 Manhattan Ave', 'Brooklyn', 'NY', '11222', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9540, 40.7268)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('OddFellows - Brooklyn Heights', 'oddfellows-brooklyn-heights', 'scoop_shop', '128 Atlantic Ave', 'Brooklyn', 'NY', '11201', 'oddfellowsnyc', true, true, ST_MakePoint(-73.9914, 40.6865)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ample Hills - Park Slope', 'ample-hills-park-slope', 'scoop_shop', '267 5th Ave', 'Brooklyn', 'NY', '11215', 'amplehills', true, true, ST_MakePoint(-73.9817, 40.6737)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Brooklyn Bell Cafe', 'brooklyn-bell-cafe-clinton-hill', 'scoop_shop', '149 Greene Ave', 'Brooklyn', 'NY', '11238', 'brooklynbellcafe', false, true, ST_MakePoint(-73.9676, 40.6870)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Davey''s Ice Cream - Williamsburg', 'daveys-williamsburg', 'scoop_shop', '35 Driggs Ave', 'Brooklyn', 'NY', '11222', 'daveysicecream', false, true, ST_MakePoint(-73.9514, 40.7188)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Culture: An Ice Cream Bar', 'culture-ice-cream-greenpoint', 'scoop_shop', '253 Franklin St', 'Brooklyn', 'NY', '11222', 'culturenyc', false, true, ST_MakePoint(-73.9576, 40.7248)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Cream Co. Meats + Ice Cream', 'cream-co-bay-ridge', 'scoop_shop', '7410 3rd Ave', 'Brooklyn', 'NY', '11209', 'creamcobrooklyn', false, true, ST_MakePoint(-74.0277, 40.6322)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Soft Swerve - Williamsburg', 'soft-swerve-williamsburg', 'scoop_shop', '202 Bedford Ave', 'Brooklyn', 'NY', '11249', 'softswerve', false, true, ST_MakePoint(-73.9587, 40.7136)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADDITIONAL RESTAURANTS SERVING ICE CREAM
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Black Tap - SoHo', 'black-tap-soho', 'restaurant', '529 Broome St', 'New York', 'NY', '10013', 'blacktapnyc', false, true, ST_MakePoint(-74.0030, 40.7236)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Momofuku Milk Bar - West Village', 'milk-bar-west-village', 'restaurant', '74 Christopher St', 'New York', 'NY', '10014', 'milkbarstore', false, true, ST_MakePoint(-74.0023, 40.7336)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Momofuku Milk Bar - UWS', 'milk-bar-uws', 'restaurant', '561 Columbus Ave', 'New York', 'NY', '10024', 'milkbarstore', false, true, ST_MakePoint(-73.9727, 40.7902)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Peter Pan Donut & Pastry Shop', 'peter-pan-donut-greenpoint', 'restaurant', '727 Manhattan Ave', 'Brooklyn', 'NY', '11222', 'peterpandonuts', false, true, ST_MakePoint(-73.9530, 40.7300)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ferrara Bakery & Cafe', 'ferrara-bakery-little-italy', 'restaurant', '195 Grand St', 'New York', 'NY', '10013', 'ferraranyc', false, true, ST_MakePoint(-73.9967, 40.7187)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Tom''s Restaurant - Prospect Heights', 'toms-restaurant-prospect-heights', 'restaurant', '782 Washington Ave', 'Brooklyn', 'NY', '11238', 'tomsbrooklyn', false, true, ST_MakePoint(-73.9647, 40.6729)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Lexington Candy Shop', 'lexington-candy-shop-ues', 'restaurant', '1226 Lexington Ave', 'New York', 'NY', '10028', 'lexingtoncandyshop', false, true, ST_MakePoint(-73.9579, 40.7784)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Eddie''s Sweet Shop - Forest Hills', 'eddies-sweet-shop-forest-hills', 'restaurant', '105-29 Metropolitan Ave', 'Forest Hills', 'NY', '11375', NULL, false, true, ST_MakePoint(-73.8462, 40.7134)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADDITIONAL SUPERMARKETS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Upper East Side', 'whole-foods-ues', 'supermarket', '1551 3rd Ave', 'New York', 'NY', '10128', 'wholefoods', false, true, ST_MakePoint(-73.9510, 40.7806)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Brooklyn (Flatbush)', 'trader-joes-flatbush', 'supermarket', '1521 Cortelyou Rd', 'Brooklyn', 'NY', '11226', 'traderjoes', false, true, ST_MakePoint(-73.9626, 40.6397)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Whole Foods - Fort Greene', 'whole-foods-fort-greene', 'supermarket', '365 Atlantic Ave', 'Brooklyn', 'NY', '11217', 'wholefoods', false, true, ST_MakePoint(-73.9786, 40.6862)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Trader Joe''s - Wine Shop', 'trader-joes-wine-shop-uws', 'supermarket', '1878 Broadway', 'New York', 'NY', '10023', 'traderjoes', false, true, ST_MakePoint(-73.9824, 40.7747)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ADDITIONAL LONG ISLAND SCOOP SHOPS
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Handel''s Homemade - Roslyn', 'handels-roslyn-li', 'scoop_shop', '1025 Northern Blvd', 'Roslyn', 'NY', '11576', 'handels', false, true, ST_MakePoint(-73.6533, 40.7924)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Main Street Sweets', 'main-street-sweets-cold-spring-harbor', 'scoop_shop', '27 Main St', 'Cold Spring Harbor', 'NY', '11724', NULL, false, true, ST_MakePoint(-73.4569, 40.8715)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Magic Fountain - Mattituck', 'magic-fountain-mattituck-li', 'scoop_shop', '9825 Main Rd', 'Mattituck', 'NY', '11952', NULL, false, true, ST_MakePoint(-72.5335, 40.9913)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Sip''N Soda - Southampton', 'sip-n-soda-southampton-li', 'scoop_shop', '40 Hampton Rd', 'Southampton', 'NY', '11968', NULL, false, true, ST_MakePoint(-72.3907, 40.8847)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Fudge Company - Huntington', 'fudge-company-huntington-li', 'scoop_shop', '67 Wall St', 'Huntington', 'NY', '11743', NULL, false, true, ST_MakePoint(-73.4270, 40.8689)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Bald Hill Farmstand', 'bald-hill-farmstand-calverton', 'scoop_shop', '2397 Route 25', 'Calverton', 'NY', '11933', NULL, false, true, ST_MakePoint(-72.7457, 40.9058)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Country Corner Cafe & Creamery', 'country-corner-east-quogue', 'scoop_shop', '30 Montauk Hwy', 'East Quogue', 'NY', '11942', NULL, false, true, ST_MakePoint(-72.5815, 40.8435)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Stutzman''s Farm Store', 'stutzmans-farm-store-moriches', 'scoop_shop', '218 Frowein Rd', 'Center Moriches', 'NY', '11934', NULL, false, true, ST_MakePoint(-72.7895, 40.8000)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Maple Tree Ice Cream - Southold', 'maple-tree-ice-cream-southold', 'scoop_shop', '43695 County Road 48', 'Southold', 'NY', '11971', NULL, false, true, ST_MakePoint(-72.4266, 41.0638)::geography)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Bridge Lane Ice Cream - Bridgehampton', 'bridge-lane-ice-cream-bridgehampton', 'scoop_shop', '2428 Montauk Hwy', 'Bridgehampton', 'NY', '11932', NULL, false, true, ST_MakePoint(-72.3064, 40.9370)::geography)
ON CONFLICT (slug) DO NOTHING;


-- ============================================
-- VERIFY COUNT
-- ============================================
-- SELECT count(*) FROM locations;
-- Expected: original seed (~60) + this file (~200+) = ~260+ locations
