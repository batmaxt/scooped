('Journal Square Ice Cream', 'journal-square-ice-cream', 'scoop_shop', '2943 Kennedy Blvd', 'Jersey City', 'NJ', '07306', NULL, false, true, ST_MakePoint(-74.0634, 40.7326)::geography),
('Acme - Hoboken', 'acme-hoboken', 'supermarket', '614 Clinton St', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0359, 40.7448)::geography),
('Hamilton Ice Cream', 'hamilton-ice-cream-jc', 'scoop_shop', '923 Park Ave', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0338, 40.7456)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - NEWARK / EAST ORANGE (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Ironbound Ice Cream', 'ironbound-ice-cream', 'scoop_shop', '200 Ferry St', 'Newark', 'NJ', '07105', NULL, false, true, ST_MakePoint(-74.1514, 40.7295)::geography),
('Nana''s Creamery Newark', 'nanas-creamery-newark', 'scoop_shop', '710 Broad St', 'Newark', 'NJ', '07102', NULL, false, true, ST_MakePoint(-74.1709, 40.7363)::geography),
('Ferry Street Gelato', 'ferry-street-gelato', 'scoop_shop', '381 Ferry St', 'Newark', 'NJ', '07105', NULL, false, true, ST_MakePoint(-74.1463, 40.7270)::geography),
('Branch Brook Creamery', 'branch-brook-creamery', 'scoop_shop', '381 Lake St', 'Newark', 'NJ', '07104', NULL, false, true, ST_MakePoint(-74.1675, 40.7593)::geography),
('Dairy Queen - Newark', 'dairy-queen-newark', 'scoop_shop', '220 McCarter Hwy', 'Newark', 'NJ', '07104', NULL, false, true, ST_MakePoint(-74.1612, 40.7441)::geography),
('East Orange Cones', 'east-orange-cones', 'scoop_shop', '575 Main St', 'East Orange', 'NJ', '07018', NULL, false, true, ST_MakePoint(-74.2090, 40.7680)::geography),
('Brick Church Ice Cream', 'brick-church-ice-cream', 'scoop_shop', '30 Halsted St', 'East Orange', 'NJ', '07018', NULL, false, true, ST_MakePoint(-74.2138, 40.7637)::geography),
('Bloomfield Freeze', 'bloomfield-freeze', 'scoop_shop', '255 Bloomfield Ave', 'Bloomfield', 'NJ', '07003', NULL, false, true, ST_MakePoint(-74.1875, 40.8080)::geography),
('Belleville Creamery', 'belleville-creamery', 'scoop_shop', '365 Washington Ave', 'Belleville', 'NJ', '07109', NULL, false, true, ST_MakePoint(-74.1557, 40.7936)::geography),
('ShopRite - Newark', 'shoprite-newark', 'supermarket', '180 Dr MLK Jr Blvd', 'Newark', 'NJ', '07102', NULL, false, true, ST_MakePoint(-74.1719, 40.7387)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - BERGEN COUNTY (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Baumgart''s Ice Cream - Englewood', 'baumgarts-englewood', 'restaurant', '45 E Palisade Ave', 'Englewood', 'NJ', '07631', NULL, false, true, ST_MakePoint(-73.9730, 40.8928)::geography),
('Cold Stone - Paramus', 'cold-stone-paramus', 'scoop_shop', '700 NJ-17', 'Paramus', 'NJ', '07652', NULL, false, true, ST_MakePoint(-74.0813, 40.9445)::geography),
('Van Dyk''s Ice Cream - Ridgewood', 'van-dyks-ridgewood', 'scoop_shop', '155 E Ridgewood Ave', 'Ridgewood', 'NJ', '07450', NULL, true, true, ST_MakePoint(-74.0950, 40.9796)::geography),
('Raymond''s Creamery - Hackensack', 'raymonds-hackensack', 'scoop_shop', '142 Main St', 'Hackensack', 'NJ', '07601', NULL, false, true, ST_MakePoint(-74.0437, 40.8839)::geography),
('Bergen Scoops', 'bergen-scoops-teaneck', 'scoop_shop', '470 Cedar Ln', 'Teaneck', 'NJ', '07666', NULL, false, true, ST_MakePoint(-74.0058, 40.8950)::geography),
('Baskin-Robbins - Fort Lee', 'baskin-robbins-fort-lee', 'scoop_shop', '1600 Lemoine Ave', 'Fort Lee', 'NJ', '07024', NULL, false, true, ST_MakePoint(-73.9743, 40.8496)::geography),
('Edgewater Creamery', 'edgewater-creamery', 'scoop_shop', '725 River Rd', 'Edgewater', 'NJ', '07020', NULL, false, true, ST_MakePoint(-73.9737, 40.8260)::geography),
('Ben & Jerry''s - Paramus Park', 'ben-jerrys-paramus-park', 'scoop_shop', '700 Paramus Park Mall', 'Paramus', 'NJ', '07652', NULL, false, true, ST_MakePoint(-74.0749, 40.9574)::geography),
('The Sweet Spot - Closter', 'sweet-spot-closter', 'scoop_shop', '165 Closter Dock Rd', 'Closter', 'NJ', '07624', NULL, false, true, ST_MakePoint(-73.9603, 40.9742)::geography),
('Dumont Scoops', 'dumont-scoops', 'scoop_shop', '71 Washington Ave', 'Dumont', 'NJ', '07628', NULL, false, true, ST_MakePoint(-73.9893, 40.9432)::geography),
('New Milford Creamery', 'new-milford-creamery', 'scoop_shop', '268 River Rd', 'New Milford', 'NJ', '07646', NULL, false, true, ST_MakePoint(-74.0213, 40.9346)::geography),
('Fair Lawn Cones', 'fair-lawn-cones', 'scoop_shop', '23-11 Broadway', 'Fair Lawn', 'NJ', '07410', NULL, false, true, ST_MakePoint(-74.1106, 40.9375)::geography),
('Haworth Creamery', 'haworth-creamery', 'scoop_shop', '165 Haworth Ave', 'Haworth', 'NJ', '07641', NULL, false, true, ST_MakePoint(-73.9888, 40.9618)::geography),
('Whole Foods - Edgewater', 'whole-foods-edgewater', 'supermarket', '905 River Rd', 'Edgewater', 'NJ', '07020', NULL, false, true, ST_MakePoint(-73.9741, 40.8310)::geography),
('Trader Joe''s - Paramus', 'trader-joes-paramus', 'supermarket', '240 NJ-4', 'Paramus', 'NJ', '07652', NULL, false, true, ST_MakePoint(-74.0762, 40.9188)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - ESSEX COUNTY (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Van Dyk''s - Montclair', 'van-dyks-montclair', 'scoop_shop', '585 Valley Rd', 'Upper Montclair', 'NJ', '07043', NULL, true, true, ST_MakePoint(-74.2004, 40.8459)::geography),
('Applegate Farm Ice Cream', 'applegate-farm-montclair', 'scoop_shop', '616 Grove St', 'Montclair', 'NJ', '07042', 'applegatefarm', true, true, ST_MakePoint(-74.2084, 40.8200)::geography),
('South Orange Scoops', 'south-orange-scoops', 'scoop_shop', '10 Sloan St', 'South Orange', 'NJ', '07079', NULL, false, true, ST_MakePoint(-74.2585, 40.7493)::geography),
('Maplewood Creamery', 'maplewood-creamery', 'scoop_shop', '160 Maplewood Ave', 'Maplewood', 'NJ', '07040', NULL, false, true, ST_MakePoint(-74.2731, 40.7330)::geography),
('Livingston Licks', 'livingston-licks', 'scoop_shop', '401 S Livingston Ave', 'Livingston', 'NJ', '07039', NULL, false, true, ST_MakePoint(-74.3297, 40.7782)::geography),
('Cold Stone - Livingston', 'cold-stone-livingston', 'scoop_shop', '279 Eisenhower Pkwy', 'Livingston', 'NJ', '07039', NULL, false, true, ST_MakePoint(-74.3244, 40.7819)::geography),
('West Orange Whip', 'west-orange-whip', 'scoop_shop', '545 Northfield Ave', 'West Orange', 'NJ', '07052', NULL, false, true, ST_MakePoint(-74.2564, 40.7719)::geography),
('Nutley Frozen Delights', 'nutley-frozen-delights', 'scoop_shop', '440 Franklin Ave', 'Nutley', 'NJ', '07110', NULL, false, true, ST_MakePoint(-74.1601, 40.8215)::geography),
('Glen Ridge Gelato', 'glen-ridge-gelato', 'scoop_shop', '220 Ridgewood Ave', 'Glen Ridge', 'NJ', '07028', NULL, false, true, ST_MakePoint(-74.2046, 40.8048)::geography),
('Cedar Grove Cones', 'cedar-grove-cones', 'scoop_shop', '478 Pompton Ave', 'Cedar Grove', 'NJ', '07009', NULL, false, true, ST_MakePoint(-74.2312, 40.8577)::geography),
('Caldwell Creamery', 'caldwell-creamery', 'scoop_shop', '256 Bloomfield Ave', 'Caldwell', 'NJ', '07006', NULL, false, true, ST_MakePoint(-74.2772, 40.8396)::geography),
('Millburn Gelato Bar', 'millburn-gelato-bar', 'scoop_shop', '326 Millburn Ave', 'Millburn', 'NJ', '07041', NULL, false, true, ST_MakePoint(-74.3066, 40.7258)::geography),
('Short Hills Scoops', 'short-hills-scoops', 'scoop_shop', '1200 Morris Tpke', 'Short Hills', 'NJ', '07078', NULL, false, true, ST_MakePoint(-74.3265, 40.7352)::geography),
('Whole Foods - Montclair', 'whole-foods-montclair', 'supermarket', '48 S Park St', 'Montclair', 'NJ', '07042', NULL, false, true, ST_MakePoint(-74.2088, 40.8122)::geography),
('ShopRite - Livingston', 'shoprite-livingston', 'supermarket', '262 E Northfield Rd', 'Livingston', 'NJ', '07039', NULL, false, true, ST_MakePoint(-74.3052, 40.7854)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - MONMOUTH COUNTY (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Red Bank Ice Cream', 'red-bank-ice-cream', 'scoop_shop', '6 Broad St', 'Red Bank', 'NJ', '07701', NULL, false, true, ST_MakePoint(-74.0770, 40.3471)::geography),
('Asbury Park Creamery', 'asbury-park-creamery', 'scoop_shop', '527 Cookman Ave', 'Asbury Park', 'NJ', '07712', NULL, true, true, ST_MakePoint(-74.0026, 40.2207)::geography),
('Cookman Cones', 'cookman-cones', 'scoop_shop', '628 Cookman Ave', 'Asbury Park', 'NJ', '07712', NULL, false, true, ST_MakePoint(-74.0019, 40.2203)::geography),
('Long Branch Creamery', 'long-branch-creamery', 'scoop_shop', '250 Broadway', 'Long Branch', 'NJ', '07740', NULL, false, true, ST_MakePoint(-73.9928, 40.2978)::geography),
('Pier Village Gelato', 'pier-village-gelato', 'scoop_shop', '5 Chelsea Ave', 'Long Branch', 'NJ', '07740', NULL, false, true, ST_MakePoint(-73.9808, 40.2866)::geography),
('Freehold Freeze', 'freehold-freeze', 'scoop_shop', '63 W Main St', 'Freehold', 'NJ', '07728', NULL, false, true, ST_MakePoint(-74.2773, 40.2601)::geography),
('Jersey Shore Scoops', 'jersey-shore-scoops', 'scoop_shop', '1201 Ocean Ave', 'Belmar', 'NJ', '07719', NULL, false, true, ST_MakePoint(-74.0145, 40.1752)::geography),
('Cold Stone - Red Bank', 'cold-stone-red-bank', 'scoop_shop', '1 Broad St', 'Red Bank', 'NJ', '07701', NULL, false, true, ST_MakePoint(-74.0737, 40.3475)::geography),
('Spring Lake Creamery', 'spring-lake-creamery', 'scoop_shop', '1205 3rd Ave', 'Spring Lake', 'NJ', '07762', NULL, false, true, ST_MakePoint(-74.0286, 40.1535)::geography),
('Colts Neck Ice Cream', 'colts-neck-ice-cream', 'scoop_shop', '730 NJ-34', 'Colts Neck', 'NJ', '07722', NULL, false, true, ST_MakePoint(-74.1711, 40.2971)::geography),
('Middletown Creamery', 'middletown-creamery-nj', 'scoop_shop', '1300 NJ-35', 'Middletown', 'NJ', '07748', NULL, false, true, ST_MakePoint(-74.0805, 40.3911)::geography),
('Holmdel Cones', 'holmdel-cones', 'scoop_shop', '2132 NJ-35', 'Holmdel', 'NJ', '07733', NULL, false, true, ST_MakePoint(-74.1710, 40.3855)::geography),
('Rita''s - Freehold', 'ritas-freehold-nj', 'scoop_shop', '215 Jackson Mills Rd', 'Freehold', 'NJ', '07728', NULL, false, true, ST_MakePoint(-74.2611, 40.2538)::geography),
('Whole Foods - Red Bank', 'whole-foods-red-bank', 'supermarket', '202 Navesink River Rd', 'Red Bank', 'NJ', '07701', NULL, false, true, ST_MakePoint(-74.0658, 40.3503)::geography),
('Stop & Shop - Freehold', 'stop-shop-freehold', 'supermarket', '310 W Main St', 'Freehold', 'NJ', '07728', NULL, false, true, ST_MakePoint(-74.2838, 40.2593)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - OCEAN COUNTY (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Point Pleasant Beach Creamery', 'point-pleasant-beach-creamery', 'scoop_shop', '613 Arnold Ave', 'Point Pleasant Beach', 'NJ', '08742', NULL, true, true, ST_MakePoint(-74.0466, 40.0862)::geography),
('Jenkinson''s Ice Cream', 'jenkinsons-ice-cream', 'scoop_shop', '300 Ocean Ave', 'Point Pleasant Beach', 'NJ', '08742', NULL, false, true, ST_MakePoint(-74.0420, 40.0837)::geography),
('Seaside Heights Cones', 'seaside-heights-cones', 'scoop_shop', '800 Ocean Ter', 'Seaside Heights', 'NJ', '08751', NULL, false, true, ST_MakePoint(-73.9434, 39.9442)::geography),
('Toms River Creamery', 'toms-river-creamery', 'scoop_shop', '1883 Hooper Ave', 'Toms River', 'NJ', '08753', NULL, false, true, ST_MakePoint(-74.1419, 39.9897)::geography),
('Brick Freeze', 'brick-freeze-nj', 'scoop_shop', '537 Mantoloking Rd', 'Brick', 'NJ', '08723', NULL, false, true, ST_MakePoint(-74.1188, 40.0525)::geography),
('Baskin-Robbins - Toms River', 'baskin-robbins-toms-river', 'scoop_shop', '860 Fischer Blvd', 'Toms River', 'NJ', '08753', NULL, false, true, ST_MakePoint(-74.1311, 39.9830)::geography),
('Carvel - Brick', 'carvel-brick-nj', 'scoop_shop', '258 Chambers Bridge Rd', 'Brick', 'NJ', '08723', NULL, false, true, ST_MakePoint(-74.1237, 40.0680)::geography),
('Lavallette Creamery', 'lavallette-creamery', 'scoop_shop', '301 Grand Central Ave', 'Lavallette', 'NJ', '08735', NULL, false, true, ST_MakePoint(-74.0700, 39.9700)::geography),
('Lacey Township Scoops', 'lacey-township-scoops', 'scoop_shop', '614 Lacey Rd', 'Forked River', 'NJ', '08731', NULL, false, true, ST_MakePoint(-74.1877, 39.8394)::geography),
('ShopRite - Toms River', 'shoprite-toms-river', 'supermarket', '956 NJ-166', 'Toms River', 'NJ', '08753', NULL, false, true, ST_MakePoint(-74.1665, 39.9958)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - MORRIS COUNTY (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Morristown Creamery', 'morristown-creamery', 'scoop_shop', '50 South St', 'Morristown', 'NJ', '07960', NULL, true, true, ST_MakePoint(-74.4797, 40.7964)::geography),
('Cold Stone - Morristown', 'cold-stone-morristown', 'scoop_shop', '15 South St', 'Morristown', 'NJ', '07960', NULL, false, true, ST_MakePoint(-74.4773, 40.7971)::geography),
('Madison Gelato', 'madison-gelato-nj', 'scoop_shop', '55 Main St', 'Madison', 'NJ', '07940', NULL, false, true, ST_MakePoint(-74.4170, 40.7599)::geography),
('Parsippany Freeze', 'parsippany-freeze', 'scoop_shop', '907 NJ-10', 'Parsippany', 'NJ', '07054', NULL, false, true, ST_MakePoint(-74.4151, 40.8558)::geography),
('Chester Creamery', 'chester-creamery-nj', 'scoop_shop', '124 Main St', 'Chester', 'NJ', '07930', NULL, false, true, ST_MakePoint(-74.6946, 40.7839)::geography),
('Chatham Cones', 'chatham-cones-nj', 'scoop_shop', '24 Watchung Ave', 'Chatham', 'NJ', '07928', NULL, false, true, ST_MakePoint(-74.3843, 40.7407)::geography),
('Denville Dairy', 'denville-dairy-nj', 'scoop_shop', '63 Broadway', 'Denville', 'NJ', '07834', NULL, false, true, ST_MakePoint(-74.4773, 40.8919)::geography),
('Boonton Scoops', 'boonton-scoops-nj', 'scoop_shop', '601 Main St', 'Boonton', 'NJ', '07005', NULL, false, true, ST_MakePoint(-74.4074, 40.9040)::geography),
('Rita''s - Parsippany', 'ritas-parsippany', 'scoop_shop', '753 US-46', 'Parsippany', 'NJ', '07054', NULL, false, true, ST_MakePoint(-74.3970, 40.8631)::geography),
('Whole Foods - Morristown', 'whole-foods-morristown', 'supermarket', '171 Morris St', 'Morristown', 'NJ', '07960', NULL, false, true, ST_MakePoint(-74.4749, 40.7946)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - MORE NJ (25)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Fort Lee Frozen Treats', 'fort-lee-frozen-treats', 'scoop_shop', '1590 Palisade Ave', 'Fort Lee', 'NJ', '07024', NULL, false, true, ST_MakePoint(-73.9690, 40.8510)::geography),
('Palisade Creamery', 'palisade-creamery', 'scoop_shop', '2160 N Central Rd', 'Fort Lee', 'NJ', '07024', NULL, false, true, ST_MakePoint(-73.9700, 40.8582)::geography),
('Cliffside Park Gelato', 'cliffside-park-gelato', 'scoop_shop', '612 Anderson Ave', 'Cliffside Park', 'NJ', '07010', NULL, false, true, ST_MakePoint(-73.9876, 40.8213)::geography),
('Weehawken Whip', 'weehawken-whip', 'scoop_shop', '500 Harbor Blvd', 'Weehawken', 'NJ', '07086', NULL, false, true, ST_MakePoint(-74.0183, 40.7714)::geography),
('North Bergen Cones', 'north-bergen-cones', 'scoop_shop', '1401 78th St', 'North Bergen', 'NJ', '07047', NULL, false, true, ST_MakePoint(-74.0175, 40.7994)::geography),
('Summit Scoops', 'summit-scoops-nj', 'scoop_shop', '51 Union Pl', 'Summit', 'NJ', '07901', NULL, false, true, ST_MakePoint(-74.3590, 40.7158)::geography),
('Westfield Creamery', 'westfield-creamery-nj', 'scoop_shop', '118 E Broad St', 'Westfield', 'NJ', '07090', NULL, false, true, ST_MakePoint(-74.3431, 40.6591)::geography),
('Cranford Cones', 'cranford-cones-nj', 'scoop_shop', '22 North Ave', 'Cranford', 'NJ', '07016', NULL, false, true, ST_MakePoint(-74.3055, 40.6574)::geography),
('Scotch Plains Freeze', 'scotch-plains-freeze', 'scoop_shop', '1819 E 2nd St', 'Scotch Plains', 'NJ', '07076', NULL, false, true, ST_MakePoint(-74.3851, 40.6329)::geography),
('South Plainfield Ice Cream', 'south-plainfield-ice-cream', 'scoop_shop', '5103 Hadley Rd', 'South Plainfield', 'NJ', '07080', NULL, false, true, ST_MakePoint(-74.4116, 40.5776)::geography),
('Princeton Creamery', 'princeton-creamery', 'scoop_shop', '32 Nassau St', 'Princeton', 'NJ', '08542', NULL, true, true, ST_MakePoint(-74.6592, 40.3497)::geography),
('Bent Spoon', 'bent-spoon-princeton', 'scoop_shop', '35 Palmer Sq W', 'Princeton', 'NJ', '08542', 'thebentspoon', true, true, ST_MakePoint(-74.6599, 40.3505)::geography),
('Thomas Sweet - Princeton', 'thomas-sweet-princeton', 'scoop_shop', '179 Nassau St', 'Princeton', 'NJ', '08542', NULL, true, true, ST_MakePoint(-74.6578, 40.3530)::geography),
('New Brunswick Ice Cream', 'new-brunswick-ice-cream', 'scoop_shop', '51 Paterson St', 'New Brunswick', 'NJ', '08901', NULL, false, true, ST_MakePoint(-74.4460, 40.4976)::geography),
('Somerville Scoops', 'somerville-scoops', 'scoop_shop', '18 Division St', 'Somerville', 'NJ', '08876', NULL, false, true, ST_MakePoint(-74.6100, 40.5740)::geography),
('Cherry Hill Creamery', 'cherry-hill-creamery', 'scoop_shop', '2000 NJ-38', 'Cherry Hill', 'NJ', '08002', NULL, false, true, ST_MakePoint(-74.9583, 39.9343)::geography),
('Haddonfield Freeze', 'haddonfield-freeze', 'scoop_shop', '106 Kings Hwy E', 'Haddonfield', 'NJ', '08033', NULL, false, true, ST_MakePoint(-75.0364, 39.8915)::geography),
('Cape May Creamery', 'cape-may-creamery', 'scoop_shop', '315 Washington St', 'Cape May', 'NJ', '08204', NULL, true, true, ST_MakePoint(-74.9060, 38.9351)::geography),
('Asbury Boardwalk Ice Cream', 'asbury-boardwalk-ice-cream', 'scoop_shop', '1 Ocean Ave', 'Asbury Park', 'NJ', '07712', NULL, false, true, ST_MakePoint(-73.9972, 40.2194)::geography),
('Spring Lake Heights Cones', 'spring-lake-heights-cones', 'scoop_shop', '601 NJ-71', 'Spring Lake Heights', 'NJ', '07762', NULL, false, true, ST_MakePoint(-74.0313, 40.1487)::geography),
('Bayonne Creamery', 'bayonne-creamery', 'scoop_shop', '525 Broadway', 'Bayonne', 'NJ', '07002', NULL, false, true, ST_MakePoint(-74.1106, 40.6674)::geography),
('Union City Helados', 'union-city-helados', 'scoop_shop', '3815 Bergenline Ave', 'Union City', 'NJ', '07087', NULL, false, true, ST_MakePoint(-74.0236, 40.7704)::geography),
('Secaucus Scoops', 'secaucus-scoops', 'scoop_shop', '700 Plaza Dr', 'Secaucus', 'NJ', '07094', NULL, false, true, ST_MakePoint(-74.0567, 40.7844)::geography),
('Keansburg Cones', 'keansburg-cones', 'scoop_shop', '275 Beachway Ave', 'Keansburg', 'NJ', '07734', NULL, false, true, ST_MakePoint(-74.1307, 40.4418)::geography),
('Keyport Ice Cream', 'keyport-ice-cream', 'scoop_shop', '80 W Front St', 'Keyport', 'NJ', '07735', NULL, false, true, ST_MakePoint(-74.1995, 40.4365)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - STAMFORD / GREENWICH (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Moo Scoops - Stamford', 'moo-scoops-stamford', 'scoop_shop', '124 Bedford St', 'Stamford', 'CT', '06901', NULL, false, true, ST_MakePoint(-73.5393, 41.0534)::geography),
('Harbor Point Creamery', 'harbor-point-creamery', 'scoop_shop', '201 Harbor Point Blvd', 'Stamford', 'CT', '06902', NULL, false, true, ST_MakePoint(-73.5405, 41.0452)::geography),
('Cold Stone - Stamford', 'cold-stone-stamford', 'scoop_shop', '230 Tresser Blvd', 'Stamford', 'CT', '06901', NULL, false, true, ST_MakePoint(-73.5408, 41.0519)::geography),
('Greenwich Gelato', 'greenwich-gelato', 'scoop_shop', '354 Greenwich Ave', 'Greenwich', 'CT', '06830', NULL, true, true, ST_MakePoint(-73.6268, 41.0286)::geography),
('Avenue Scoops', 'avenue-scoops-greenwich', 'scoop_shop', '51 W Putnam Ave', 'Greenwich', 'CT', '06830', NULL, false, true, ST_MakePoint(-73.6296, 41.0291)::geography),
('SoNo Scoop Shop', 'sono-scoop-shop', 'scoop_shop', '85 Washington St', 'South Norwalk', 'CT', '06854', NULL, false, true, ST_MakePoint(-73.4168, 41.0956)::geography),
('Cos Cob Creamery', 'cos-cob-creamery', 'scoop_shop', '139 E Putnam Ave', 'Cos Cob', 'CT', '06807', NULL, false, true, ST_MakePoint(-73.5986, 41.0337)::geography),
('Byram Cones', 'byram-cones', 'scoop_shop', '381 Delavan Ave', 'Greenwich', 'CT', '06830', NULL, false, true, ST_MakePoint(-73.6634, 41.0047)::geography),
('Old Greenwich Gelato', 'old-greenwich-gelato', 'scoop_shop', '131 Sound Beach Ave', 'Old Greenwich', 'CT', '06870', NULL, false, true, ST_MakePoint(-73.5667, 41.0313)::geography),
('Baskin-Robbins - Stamford', 'baskin-robbins-stamford', 'scoop_shop', '945 High Ridge Rd', 'Stamford', 'CT', '06905', NULL, false, true, ST_MakePoint(-73.5574, 41.0829)::geography),
('Whole Foods - Greenwich', 'whole-foods-greenwich', 'supermarket', '90 E Putnam Ave', 'Greenwich', 'CT', '06830', NULL, false, true, ST_MakePoint(-73.6169, 41.0350)::geography),
('Trader Joe''s - Stamford', 'trader-joes-stamford', 'supermarket', '2100 Summer St', 'Stamford', 'CT', '06905', NULL, false, true, ST_MakePoint(-73.5411, 41.0729)::geography),
('Darien Creamery', 'darien-creamery', 'scoop_shop', '1063 Post Rd', 'Darien', 'CT', '06820', NULL, false, true, ST_MakePoint(-73.4693, 41.0776)::geography),
('Riverside Scoops', 'riverside-scoops-ct', 'scoop_shop', '1190 E Putnam Ave', 'Riverside', 'CT', '06878', NULL, false, true, ST_MakePoint(-73.5783, 41.0357)::geography),
('Port Chester Pops', 'port-chester-pops', 'scoop_shop', '150 N Main St', 'Port Chester', 'NY', '10573', NULL, false, true, ST_MakePoint(-73.6654, 41.0021)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - NEW HAVEN (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Arethusa Farm Dairy', 'arethusa-farm-new-haven', 'scoop_shop', '1000 Chapel St', 'New Haven', 'CT', '06510', 'arethusafarm', true, true, ST_MakePoint(-72.9309, 41.3067)::geography),
('Ashley''s Ice Cream - New Haven', 'ashleys-ice-cream-new-haven', 'scoop_shop', '280 York St', 'New Haven', 'CT', '06511', NULL, true, true, ST_MakePoint(-72.9304, 41.3089)::geography),
