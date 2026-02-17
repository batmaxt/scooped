('Milkcraft - New Haven', 'milkcraft-new-haven', 'scoop_shop', '135 Whitney Ave', 'New Haven', 'CT', '06510', 'milkcraftct', true, true, ST_MakePoint(-72.9207, 41.3106)::geography),
('Insomnia Cookies Ice Cream', 'insomnia-cookies-new-haven', 'scoop_shop', '259 Crown St', 'New Haven', 'CT', '06510', NULL, false, true, ST_MakePoint(-72.9300, 41.3058)::geography),
('Chapel Creamery', 'chapel-creamery-nh', 'scoop_shop', '1127 Chapel St', 'New Haven', 'CT', '06510', NULL, false, true, ST_MakePoint(-72.9339, 41.3071)::geography),
('Yale Scoops', 'yale-scoops', 'scoop_shop', '309 Elm St', 'New Haven', 'CT', '06511', NULL, false, true, ST_MakePoint(-72.9289, 41.3102)::geography),
('Wooster Square Gelato', 'wooster-square-gelato', 'scoop_shop', '77 Court St', 'New Haven', 'CT', '06511', NULL, false, true, ST_MakePoint(-72.9182, 41.3032)::geography),
('East Rock Creamery', 'east-rock-creamery', 'scoop_shop', '809 Orange St', 'New Haven', 'CT', '06510', NULL, false, true, ST_MakePoint(-72.9127, 41.3187)::geography),
('Westville Ice Cream', 'westville-ice-cream', 'scoop_shop', '927 Whalley Ave', 'New Haven', 'CT', '06515', NULL, false, true, ST_MakePoint(-72.9573, 41.3163)::geography),
('Hamden Scoop Shop', 'hamden-scoop-shop', 'scoop_shop', '1225 Dixwell Ave', 'Hamden', 'CT', '06514', NULL, false, true, ST_MakePoint(-72.9283, 41.3448)::geography),
('Branford Creamery', 'branford-creamery-ct', 'scoop_shop', '285 E Main St', 'Branford', 'CT', '06405', NULL, false, true, ST_MakePoint(-72.8051, 41.2774)::geography),
('Guilford Gelato', 'guilford-gelato-ct', 'scoop_shop', '77 Whitfield St', 'Guilford', 'CT', '06437', NULL, false, true, ST_MakePoint(-72.6809, 41.2780)::geography),
('North Haven Freeze', 'north-haven-freeze', 'scoop_shop', '395 Washington Ave', 'North Haven', 'CT', '06473', NULL, false, true, ST_MakePoint(-72.8567, 41.3744)::geography),
('Whole Foods - New Haven', 'whole-foods-new-haven', 'supermarket', '371 S Whitney Ave', 'New Haven', 'CT', '06511', NULL, false, true, ST_MakePoint(-72.9199, 41.3029)::geography),
('Stop & Shop - Hamden', 'stop-shop-hamden', 'supermarket', '2301 Dixwell Ave', 'Hamden', 'CT', '06514', NULL, false, true, ST_MakePoint(-72.9212, 41.3713)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - HARTFORD AREA (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Hartford Creamery', 'hartford-creamery-ct', 'scoop_shop', '170 Pratt St', 'Hartford', 'CT', '06103', NULL, false, true, ST_MakePoint(-72.6743, 41.7636)::geography),
('West Hartford Scoops', 'west-hartford-scoops', 'scoop_shop', '968 Farmington Ave', 'West Hartford', 'CT', '06107', NULL, true, true, ST_MakePoint(-72.7437, 41.7585)::geography),
('Blue Back Square Gelato', 'blue-back-square-gelato', 'scoop_shop', '65 Memorial Rd', 'West Hartford', 'CT', '06107', NULL, false, true, ST_MakePoint(-72.7448, 41.7558)::geography),
('Glastonbury Ice Cream', 'glastonbury-ice-cream', 'scoop_shop', '2500 Main St', 'Glastonbury', 'CT', '06033', NULL, false, true, ST_MakePoint(-72.5994, 41.7118)::geography),
('Avon Creamery', 'avon-creamery-ct', 'scoop_shop', '378 W Main St', 'Avon', 'CT', '06001', NULL, false, true, ST_MakePoint(-72.8465, 41.7968)::geography),
('Simsbury Scoops', 'simsbury-scoops-ct', 'scoop_shop', '700 Hopmeadow St', 'Simsbury', 'CT', '06070', NULL, false, true, ST_MakePoint(-72.8133, 41.8756)::geography),
('Farmington Valley Freeze', 'farmington-valley-freeze', 'scoop_shop', '110 Main St', 'Farmington', 'CT', '06032', NULL, false, true, ST_MakePoint(-72.8320, 41.7197)::geography),
('Newington Ice Cream', 'newington-ice-cream', 'scoop_shop', '3270 Berlin Tpke', 'Newington', 'CT', '06111', NULL, false, true, ST_MakePoint(-72.7175, 41.6772)::geography),
('Whole Foods - West Hartford', 'whole-foods-west-hartford', 'supermarket', '340 N Main St', 'West Hartford', 'CT', '06117', NULL, false, true, ST_MakePoint(-72.7513, 41.7694)::geography),
('Trader Joe''s - West Hartford', 'trader-joes-west-hartford', 'supermarket', '1489 New Britain Ave', 'West Hartford', 'CT', '06110', NULL, false, true, ST_MakePoint(-72.7583, 41.7391)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - FAIRFIELD COUNTY (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Saugatuck Sweets', 'saugatuck-sweets-westport', 'scoop_shop', '6 Riverside Ave', 'Westport', 'CT', '06880', NULL, true, true, ST_MakePoint(-73.3574, 41.1367)::geography),
('Main Street Creamery Westport', 'main-st-creamery-westport', 'scoop_shop', '379 Main Ave', 'Westport', 'CT', '06880', NULL, false, true, ST_MakePoint(-73.3555, 41.1438)::geography),
('SoNo Scoops', 'sono-scoops-norwalk', 'scoop_shop', '50 N Water St', 'South Norwalk', 'CT', '06854', NULL, false, true, ST_MakePoint(-73.4185, 41.0948)::geography),
('Danbury Creamery', 'danbury-creamery-ct', 'scoop_shop', '190 Main St', 'Danbury', 'CT', '06810', NULL, false, true, ST_MakePoint(-73.4540, 41.3970)::geography),
('Bethel Ice Cream', 'bethel-ice-cream-ct', 'scoop_shop', '179 Greenwood Ave', 'Bethel', 'CT', '06801', NULL, false, true, ST_MakePoint(-73.4133, 41.3713)::geography),
('Ridgefield Scoops', 'ridgefield-scoops-ct', 'scoop_shop', '389 Main St', 'Ridgefield', 'CT', '06877', NULL, false, true, ST_MakePoint(-73.4977, 41.2812)::geography),
('New Canaan Gelato', 'new-canaan-gelato', 'scoop_shop', '116 Elm St', 'New Canaan', 'CT', '06840', NULL, false, true, ST_MakePoint(-73.4950, 41.1469)::geography),
('Wilton Creamery', 'wilton-creamery-ct', 'scoop_shop', '22 Old Ridgefield Rd', 'Wilton', 'CT', '06897', NULL, false, true, ST_MakePoint(-73.4381, 41.1954)::geography),
('Fairfield Freeze', 'fairfield-freeze-ct', 'scoop_shop', '1545 Post Rd', 'Fairfield', 'CT', '06824', NULL, false, true, ST_MakePoint(-73.2570, 41.1415)::geography),
('Baskin-Robbins - Norwalk', 'baskin-robbins-norwalk', 'scoop_shop', '437 Westport Ave', 'Norwalk', 'CT', '06851', NULL, false, true, ST_MakePoint(-73.3829, 41.1170)::geography),
('Weston Ice Cream Co.', 'weston-ice-cream-ct', 'scoop_shop', '14 Weston Rd', 'Weston', 'CT', '06883', NULL, false, true, ST_MakePoint(-73.3771, 41.2009)::geography),
('Trumbull Creamery', 'trumbull-creamery-ct', 'scoop_shop', '5065 Main St', 'Trumbull', 'CT', '06611', NULL, false, true, ST_MakePoint(-73.2007, 41.2425)::geography),
('Stratford Scoops', 'stratford-scoops-ct', 'scoop_shop', '411 Barnum Ave', 'Stratford', 'CT', '06614', NULL, false, true, ST_MakePoint(-73.1345, 41.1794)::geography),
('Whole Foods - Fairfield', 'whole-foods-fairfield', 'supermarket', '350 Grasmere Ave', 'Fairfield', 'CT', '06824', NULL, false, true, ST_MakePoint(-73.2495, 41.1618)::geography),
('Monroe Farmstand Ice Cream', 'monroe-farmstand-ct', 'farmers_market', '479 Main St', 'Monroe', 'CT', '06468', NULL, false, true, ST_MakePoint(-73.2172, 41.3342)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - MYSTIC / NEW LONDON (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Mystic Drawbridge Ice Cream', 'mystic-drawbridge-ice-cream', 'scoop_shop', '2 W Main St', 'Mystic', 'CT', '06355', 'mysticdrawbridgeicecream', true, true, ST_MakePoint(-71.9663, 41.3545)::geography),
('Mystic Creamery', 'mystic-creamery', 'scoop_shop', '40 Coogan Blvd', 'Mystic', 'CT', '06355', NULL, false, true, ST_MakePoint(-71.9723, 41.3573)::geography),
('Stonington Scoops', 'stonington-scoops', 'scoop_shop', '108 Water St', 'Stonington', 'CT', '06378', NULL, false, true, ST_MakePoint(-71.9056, 41.3338)::geography),
('New London Creamery', 'new-london-creamery', 'scoop_shop', '60 Bank St', 'New London', 'CT', '06320', NULL, false, true, ST_MakePoint(-72.0978, 41.3566)::geography),
('Groton Ice Cream', 'groton-ice-cream-ct', 'scoop_shop', '901 Poquonnock Rd', 'Groton', 'CT', '06340', NULL, false, true, ST_MakePoint(-72.0520, 41.3471)::geography),
('Niantic Freeze', 'niantic-freeze', 'scoop_shop', '213 Main St', 'Niantic', 'CT', '06357', NULL, false, true, ST_MakePoint(-72.2123, 41.3257)::geography),
('Old Saybrook Scoops', 'old-saybrook-scoops', 'scoop_shop', '285 Main St', 'Old Saybrook', 'CT', '06475', NULL, false, true, ST_MakePoint(-72.3767, 41.2921)::geography),
('Essex Creamery', 'essex-creamery-ct', 'scoop_shop', '2 Main St', 'Essex', 'CT', '06426', NULL, false, true, ST_MakePoint(-72.3903, 41.3531)::geography),
('Olde Mistick Creamery', 'olde-mistick-creamery', 'scoop_shop', '27 Coogan Blvd', 'Mystic', 'CT', '06355', NULL, false, true, ST_MakePoint(-71.9739, 41.3560)::geography),
('Dairy Queen - Groton', 'dairy-queen-groton', 'scoop_shop', '791 Long Hill Rd', 'Groton', 'CT', '06340', NULL, false, true, ST_MakePoint(-72.0267, 41.3685)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- CONNECTICUT - REST OF CT (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Bridgeport Creamery', 'bridgeport-creamery-ct', 'scoop_shop', '300 Main St', 'Bridgeport', 'CT', '06604', NULL, false, true, ST_MakePoint(-73.1913, 41.1794)::geography),
('Middletown Scoops', 'middletown-scoops-ct', 'scoop_shop', '333 Main St', 'Middletown', 'CT', '06457', NULL, false, true, ST_MakePoint(-72.6502, 41.5628)::geography),
('Meriden Ice Cream', 'meriden-ice-cream-ct', 'scoop_shop', '127 E Main St', 'Meriden', 'CT', '06450', NULL, false, true, ST_MakePoint(-72.7943, 41.5383)::geography),
('Litchfield Creamery', 'litchfield-creamery-ct', 'scoop_shop', '7 On the Green', 'Litchfield', 'CT', '06759', NULL, true, true, ST_MakePoint(-73.1867, 41.7471)::geography),
('Torrington Scoops', 'torrington-scoops-ct', 'scoop_shop', '121 Main St', 'Torrington', 'CT', '06790', NULL, false, true, ST_MakePoint(-73.1211, 41.8009)::geography),
('Waterbury Ice Cream', 'waterbury-ice-cream-ct', 'scoop_shop', '34 E Main St', 'Waterbury', 'CT', '06702', NULL, false, true, ST_MakePoint(-73.0440, 41.5582)::geography),
('Woodbury Scoops', 'woodbury-scoops-ct', 'scoop_shop', '780 Main St S', 'Woodbury', 'CT', '06798', NULL, false, true, ST_MakePoint(-73.2049, 41.5445)::geography),
('Kent Creamery', 'kent-creamery-ct', 'scoop_shop', '1 N Main St', 'Kent', 'CT', '06757', NULL, false, true, ST_MakePoint(-73.4767, 41.7248)::geography),
('New Milford Freeze', 'new-milford-freeze-ct', 'scoop_shop', '86 Bank St', 'New Milford', 'CT', '06776', NULL, false, true, ST_MakePoint(-73.4083, 41.5773)::geography),
('Wallingford Creamery', 'wallingford-creamery-ct', 'scoop_shop', '107 Center St', 'Wallingford', 'CT', '06492', NULL, false, true, ST_MakePoint(-72.8225, 41.4517)::geography),
('Milford Scoops', 'milford-scoops-ct', 'scoop_shop', '56 River St', 'Milford', 'CT', '06460', NULL, false, true, ST_MakePoint(-73.0557, 41.2225)::geography),
('Shelton Ice Cream', 'shelton-ice-cream-ct', 'scoop_shop', '382 Howe Ave', 'Shelton', 'CT', '06484', NULL, false, true, ST_MakePoint(-73.0932, 41.2365)::geography),
('Madison Beach Creamery', 'madison-beach-creamery', 'scoop_shop', '23 Wall St', 'Madison', 'CT', '06443', NULL, false, true, ST_MakePoint(-72.5983, 41.2791)::geography),
('Cheshire Frozen Delights', 'cheshire-frozen-delights', 'scoop_shop', '1020 S Main St', 'Cheshire', 'CT', '06410', NULL, false, true, ST_MakePoint(-72.9005, 41.4888)::geography),
('Farmstand Ice Cream - CT', 'farmstand-ice-cream-ct', 'farmers_market', '260 Town Green', 'Guilford', 'CT', '06437', NULL, false, true, ST_MakePoint(-72.6822, 41.2886)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- WESTCHESTER - WHITE PLAINS / SCARSDALE (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('White Plains Creamery', 'white-plains-creamery', 'scoop_shop', '283 Mamaroneck Ave', 'White Plains', 'NY', '10605', NULL, false, true, ST_MakePoint(-73.7581, 41.0317)::geography),
('Scarsdale Gelato', 'scarsdale-gelato', 'scoop_shop', '15 Chase Rd', 'Scarsdale', 'NY', '10583', NULL, true, true, ST_MakePoint(-73.7828, 40.9905)::geography),
('Village Scoops - Scarsdale', 'village-scoops-scarsdale', 'scoop_shop', '47 E Parkway', 'Scarsdale', 'NY', '10583', NULL, false, true, ST_MakePoint(-73.7842, 40.9893)::geography),
('Eastchester Creamery', 'eastchester-creamery', 'scoop_shop', '379 White Plains Rd', 'Eastchester', 'NY', '10709', NULL, false, true, ST_MakePoint(-73.8089, 40.9540)::geography),
('Bronxville Scoops', 'bronxville-scoops', 'scoop_shop', '78 Pondfield Rd', 'Bronxville', 'NY', '10708', NULL, false, true, ST_MakePoint(-73.8327, 40.9395)::geography),
('Tuckahoe Freeze', 'tuckahoe-freeze', 'scoop_shop', '167 Main St', 'Tuckahoe', 'NY', '10707', NULL, false, true, ST_MakePoint(-73.8273, 40.9506)::geography),
('Mamaroneck Creamery', 'mamaroneck-creamery', 'scoop_shop', '134 Mamaroneck Ave', 'Mamaroneck', 'NY', '10543', NULL, false, true, ST_MakePoint(-73.7365, 40.9508)::geography),
('Larchmont Gelato', 'larchmont-gelato', 'scoop_shop', '2011 Palmer Ave', 'Larchmont', 'NY', '10538', NULL, false, true, ST_MakePoint(-73.7510, 40.9312)::geography),
('Harrison Ice Cream', 'harrison-ice-cream-ny', 'scoop_shop', '219 Harrison Ave', 'Harrison', 'NY', '10528', NULL, false, true, ST_MakePoint(-73.7125, 41.0095)::geography),
('Rye Creamery', 'rye-creamery-ny', 'scoop_shop', '31 Purchase St', 'Rye', 'NY', '10580', NULL, false, true, ST_MakePoint(-73.6839, 40.9840)::geography),
('Cold Stone - White Plains', 'cold-stone-white-plains', 'scoop_shop', '200 Hamilton Ave', 'White Plains', 'NY', '10601', NULL, false, true, ST_MakePoint(-73.7614, 41.0311)::geography),
('Ardsley Creamery', 'ardsley-creamery-ny', 'scoop_shop', '660 Saw Mill River Rd', 'Ardsley', 'NY', '10502', NULL, false, true, ST_MakePoint(-73.8430, 41.0092)::geography),
('Hartsdale Scoops', 'hartsdale-scoops', 'scoop_shop', '303 E Hartsdale Ave', 'Hartsdale', 'NY', '10530', NULL, false, true, ST_MakePoint(-73.7983, 41.0198)::geography),
('Whole Foods - White Plains', 'whole-foods-white-plains', 'supermarket', '1 Maple Ave', 'White Plains', 'NY', '10601', NULL, false, true, ST_MakePoint(-73.7639, 41.0296)::geography),
('Trader Joe''s - Scarsdale', 'trader-joes-scarsdale', 'supermarket', '741 White Plains Rd', 'Scarsdale', 'NY', '10583', NULL, false, true, ST_MakePoint(-73.8012, 40.9797)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- WESTCHESTER - YONKERS / NEW ROCHELLE (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Yonkers Creamery', 'yonkers-creamery', 'scoop_shop', '25 Main St', 'Yonkers', 'NY', '10701', NULL, false, true, ST_MakePoint(-73.8987, 40.9312)::geography),
('Getty Square Gelato', 'getty-square-gelato', 'scoop_shop', '4 Riverdale Ave', 'Yonkers', 'NY', '10701', NULL, false, true, ST_MakePoint(-73.8993, 40.9329)::geography),
('Cross County Cones', 'cross-county-cones', 'scoop_shop', '1 Mall Walk', 'Yonkers', 'NY', '10704', NULL, false, true, ST_MakePoint(-73.8647, 40.9218)::geography),
('New Rochelle Ice Cream', 'new-rochelle-ice-cream', 'scoop_shop', '33 Lawton St', 'New Rochelle', 'NY', '10801', NULL, false, true, ST_MakePoint(-73.7821, 40.9110)::geography),
('Main St Scoops - New Ro', 'main-st-scoops-new-ro', 'scoop_shop', '254 Main St', 'New Rochelle', 'NY', '10801', NULL, false, true, ST_MakePoint(-73.7835, 40.9115)::geography),
('Pelham Creamery', 'pelham-creamery-ny', 'scoop_shop', '115 5th Ave', 'Pelham', 'NY', '10803', NULL, false, true, ST_MakePoint(-73.8088, 40.9097)::geography),
('Mount Vernon Scoops', 'mount-vernon-scoops', 'scoop_shop', '201 E 3rd St', 'Mount Vernon', 'NY', '10553', NULL, false, true, ST_MakePoint(-73.8356, 40.9096)::geography),
('Dobbs Ferry Creamery', 'dobbs-ferry-creamery', 'scoop_shop', '49 Main St', 'Dobbs Ferry', 'NY', '10522', NULL, false, true, ST_MakePoint(-73.8719, 41.0048)::geography),
('Hastings Ice Cream', 'hastings-ice-cream-ny', 'scoop_shop', '541 Warburton Ave', 'Hastings-on-Hudson', 'NY', '10706', NULL, false, true, ST_MakePoint(-73.8791, 40.9911)::geography),
('Irvington Gelato', 'irvington-gelato-ny', 'scoop_shop', '6 Main St', 'Irvington', 'NY', '10533', NULL, false, true, ST_MakePoint(-73.8684, 41.0392)::geography),
('Carvel - Yonkers', 'carvel-yonkers-central', 'scoop_shop', '1975 Central Park Ave', 'Yonkers', 'NY', '10710', NULL, false, true, ST_MakePoint(-73.8526, 40.9564)::geography),
('Rita''s - New Rochelle', 'ritas-new-rochelle', 'scoop_shop', '587 Main St', 'New Rochelle', 'NY', '10801', NULL, false, true, ST_MakePoint(-73.7809, 40.9085)::geography),
('Whole Foods - Yonkers', 'whole-foods-yonkers', 'supermarket', '1147 Central Park Ave', 'Yonkers', 'NY', '10704', NULL, false, true, ST_MakePoint(-73.8570, 40.9345)::geography),
('Fleetwood Cones', 'fleetwood-cones-ny', 'scoop_shop', '420 Gramatan Ave', 'Mount Vernon', 'NY', '10552', NULL, false, true, ST_MakePoint(-73.8246, 40.9292)::geography),
('Crestwood Creamery', 'crestwood-creamery', 'scoop_shop', '500 N Columbus Ave', 'Yonkers', 'NY', '10701', NULL, false, true, ST_MakePoint(-73.8862, 40.9480)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- HUDSON VALLEY - TARRYTOWN / SLEEPY HOLLOW + NORTH (30)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Main Street Sweets - Tarrytown', 'main-st-sweets-tarrytown', 'scoop_shop', '37 Main St', 'Tarrytown', 'NY', '10591', NULL, true, true, ST_MakePoint(-73.8586, 41.0762)::geography),
('Sleepy Hollow Creamery', 'sleepy-hollow-creamery', 'scoop_shop', '81 Beekman Ave', 'Sleepy Hollow', 'NY', '10591', NULL, false, true, ST_MakePoint(-73.8595, 41.0865)::geography),
('Ossining Ice Cream', 'ossining-ice-cream', 'scoop_shop', '120 Main St', 'Ossining', 'NY', '10562', NULL, false, true, ST_MakePoint(-73.8614, 41.1626)::geography),
('Croton-on-Hudson Freeze', 'croton-on-hudson-freeze', 'scoop_shop', '51 Maple St', 'Croton-on-Hudson', 'NY', '10520', NULL, false, true, ST_MakePoint(-73.8911, 41.2080)::geography),
('Pleasantville Creamery', 'pleasantville-creamery', 'scoop_shop', '39 Wheeler Ave', 'Pleasantville', 'NY', '10570', NULL, false, true, ST_MakePoint(-73.7925, 41.1314)::geography),
('Chappaqua Scoops', 'chappaqua-scoops', 'scoop_shop', '75 S Greeley Ave', 'Chappaqua', 'NY', '10514', NULL, false, true, ST_MakePoint(-73.7746, 41.1596)::geography),
('Briarcliff Manor Gelato', 'briarcliff-manor-gelato', 'scoop_shop', '1876 Pleasantville Rd', 'Briarcliff Manor', 'NY', '10510', NULL, false, true, ST_MakePoint(-73.8246, 41.1441)::geography),
('Peekskill Creamery', 'peekskill-creamery', 'scoop_shop', '916 Main St', 'Peekskill', 'NY', '10566', NULL, false, true, ST_MakePoint(-73.9205, 41.2900)::geography),
('Cold Spring Ice Cream', 'cold-spring-ice-cream', 'scoop_shop', '85 Main St', 'Cold Spring', 'NY', '10516', NULL, true, true, ST_MakePoint(-73.9546, 41.4208)::geography),
('Garrison Creamery', 'garrison-creamery', 'scoop_shop', '1108 NY-9D', 'Garrison', 'NY', '10524', NULL, false, true, ST_MakePoint(-73.9412, 41.3825)::geography),
('Beacon Creamery', 'beacon-creamery', 'scoop_shop', '468 Main St', 'Beacon', 'NY', '12508', 'beaconcreamery', true, true, ST_MakePoint(-73.9669, 41.5043)::geography),
('Homespun Foods Ice Cream', 'homespun-foods-beacon', 'restaurant', '232 Main St', 'Beacon', 'NY', '12508', NULL, false, true, ST_MakePoint(-73.9653, 41.5046)::geography),
('Poughkeepsie Scoops', 'poughkeepsie-scoops', 'scoop_shop', '260 Main St', 'Poughkeepsie', 'NY', '12601', NULL, false, true, ST_MakePoint(-73.9264, 41.7055)::geography),
('Arlington Creamery', 'arlington-creamery-pok', 'scoop_shop', '47 Raymond Ave', 'Poughkeepsie', 'NY', '12601', NULL, false, true, ST_MakePoint(-73.8929, 41.6917)::geography),
('Newburgh Creamery', 'newburgh-creamery', 'scoop_shop', '80 Liberty St', 'Newburgh', 'NY', '12550', NULL, false, true, ST_MakePoint(-74.0108, 41.5034)::geography),
('Nyack Scoop Bar', 'nyack-scoop-bar', 'scoop_shop', '69 S Broadway', 'Nyack', 'NY', '10960', NULL, false, true, ST_MakePoint(-73.9179, 41.0934)::geography),
('Temptations Cafe - Nyack', 'temptations-cafe-nyack', 'restaurant', '80 Main St', 'Nyack', 'NY', '10960', NULL, false, true, ST_MakePoint(-73.9183, 41.0939)::geography),
('Pearl River Creamery', 'pearl-river-creamery', 'scoop_shop', '20 N Main St', 'Pearl River', 'NY', '10965', NULL, false, true, ST_MakePoint(-74.0214, 41.0585)::geography),
('Nanuet Freeze', 'nanuet-freeze-ny', 'scoop_shop', '53 E Route 59', 'Nanuet', 'NY', '10954', NULL, false, true, ST_MakePoint(-74.0081, 41.0982)::geography),
('Suffern Scoops', 'suffern-scoops', 'scoop_shop', '44 Wayne Ave', 'Suffern', 'NY', '10901', NULL, false, true, ST_MakePoint(-74.1504, 41.1146)::geography),
('Haverstraw Creamery', 'haverstraw-creamery', 'scoop_shop', '40 Main St', 'Haverstraw', 'NY', '10927', NULL, false, true, ST_MakePoint(-73.9632, 41.2055)::geography),
('Spring Valley Cones', 'spring-valley-cones', 'scoop_shop', '26 N Main St', 'Spring Valley', 'NY', '10977', NULL, false, true, ST_MakePoint(-74.0437, 41.1132)::geography),
('New City Ice Cream', 'new-city-ice-cream', 'scoop_shop', '228 S Main St', 'New City', 'NY', '10956', NULL, false, true, ST_MakePoint(-73.9897, 41.1499)::geography),
('Stony Point Creamery', 'stony-point-creamery', 'scoop_shop', '129 S Liberty Dr', 'Stony Point', 'NY', '10980', NULL, false, true, ST_MakePoint(-73.9875, 41.2284)::geography),
('Piermont Gelato', 'piermont-gelato', 'scoop_shop', '506 Piermont Ave', 'Piermont', 'NY', '10968', NULL, false, true, ST_MakePoint(-73.9181, 41.0416)::geography),
('Tappan Creamery', 'tappan-creamery-ny', 'scoop_shop', '123 Main St', 'Tappan', 'NY', '10983', NULL, false, true, ST_MakePoint(-73.9479, 41.0225)::geography),
('Pomona Farmstand Creamery', 'pomona-farmstand-creamery', 'farmers_market', '43 Camp Hill Rd', 'Pomona', 'NY', '10970', NULL, false, true, ST_MakePoint(-74.0471, 41.1679)::geography),
('Whole Foods - Poughkeepsie', 'whole-foods-poughkeepsie', 'supermarket', '1900 South Rd', 'Poughkeepsie', 'NY', '12601', NULL, false, true, ST_MakePoint(-73.8788, 41.6724)::geography),
('Trader Joe''s - Nanuet', 'trader-joes-nanuet', 'supermarket', '20 Maple Ave', 'Nanuet', 'NY', '10954', NULL, false, true, ST_MakePoint(-74.0090, 41.0946)::geography),
('Mister Softee - Tarrytown', 'mister-softee-tarrytown', 'food_truck', 'Patriots Park', 'Tarrytown', 'NY', '10591', NULL, false, true, ST_MakePoint(-73.8619, 41.0763)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE LONG ISLAND - NASSAU COUNTY (40)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Garden City Creamery', 'garden-city-creamery', 'scoop_shop', '758 Franklin Ave', 'Garden City', 'NY', '11530', NULL, false, true, ST_MakePoint(-73.6340, 40.7264)::geography),
('Mineola Scoops', 'mineola-scoops', 'scoop_shop', '167 Mineola Blvd', 'Mineola', 'NY', '11501', NULL, false, true, ST_MakePoint(-73.6411, 40.7499)::geography),
('Great Neck Gelato', 'great-neck-gelato', 'scoop_shop', '26 Middle Neck Rd', 'Great Neck', 'NY', '11021', NULL, false, true, ST_MakePoint(-73.7287, 40.8010)::geography),
('Manhasset Creamery', 'manhasset-creamery', 'scoop_shop', '1523 Northern Blvd', 'Manhasset', 'NY', '11030', NULL, false, true, ST_MakePoint(-73.6988, 40.7865)::geography),
