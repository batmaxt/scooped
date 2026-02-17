-- ============================================
-- SCOOPED - Extended Locations Seed Data (Part 3)
-- ~540 additional locations: NYC, NJ, CT, Westchester, LI, Philly
-- Run AFTER 002_expanded_locations.sql
-- ============================================

-- ============================================
-- MORE NYC - MANHATTAN (30)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Harlem Scoops', 'harlem-scoops', 'scoop_shop', '2135 Frederick Douglass Blvd', 'New York', 'NY', '10026', NULL, false, true, ST_MakePoint(-73.9558, 40.8026)::geography),
('Sugar Hill Creamery', 'sugar-hill-creamery', 'scoop_shop', '184 Lenox Ave', 'New York', 'NY', '10026', 'sugarhillcreamery', true, true, ST_MakePoint(-73.9520, 40.8004)::geography),
('Carvel - Harlem', 'carvel-harlem-125', 'scoop_shop', '301 W 125th St', 'New York', 'NY', '10027', NULL, false, true, ST_MakePoint(-73.9535, 40.8097)::geography),
('Mikey Likes It - Harlem', 'mikey-likes-it-harlem', 'scoop_shop', '2050 Adam Clayton Powell Jr Blvd', 'New York', 'NY', '10027', 'mikeylikesiticecream', true, true, ST_MakePoint(-73.9534, 40.8074)::geography),
('Washington Heights Creamery', 'wash-heights-creamery', 'scoop_shop', '4155 Broadway', 'New York', 'NY', '10033', NULL, false, true, ST_MakePoint(-73.9401, 40.8473)::geography),
('Dyckman Ice Cream Co.', 'dyckman-ice-cream', 'scoop_shop', '514 W 207th St', 'New York', 'NY', '10034', NULL, false, true, ST_MakePoint(-73.9217, 40.8647)::geography),
('Inwood Chill', 'inwood-chill', 'scoop_shop', '4964 Broadway', 'New York', 'NY', '10034', NULL, false, true, ST_MakePoint(-73.9213, 40.8680)::geography),
('FiDi Freeze', 'fidi-freeze', 'scoop_shop', '77 Fulton St', 'New York', 'NY', '10038', NULL, false, true, ST_MakePoint(-74.0038, 40.7088)::geography),
('Wall Street Scoops', 'wall-street-scoops', 'scoop_shop', '54 Stone St', 'New York', 'NY', '10004', NULL, false, true, ST_MakePoint(-74.0098, 40.7038)::geography),
('Seaport Creamery', 'seaport-creamery', 'scoop_shop', '19 Fulton St', 'New York', 'NY', '10038', NULL, false, true, ST_MakePoint(-74.0033, 40.7067)::geography),
('Tribeca Treats', 'tribeca-treats', 'scoop_shop', '139 Reade St', 'New York', 'NY', '10013', NULL, false, true, ST_MakePoint(-74.0068, 40.7158)::geography),
('North End Gelato', 'north-end-gelato-tribeca', 'scoop_shop', '74 Warren St', 'New York', 'NY', '10007', NULL, false, true, ST_MakePoint(-74.0089, 40.7145)::geography),
('Baskin-Robbins - Chelsea', 'baskin-robbins-chelsea', 'scoop_shop', '166 8th Ave', 'New York', 'NY', '10011', NULL, false, true, ST_MakePoint(-74.0005, 40.7413)::geography),
('Chelsea Cone', 'chelsea-cone', 'scoop_shop', '220 W 23rd St', 'New York', 'NY', '10011', NULL, false, true, ST_MakePoint(-73.9968, 40.7445)::geography),
('Van Leeuwen - Chelsea Market', 'van-leeuwen-chelsea-market', 'scoop_shop', '75 9th Ave', 'New York', 'NY', '10011', 'vanleeuwenicecream', true, true, ST_MakePoint(-74.0046, 40.7425)::geography),
('Gramercy Gelato', 'gramercy-gelato', 'scoop_shop', '237 3rd Ave', 'New York', 'NY', '10010', NULL, false, true, ST_MakePoint(-73.9839, 40.7379)::geography),
('Kips Bay Creamery', 'kips-bay-creamery', 'scoop_shop', '570 2nd Ave', 'New York', 'NY', '10016', NULL, false, true, ST_MakePoint(-73.9770, 40.7440)::geography),
('Mister Softee Stop - Midtown', 'mister-softee-midtown', 'food_truck', '6th Ave & 42nd St', 'New York', 'NY', '10036', NULL, false, true, ST_MakePoint(-73.9832, 40.7536)::geography),
('Dairy Queen - East Harlem', 'dairy-queen-east-harlem', 'scoop_shop', '2187 3rd Ave', 'New York', 'NY', '10035', NULL, false, true, ST_MakePoint(-73.9375, 40.7995)::geography),
('El Barrio Helados', 'el-barrio-helados', 'scoop_shop', '116 E 116th St', 'New York', 'NY', '10029', NULL, false, true, ST_MakePoint(-73.9438, 40.7979)::geography),
('UES Frozen Delights', 'ues-frozen-delights', 'scoop_shop', '1468 3rd Ave', 'New York', 'NY', '10028', NULL, false, true, ST_MakePoint(-73.9554, 40.7749)::geography),
('Whole Foods - UWS Columbus', 'whole-foods-uws-columbus', 'supermarket', '808 Columbus Ave', 'New York', 'NY', '10025', NULL, false, true, ST_MakePoint(-73.9646, 40.7969)::geography),
('Trader Joe''s - UES', 'trader-joes-ues-72', 'supermarket', '1241 3rd Ave', 'New York', 'NY', '10021', NULL, false, true, ST_MakePoint(-73.9594, 40.7692)::geography),
('Cold Stone Creamery - Midtown East', 'cold-stone-midtown-east', 'scoop_shop', '253 E 51st St', 'New York', 'NY', '10022', NULL, false, true, ST_MakePoint(-73.9700, 40.7554)::geography),
('Ben & Jerry''s - 42nd St', 'ben-jerrys-42nd-st', 'scoop_shop', '200 W 42nd St', 'New York', 'NY', '10036', NULL, false, true, ST_MakePoint(-73.9877, 40.7565)::geography),
('Nom Wah Tea Parlor', 'nom-wah-tea-parlor', 'restaurant', '13 Doyers St', 'New York', 'NY', '10013', 'nomwah', true, true, ST_MakePoint(-73.9981, 40.7143)::geography),
('Magnolia Bakery - Rockefeller', 'magnolia-bakery-rockefeller', 'restaurant', '1240 6th Ave', 'New York', 'NY', '10020', NULL, false, true, ST_MakePoint(-73.9790, 40.7592)::geography),
('LES Chill Spot', 'les-chill-spot', 'scoop_shop', '152 Orchard St', 'New York', 'NY', '10002', NULL, false, true, ST_MakePoint(-73.9892, 40.7207)::geography),
('SoHo Scoop Bar', 'soho-scoop-bar', 'scoop_shop', '118 Spring St', 'New York', 'NY', '10012', NULL, false, true, ST_MakePoint(-73.9973, 40.7237)::geography),
('Mott Street Ice Cream', 'mott-street-ice-cream', 'scoop_shop', '208 Mott St', 'New York', 'NY', '10012', NULL, false, true, ST_MakePoint(-73.9945, 40.7229)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE NYC - BROOKLYN (30)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Park Slope Scoops', 'park-slope-scoops', 'scoop_shop', '354 7th Ave', 'Brooklyn', 'NY', '11215', NULL, false, true, ST_MakePoint(-73.9802, 40.6697)::geography),
('Ample Hills - Park Slope', 'ample-hills-park-slope', 'scoop_shop', '305 7th Ave', 'Brooklyn', 'NY', '11215', 'amplehills', true, true, ST_MakePoint(-73.9808, 40.6703)::geography),
('Blue Marble - Prospect Heights', 'blue-marble-prospect-hts', 'scoop_shop', '196 Underhill Ave', 'Brooklyn', 'NY', '11238', 'bluemarbleicecream', true, true, ST_MakePoint(-73.9649, 40.6784)::geography),
('Bushwick Creamery', 'bushwick-creamery', 'scoop_shop', '1017 Bushwick Ave', 'Brooklyn', 'NY', '11221', NULL, false, true, ST_MakePoint(-73.9189, 40.6868)::geography),
('Mattie''s Soft Serve', 'matties-soft-serve-bushwick', 'scoop_shop', '393 Knickerbocker Ave', 'Brooklyn', 'NY', '11237', NULL, false, true, ST_MakePoint(-73.9133, 40.6972)::geography),
('Bed-Stuy Freeze', 'bed-stuy-freeze', 'scoop_shop', '1108 Fulton St', 'Brooklyn', 'NY', '11216', NULL, false, true, ST_MakePoint(-73.9513, 40.6820)::geography),
('Restoration Creamery', 'restoration-creamery', 'scoop_shop', '1360 Fulton St', 'Brooklyn', 'NY', '11216', NULL, false, true, ST_MakePoint(-73.9468, 40.6807)::geography),
('Bay Ridge Ice Cream House', 'bay-ridge-ice-cream', 'scoop_shop', '7817 3rd Ave', 'Brooklyn', 'NY', '11209', NULL, false, true, ST_MakePoint(-74.0283, 40.6318)::geography),
('Anopoli Ice Cream Parlor', 'anopoli-bay-ridge', 'scoop_shop', '6920 3rd Ave', 'Brooklyn', 'NY', '11209', NULL, true, true, ST_MakePoint(-74.0271, 40.6361)::geography),
('Sunset Scoops', 'sunset-scoops-bk', 'scoop_shop', '5310 5th Ave', 'Brooklyn', 'NY', '11220', NULL, false, true, ST_MakePoint(-74.0123, 40.6447)::geography),
('Sunset Park Paletas', 'sunset-park-paletas', 'food_truck', '44th St & 5th Ave', 'Brooklyn', 'NY', '11220', NULL, false, true, ST_MakePoint(-74.0125, 40.6490)::geography),
('Crown Heights Creamery', 'crown-heights-creamery', 'scoop_shop', '750 Franklin Ave', 'Brooklyn', 'NY', '11238', NULL, false, true, ST_MakePoint(-73.9561, 40.6740)::geography),
('Franklin Ave Ice Cream', 'franklin-ave-ice-cream', 'scoop_shop', '857 Franklin Ave', 'Brooklyn', 'NY', '11225', NULL, false, true, ST_MakePoint(-73.9562, 40.6700)::geography),
('Flatbush Frost', 'flatbush-frost', 'scoop_shop', '2210 Church Ave', 'Brooklyn', 'NY', '11226', NULL, false, true, ST_MakePoint(-73.9536, 40.6510)::geography),
('Cortelyou Cones', 'cortelyou-cones', 'scoop_shop', '714 Cortelyou Rd', 'Brooklyn', 'NY', '11218', NULL, false, true, ST_MakePoint(-73.9629, 40.6414)::geography),
('Greenpoint Gelato', 'greenpoint-gelato', 'scoop_shop', '681 Manhattan Ave', 'Brooklyn', 'NY', '11222', NULL, false, true, ST_MakePoint(-73.9543, 40.7273)::geography),
('Lemon Ice King of Corona - BK', 'lemon-ice-king-bk', 'scoop_shop', '108 Nassau Ave', 'Brooklyn', 'NY', '11222', NULL, false, true, ST_MakePoint(-73.9487, 40.7244)::geography),
('Van Leeuwen - Greenpoint', 'van-leeuwen-greenpoint', 'scoop_shop', '620 Manhattan Ave', 'Brooklyn', 'NY', '11222', 'vanleeuwenicecream', true, true, ST_MakePoint(-73.9541, 40.7258)::geography),
('Brooklyn Bell', 'brooklyn-bell-ditmas', 'scoop_shop', '1018 Cortelyou Rd', 'Brooklyn', 'NY', '11218', NULL, false, true, ST_MakePoint(-73.9585, 40.6397)::geography),
('DUMBO Pop-Up Creamery', 'dumbo-popup-creamery', 'food_truck', 'Water St & Main St', 'Brooklyn', 'NY', '11201', NULL, false, true, ST_MakePoint(-73.9908, 40.7030)::geography),
('Cobble Hill Cones', 'cobble-hill-cones', 'scoop_shop', '226 Court St', 'Brooklyn', 'NY', '11201', NULL, false, true, ST_MakePoint(-73.9919, 40.6838)::geography),
('Carroll Gardens Gelato', 'carroll-gardens-gelato', 'scoop_shop', '345 Smith St', 'Brooklyn', 'NY', '11231', NULL, false, true, ST_MakePoint(-73.9925, 40.6800)::geography),
('Red Hook Ice Cream', 'red-hook-ice-cream', 'scoop_shop', '480 Van Brunt St', 'Brooklyn', 'NY', '11231', NULL, false, true, ST_MakePoint(-74.0133, 40.6748)::geography),
('Coney Island Cones', 'coney-island-cones', 'scoop_shop', '1208 Surf Ave', 'Brooklyn', 'NY', '11224', NULL, false, true, ST_MakePoint(-73.9842, 40.5747)::geography),
('Brighton Beach Freeze', 'brighton-beach-freeze', 'scoop_shop', '608 Brighton Beach Ave', 'Brooklyn', 'NY', '11235', NULL, false, true, ST_MakePoint(-73.9612, 40.5780)::geography),
('Williamsburg Whip', 'williamsburg-whip', 'scoop_shop', '265 Bedford Ave', 'Brooklyn', 'NY', '11211', NULL, false, true, ST_MakePoint(-73.9576, 40.7140)::geography),
('Clinton Hill Creamery', 'clinton-hill-creamery', 'scoop_shop', '588 Myrtle Ave', 'Brooklyn', 'NY', '11205', NULL, false, true, ST_MakePoint(-73.9675, 40.6923)::geography),
('Wegmans - Brooklyn Navy Yard Ice', 'wegmans-bk-navy-yard-ice', 'supermarket', '21 Flushing Ave', 'Brooklyn', 'NY', '11205', NULL, false, true, ST_MakePoint(-73.9740, 40.6990)::geography),
('Target - Atlantic Terminal', 'target-atlantic-terminal', 'supermarket', '139 Flatbush Ave', 'Brooklyn', 'NY', '11217', NULL, false, true, ST_MakePoint(-73.9772, 40.6855)::geography),
('Whole Foods - Gowanus', 'whole-foods-gowanus', 'supermarket', '214 3rd St', 'Brooklyn', 'NY', '11215', NULL, false, true, ST_MakePoint(-73.9858, 40.6737)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE NYC - QUEENS (25)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Astoria Ice Cream Factory', 'astoria-ice-cream-factory', 'scoop_shop', '30-10 Broadway', 'Astoria', 'NY', '11106', NULL, false, true, ST_MakePoint(-73.9234, 40.7625)::geography),
('Ditmars Scoops', 'ditmars-scoops', 'scoop_shop', '23-18 Ditmars Blvd', 'Astoria', 'NY', '11105', NULL, false, true, ST_MakePoint(-73.9118, 40.7750)::geography),
('Lefrak City Creamery', 'lefrak-city-creamery', 'scoop_shop', '98-20 Queens Blvd', 'Rego Park', 'NY', '11374', NULL, false, true, ST_MakePoint(-73.8562, 40.7279)::geography),
('LIC Landing Ice Cream', 'lic-landing-ice-cream', 'scoop_shop', '52-10 Center Blvd', 'Long Island City', 'NY', '11101', NULL, false, true, ST_MakePoint(-73.9552, 40.7425)::geography),
('Sweetleaf LIC', 'sweetleaf-lic', 'restaurant', '10-93 Jackson Ave', 'Long Island City', 'NY', '11101', NULL, false, true, ST_MakePoint(-73.9497, 40.7472)::geography),
('Rita''s Italian Ice - Jamaica', 'ritas-italian-ice-jamaica', 'scoop_shop', '164-01 Jamaica Ave', 'Jamaica', 'NY', '11432', NULL, false, true, ST_MakePoint(-73.7943, 40.7034)::geography),
('Jamaica Freeze', 'jamaica-freeze', 'scoop_shop', '153-32 Jamaica Ave', 'Jamaica', 'NY', '11432', NULL, false, true, ST_MakePoint(-73.8010, 40.7043)::geography),
('Bayside Scoops', 'bayside-scoops', 'scoop_shop', '213-10 Northern Blvd', 'Bayside', 'NY', '11361', NULL, false, true, ST_MakePoint(-73.7707, 40.7624)::geography),
('Ben & Jerry''s - Bayside', 'ben-jerrys-bayside', 'scoop_shop', '38-18 Bell Blvd', 'Bayside', 'NY', '11361', NULL, false, true, ST_MakePoint(-73.7719, 40.7628)::geography),
('Ridgewood Ice Cream Parlor', 'ridgewood-ice-cream-parlor', 'scoop_shop', '60-55 Myrtle Ave', 'Ridgewood', 'NY', '11385', NULL, false, true, ST_MakePoint(-73.9034, 40.6998)::geography),
('Woodside Whip', 'woodside-whip', 'scoop_shop', '61-01 Roosevelt Ave', 'Woodside', 'NY', '11377', NULL, false, true, ST_MakePoint(-73.8969, 40.7453)::geography),
('Sunnyside Swirls', 'sunnyside-swirls', 'scoop_shop', '45-10 Greenpoint Ave', 'Sunnyside', 'NY', '11104', NULL, false, true, ST_MakePoint(-73.9211, 40.7419)::geography),
('Lemon Ice King of Corona', 'lemon-ice-king-corona', 'scoop_shop', '52-02 108th St', 'Corona', 'NY', '11368', 'lemonicekingofcorona', true, true, ST_MakePoint(-73.8631, 40.7413)::geography),
('Flushing Meadows Freeze', 'flushing-meadows-freeze', 'scoop_shop', '131-18 39th Ave', 'Flushing', 'NY', '11354', NULL, false, true, ST_MakePoint(-73.8325, 40.7617)::geography),
('Kew Gardens Creamery', 'kew-gardens-creamery', 'scoop_shop', '83-15 Lefferts Blvd', 'Kew Gardens', 'NY', '11415', NULL, false, true, ST_MakePoint(-73.8283, 40.7051)::geography),
('Jackson Heights Helados', 'jackson-heights-helados', 'scoop_shop', '75-05 Roosevelt Ave', 'Jackson Heights', 'NY', '11372', NULL, false, true, ST_MakePoint(-73.8874, 40.7493)::geography),
('Forest Hills Cone', 'forest-hills-cone', 'scoop_shop', '71-28 Austin St', 'Forest Hills', 'NY', '11375', NULL, false, true, ST_MakePoint(-73.8449, 40.7205)::geography),
('Rockaway Beach Freeze', 'rockaway-beach-freeze', 'scoop_shop', '96-19 Rockaway Beach Blvd', 'Rockaway Beach', 'NY', '11693', NULL, false, true, ST_MakePoint(-73.8175, 40.5851)::geography),
('Howard Beach Creamery', 'howard-beach-creamery', 'scoop_shop', '159-20 Cross Bay Blvd', 'Howard Beach', 'NY', '11414', NULL, false, true, ST_MakePoint(-73.8432, 40.6580)::geography),
('Whole Foods - LIC', 'whole-foods-lic', 'supermarket', '27-05 Jackson Ave', 'Long Island City', 'NY', '11101', NULL, false, true, ST_MakePoint(-73.9420, 40.7480)::geography),
('Trader Joe''s - Rego Park', 'trader-joes-rego-park', 'supermarket', '90-30 Metropolitan Ave', 'Rego Park', 'NY', '11374', NULL, false, true, ST_MakePoint(-73.8618, 40.7249)::geography),
('Stop & Shop - Astoria', 'stop-shop-astoria', 'supermarket', '34-57 48th St', 'Astoria', 'NY', '11103', NULL, false, true, ST_MakePoint(-73.9073, 40.7585)::geography),
('Oasis Jimma Juice - LIC', 'oasis-jimma-lic', 'restaurant', '10-12 44th Dr', 'Long Island City', 'NY', '11101', NULL, false, true, ST_MakePoint(-73.9508, 40.7452)::geography),
('Fresh Pond Ice Cream', 'fresh-pond-ice-cream', 'scoop_shop', '67-20 Fresh Pond Rd', 'Ridgewood', 'NY', '11385', NULL, false, true, ST_MakePoint(-73.8961, 40.7061)::geography),
('Maspeth Creamery', 'maspeth-creamery', 'scoop_shop', '69-40 Grand Ave', 'Maspeth', 'NY', '11378', NULL, false, true, ST_MakePoint(-73.8968, 40.7262)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE NYC - BRONX (20)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Fordham Freeze', 'fordham-freeze', 'scoop_shop', '2505 Grand Concourse', 'Bronx', 'NY', '10468', NULL, false, true, ST_MakePoint(-73.8984, 40.8617)::geography),
('Arthur Ave Gelato', 'arthur-ave-gelato', 'scoop_shop', '2344 Arthur Ave', 'Bronx', 'NY', '10458', NULL, false, true, ST_MakePoint(-73.8889, 40.8558)::geography),
('Bronx Ice Cream House', 'bronx-ice-cream-house', 'scoop_shop', '612 E 187th St', 'Bronx', 'NY', '10458', NULL, false, true, ST_MakePoint(-73.8863, 40.8553)::geography),
('City Island Creamery', 'city-island-creamery', 'scoop_shop', '280 City Island Ave', 'Bronx', 'NY', '10464', NULL, true, true, ST_MakePoint(-73.7870, 40.8467)::geography),
('Lickety Split - City Island', 'lickety-split-city-island', 'scoop_shop', '295 City Island Ave', 'Bronx', 'NY', '10464', NULL, false, true, ST_MakePoint(-73.7871, 40.8469)::geography),
('Pelham Bay Pops', 'pelham-bay-pops', 'scoop_shop', '3036 Westchester Ave', 'Bronx', 'NY', '10461', NULL, false, true, ST_MakePoint(-73.8326, 40.8417)::geography),
('Riverdale Ice Cream', 'riverdale-ice-cream', 'scoop_shop', '3703 Riverdale Ave', 'Bronx', 'NY', '10463', NULL, false, true, ST_MakePoint(-73.9069, 40.8844)::geography),
('Kingsbridge Kones', 'kingsbridge-kones', 'scoop_shop', '5665 Broadway', 'Bronx', 'NY', '10463', NULL, false, true, ST_MakePoint(-73.9019, 40.8780)::geography),
('Mott Haven Scoops', 'mott-haven-scoops', 'scoop_shop', '305 E 138th St', 'Bronx', 'NY', '10454', NULL, false, true, ST_MakePoint(-73.9222, 40.8091)::geography),
('South Bronx Creamery', 'south-bronx-creamery', 'scoop_shop', '401 E 149th St', 'Bronx', 'NY', '10455', NULL, false, true, ST_MakePoint(-73.9175, 40.8163)::geography),
('Concourse Cones', 'concourse-cones', 'scoop_shop', '1000 Grand Concourse', 'Bronx', 'NY', '10451', NULL, false, true, ST_MakePoint(-73.9228, 40.8228)::geography),
('Hunts Point Helados', 'hunts-point-helados', 'scoop_shop', '893 Hunts Point Ave', 'Bronx', 'NY', '10474', NULL, false, true, ST_MakePoint(-73.8806, 40.8113)::geography),
('Carvel - Throggs Neck', 'carvel-throggs-neck', 'scoop_shop', '3245 E Tremont Ave', 'Bronx', 'NY', '10461', NULL, false, true, ST_MakePoint(-73.8247, 40.8392)::geography),
('Parkchester Creamery', 'parkchester-creamery', 'scoop_shop', '1475 Metropolitan Ave', 'Bronx', 'NY', '10462', NULL, false, true, ST_MakePoint(-73.8596, 40.8373)::geography),
('Tremont Treats', 'tremont-treats', 'scoop_shop', '1888 E Tremont Ave', 'Bronx', 'NY', '10460', NULL, false, true, ST_MakePoint(-73.8578, 40.8420)::geography),
('Rita''s Italian Ice - Bronx', 'ritas-italian-ice-bronx', 'scoop_shop', '815 Hutchinson River Pkwy', 'Bronx', 'NY', '10465', NULL, false, true, ST_MakePoint(-73.8158, 40.8305)::geography),
('BX Frozen Delights', 'bx-frozen-delights', 'scoop_shop', '4037 White Plains Rd', 'Bronx', 'NY', '10466', NULL, false, true, ST_MakePoint(-73.8595, 40.8837)::geography),
('Whole Foods - Riverdale', 'whole-foods-riverdale', 'supermarket', '488 W 235th St', 'Bronx', 'NY', '10463', NULL, false, true, ST_MakePoint(-73.9038, 40.8860)::geography),
('Co-op City Creamery', 'co-op-city-creamery', 'scoop_shop', '2049 Bartow Ave', 'Bronx', 'NY', '10475', NULL, false, true, ST_MakePoint(-73.8275, 40.8676)::geography),
('Morris Park Gelato', 'morris-park-gelato', 'scoop_shop', '1029 Morris Park Ave', 'Bronx', 'NY', '10462', NULL, false, true, ST_MakePoint(-73.8528, 40.8495)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE NYC - STATEN ISLAND (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Egger''s Ice Cream - St. George', 'eggers-st-george', 'scoop_shop', '78 St Marks Pl', 'Staten Island', 'NY', '10301', NULL, true, true, ST_MakePoint(-74.0738, 40.6432)::geography),
('Ralph''s Italian Ices - SI', 'ralphs-ices-si', 'scoop_shop', '501 Port Richmond Ave', 'Staten Island', 'NY', '10302', NULL, false, true, ST_MakePoint(-74.1358, 40.6350)::geography),
('Tottenville Creamery', 'tottenville-creamery', 'scoop_shop', '7431 Amboy Rd', 'Staten Island', 'NY', '10307', NULL, false, true, ST_MakePoint(-74.2425, 40.5084)::geography),
('Dolly''s Ice Cream - SI', 'dollys-ice-cream-si', 'scoop_shop', '1557 Richmond Rd', 'Staten Island', 'NY', '10304', NULL, false, true, ST_MakePoint(-74.0935, 40.6002)::geography),
('New Dorp Freeze', 'new-dorp-freeze', 'scoop_shop', '262 New Dorp Ln', 'Staten Island', 'NY', '10306', NULL, false, true, ST_MakePoint(-74.1161, 40.5726)::geography),
('Great Kills Ice Cream', 'great-kills-ice-cream', 'scoop_shop', '4200 Hylan Blvd', 'Staten Island', 'NY', '10308', NULL, false, true, ST_MakePoint(-74.1483, 40.5459)::geography),
('Hylan Blvd Creamery', 'hylan-blvd-creamery', 'scoop_shop', '2236 Hylan Blvd', 'Staten Island', 'NY', '10306', NULL, false, true, ST_MakePoint(-74.1142, 40.5697)::geography),
('Flagship Cones - SI Mall', 'flagship-cones-si-mall', 'scoop_shop', '2655 Richmond Ave', 'Staten Island', 'NY', '10314', NULL, false, true, ST_MakePoint(-74.1716, 40.5832)::geography),
('Dairy Queen - Staten Island', 'dairy-queen-si', 'scoop_shop', '2485 Richmond Ave', 'Staten Island', 'NY', '10314', NULL, false, true, ST_MakePoint(-74.1693, 40.5820)::geography),
('Carvel - Hylan', 'carvel-hylan-si', 'scoop_shop', '1700 Hylan Blvd', 'Staten Island', 'NY', '10305', NULL, false, true, ST_MakePoint(-74.1021, 40.5873)::geography),
('Royal Crown Bakery Gelato', 'royal-crown-bakery-si', 'restaurant', '4954 Arthur Kill Rd', 'Staten Island', 'NY', '10309', NULL, false, true, ST_MakePoint(-74.2147, 40.5282)::geography),
('Island Scoops & Sundaes', 'island-scoops-sundaes', 'scoop_shop', '111 Ebbitts St', 'Staten Island', 'NY', '10306', NULL, false, true, ST_MakePoint(-74.1156, 40.5745)::geography),
('Baskin-Robbins - SI Forest', 'baskin-robbins-si-forest', 'scoop_shop', '1588 Forest Ave', 'Staten Island', 'NY', '10302', NULL, false, true, ST_MakePoint(-74.1396, 40.6262)::geography),
('Travis Treats', 'travis-treats-si', 'scoop_shop', '3860 Victory Blvd', 'Staten Island', 'NY', '10314', NULL, false, true, ST_MakePoint(-74.1820, 40.5913)::geography),
('ShopRite - New Springville', 'shoprite-new-springville-si', 'supermarket', '2424 Hylan Blvd', 'Staten Island', 'NY', '10306', NULL, false, true, ST_MakePoint(-74.1170, 40.5680)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- NEW JERSEY - HOBOKEN / JERSEY CITY (20)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Torico Ice Cream', 'torico-ice-cream-jc', 'scoop_shop', '720 Bergen Ave', 'Jersey City', 'NJ', '07306', 'toricoicecream', true, true, ST_MakePoint(-74.0685, 40.7259)::geography),
('Bucket & Bay Craft Gelato', 'bucket-bay-jc', 'scoop_shop', '150 Bay St', 'Jersey City', 'NJ', '07302', 'bucketandbay', true, true, ST_MakePoint(-74.0371, 40.7155)::geography),
('Van Leeuwen - Hoboken', 'van-leeuwen-hoboken', 'scoop_shop', '516 Washington St', 'Hoboken', 'NJ', '07030', 'vanleeuwenicecream', true, true, ST_MakePoint(-74.0279, 40.7440)::geography),
('Hoboken Creamery', 'hoboken-creamery', 'scoop_shop', '328 Washington St', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0297, 40.7419)::geography),
('Cold Stone Creamery - Hoboken', 'cold-stone-hoboken', 'scoop_shop', '208 Washington St', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0303, 40.7401)::geography),
('JC Heights Freeze', 'jc-heights-freeze', 'scoop_shop', '4903 Palisade Ave', 'Jersey City', 'NJ', '07304', NULL, false, true, ST_MakePoint(-74.0660, 40.7498)::geography),
('Grove St Gelato', 'grove-st-gelato-jc', 'scoop_shop', '116 Newark Ave', 'Jersey City', 'NJ', '07302', NULL, false, true, ST_MakePoint(-74.0427, 40.7269)::geography),
('Newport Scoops', 'newport-scoops-jc', 'scoop_shop', '30 Mall Dr W', 'Jersey City', 'NJ', '07310', NULL, false, true, ST_MakePoint(-74.0371, 40.7268)::geography),
('Exchange Place Ice Cream', 'exchange-place-ice-cream', 'scoop_shop', '1 Exchange Pl', 'Jersey City', 'NJ', '07302', NULL, false, true, ST_MakePoint(-74.0330, 40.7162)::geography),
('Rita''s Italian Ice - Hoboken', 'ritas-italian-ice-hoboken', 'scoop_shop', '400 Garden St', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0351, 40.7412)::geography),
('Whole Foods - JC Waterfront', 'whole-foods-jc-waterfront', 'supermarket', '210 Marin Blvd', 'Jersey City', 'NJ', '07302', NULL, false, true, ST_MakePoint(-74.0381, 40.7188)::geography),
('Trader Joe''s - Hoboken', 'trader-joes-hoboken', 'supermarket', '700 Washington Blvd', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0284, 40.7461)::geography),
('McGinley Square Scoops', 'mcginley-sq-scoops', 'scoop_shop', '2871 JFK Blvd', 'Jersey City', 'NJ', '07306', NULL, false, true, ST_MakePoint(-74.0713, 40.7238)::geography),
('Greenville Creamery', 'greenville-creamery-jc', 'scoop_shop', '72 Danforth Ave', 'Jersey City', 'NJ', '07305', NULL, false, true, ST_MakePoint(-74.0672, 40.7037)::geography),
('Hoboken Farms Ice Cream', 'hoboken-farms-ice-cream', 'restaurant', '1 Sinatra Dr', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0234, 40.7365)::geography),
('Mister Softee - JC', 'mister-softee-jc', 'food_truck', 'Hamilton Park', 'Jersey City', 'NJ', '07302', NULL, false, true, ST_MakePoint(-74.0418, 40.7282)::geography),
('Halo Creamery', 'halo-creamery-hoboken', 'scoop_shop', '82 Hudson St', 'Hoboken', 'NJ', '07030', NULL, false, true, ST_MakePoint(-74.0257, 40.7374)::geography),
