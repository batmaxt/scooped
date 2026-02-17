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
('Port Washington Scoops', 'port-washington-scoops', 'scoop_shop', '79 Main St', 'Port Washington', 'NY', '11050', NULL, false, true, ST_MakePoint(-73.6878, 40.8270)::geography),
('Glen Cove Creamery', 'glen-cove-creamery', 'scoop_shop', '50 School St', 'Glen Cove', 'NY', '11542', NULL, false, true, ST_MakePoint(-73.6328, 40.8625)::geography),
('Oyster Bay Ice Cream', 'oyster-bay-ice-cream', 'scoop_shop', '78 South St', 'Oyster Bay', 'NY', '11771', NULL, true, true, ST_MakePoint(-73.5301, 40.8729)::geography),
('Hicksville Freeze', 'hicksville-freeze', 'scoop_shop', '135 Broadway', 'Hicksville', 'NY', '11801', NULL, false, true, ST_MakePoint(-73.5850, 40.7639)::geography),
('Bethpage Creamery', 'bethpage-creamery', 'scoop_shop', '4008 Hempstead Tpke', 'Bethpage', 'NY', '11714', NULL, false, true, ST_MakePoint(-73.4840, 40.7451)::geography),
('Levittown Cones', 'levittown-cones', 'scoop_shop', '3250 Hempstead Tpke', 'Levittown', 'NY', '11756', NULL, false, true, ST_MakePoint(-73.5134, 40.7248)::geography),
('Farmingdale Scoops', 'farmingdale-scoops', 'scoop_shop', '255 Main St', 'Farmingdale', 'NY', '11735', NULL, false, true, ST_MakePoint(-73.4454, 40.7325)::geography),
('Massapequa Creamery', 'massapequa-creamery-park', 'scoop_shop', '4948 Merrick Rd', 'Massapequa Park', 'NY', '11762', NULL, false, true, ST_MakePoint(-73.4563, 40.6718)::geography),
('Wantagh Freeze', 'wantagh-freeze', 'scoop_shop', '3464 Merrick Rd', 'Wantagh', 'NY', '11793', NULL, false, true, ST_MakePoint(-73.5107, 40.6685)::geography),
('Bellmore Ice Cream', 'bellmore-ice-cream', 'scoop_shop', '2718 Merrick Rd', 'Bellmore', 'NY', '11710', NULL, false, true, ST_MakePoint(-73.5281, 40.6629)::geography),
('Freeport Creamery', 'freeport-creamery', 'scoop_shop', '36 W Merrick Rd', 'Freeport', 'NY', '11520', NULL, false, true, ST_MakePoint(-73.5832, 40.6542)::geography),
('Hempstead Cones', 'hempstead-cones', 'scoop_shop', '221 Fulton Ave', 'Hempstead', 'NY', '11550', NULL, false, true, ST_MakePoint(-73.6190, 40.7061)::geography),
('Rockville Centre Gelato', 'rockville-centre-gelato', 'scoop_shop', '242 Sunrise Hwy', 'Rockville Centre', 'NY', '11570', NULL, false, true, ST_MakePoint(-73.6428, 40.6601)::geography),
('Lynbrook Ice Cream', 'lynbrook-ice-cream', 'scoop_shop', '4 Atlantic Ave', 'Lynbrook', 'NY', '11563', NULL, false, true, ST_MakePoint(-73.6717, 40.6555)::geography),
('Valley Stream Scoops', 'valley-stream-scoops', 'scoop_shop', '140 N Central Ave', 'Valley Stream', 'NY', '11580', NULL, false, true, ST_MakePoint(-73.7077, 40.6653)::geography),
('Long Beach Creamery', 'long-beach-creamery', 'scoop_shop', '120 E Park Ave', 'Long Beach', 'NY', '11561', NULL, false, true, ST_MakePoint(-73.6579, 40.5884)::geography),
('Cold Spring Harbor Scoops', 'cold-spring-harbor-scoops', 'scoop_shop', '88 Main St', 'Cold Spring Harbor', 'NY', '11724', NULL, false, true, ST_MakePoint(-73.4578, 40.8714)::geography),
('Roslyn Creamery', 'roslyn-creamery', 'scoop_shop', '1401 Old Northern Blvd', 'Roslyn', 'NY', '11576', NULL, false, true, ST_MakePoint(-73.6517, 40.7931)::geography),
('Sea Cliff Ice Cream', 'sea-cliff-ice-cream', 'scoop_shop', '312 Sea Cliff Ave', 'Sea Cliff', 'NY', '11579', NULL, false, true, ST_MakePoint(-73.6443, 40.8487)::geography),
('Merrick Scoops', 'merrick-scoops', 'scoop_shop', '2147 Merrick Ave', 'Merrick', 'NY', '11566', NULL, false, true, ST_MakePoint(-73.5510, 40.6612)::geography),
('Oceanside Freeze', 'oceanside-freeze', 'scoop_shop', '3081 Long Beach Rd', 'Oceanside', 'NY', '11572', NULL, false, true, ST_MakePoint(-73.6365, 40.6384)::geography),
('Carvel - Garden City', 'carvel-garden-city', 'scoop_shop', '300 Nassau Blvd', 'Garden City', 'NY', '11530', NULL, false, true, ST_MakePoint(-73.6434, 40.7177)::geography),
('Baskin-Robbins - Hicksville', 'baskin-robbins-hicksville', 'scoop_shop', '400 S Broadway', 'Hicksville', 'NY', '11801', NULL, false, true, ST_MakePoint(-73.5853, 40.7576)::geography),
('Dairy Queen - Levittown', 'dairy-queen-levittown', 'scoop_shop', '3028 Hempstead Tpke', 'Levittown', 'NY', '11756', NULL, false, true, ST_MakePoint(-73.5179, 40.7247)::geography),
('Whole Foods - Garden City', 'whole-foods-garden-city', 'supermarket', '940 Old Country Rd', 'Garden City', 'NY', '11530', NULL, false, true, ST_MakePoint(-73.6211, 40.7386)::geography),
('Trader Joe''s - Great Neck', 'trader-joes-great-neck', 'supermarket', '48 S Middle Neck Rd', 'Great Neck', 'NY', '11021', NULL, false, true, ST_MakePoint(-73.7290, 40.7935)::geography),
('ShopRite - Bethpage', 'shoprite-bethpage', 'supermarket', '4055 Hempstead Tpke', 'Bethpage', 'NY', '11714', NULL, false, true, ST_MakePoint(-73.4827, 40.7450)::geography),
('Stop & Shop - Farmingdale', 'stop-shop-farmingdale', 'supermarket', '999 Conklin St', 'Farmingdale', 'NY', '11735', NULL, false, true, ST_MakePoint(-73.4378, 40.7215)::geography),
('Plainview Creamery', 'plainview-creamery', 'scoop_shop', '444 S Oyster Bay Rd', 'Plainview', 'NY', '11803', NULL, false, true, ST_MakePoint(-73.4674, 40.7666)::geography),
('Syosset Scoops', 'syosset-scoops', 'scoop_shop', '32 Berry Hill Rd', 'Syosset', 'NY', '11791', NULL, false, true, ST_MakePoint(-73.5015, 40.8148)::geography),
('Jericho Creamery', 'jericho-creamery', 'scoop_shop', '328 N Broadway', 'Jericho', 'NY', '11753', NULL, false, true, ST_MakePoint(-73.5379, 40.7901)::geography),
('Westbury Cones', 'westbury-cones', 'scoop_shop', '414 Post Ave', 'Westbury', 'NY', '11590', NULL, false, true, ST_MakePoint(-73.5872, 40.7570)::geography),
('New Hyde Park Gelato', 'new-hyde-park-gelato', 'scoop_shop', '1407 Jericho Tpke', 'New Hyde Park', 'NY', '11040', NULL, false, true, ST_MakePoint(-73.6842, 40.7399)::geography),
('Floral Park Scoops', 'floral-park-scoops', 'scoop_shop', '252 Jericho Tpke', 'Floral Park', 'NY', '11001', NULL, false, true, ST_MakePoint(-73.7011, 40.7234)::geography),
('East Meadow Freeze', 'east-meadow-freeze', 'scoop_shop', '2340 Hempstead Tpke', 'East Meadow', 'NY', '11554', NULL, false, true, ST_MakePoint(-73.5560, 40.7190)::geography),
('Seaford Creamery', 'seaford-creamery', 'scoop_shop', '3878 Merrick Rd', 'Seaford', 'NY', '11783', NULL, false, true, ST_MakePoint(-73.4873, 40.6695)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- MORE LONG ISLAND - SUFFOLK COUNTY (40)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Smithtown Creamery', 'smithtown-creamery', 'scoop_shop', '81 E Main St', 'Smithtown', 'NY', '11787', NULL, false, true, ST_MakePoint(-73.2006, 40.8558)::geography),
('Commack Cones', 'commack-cones', 'scoop_shop', '170 Commack Rd', 'Commack', 'NY', '11725', NULL, false, true, ST_MakePoint(-73.2929, 40.8428)::geography),
('Babylon Village Creamery', 'babylon-village-creamery', 'scoop_shop', '14 E Main St', 'Babylon', 'NY', '11702', NULL, true, true, ST_MakePoint(-73.3259, 40.6956)::geography),
('Islip Ice Cream', 'islip-ice-cream', 'scoop_shop', '50 Main St', 'Islip', 'NY', '11751', NULL, false, true, ST_MakePoint(-73.2102, 40.7298)::geography),
('Patchogue Scoops', 'patchogue-scoops', 'scoop_shop', '35 N Ocean Ave', 'Patchogue', 'NY', '11772', NULL, false, true, ST_MakePoint(-72.9985, 40.7657)::geography),
('Sayville Ice Cream', 'sayville-ice-cream', 'scoop_shop', '98 Main St', 'Sayville', 'NY', '11782', NULL, false, true, ST_MakePoint(-73.0818, 40.7356)::geography),
('Montauk Ice Cream', 'montauk-ice-cream', 'scoop_shop', '474 W Lake Dr', 'Montauk', 'NY', '11954', NULL, true, true, ST_MakePoint(-71.9553, 41.0713)::geography),
('John''s Drive-In - Montauk', 'johns-drive-in-montauk', 'scoop_shop', '677 Montauk Hwy', 'Montauk', 'NY', '11954', NULL, true, true, ST_MakePoint(-71.9397, 41.0515)::geography),
('Greenport Creamery', 'greenport-creamery', 'scoop_shop', '109 Front St', 'Greenport', 'NY', '11944', NULL, false, true, ST_MakePoint(-72.3593, 41.1034)::geography),
('Shelter Island Ice Cream', 'shelter-island-ice-cream', 'scoop_shop', '15 N Ferry Rd', 'Shelter Island', 'NY', '11964', NULL, false, true, ST_MakePoint(-72.3368, 41.0684)::geography),
('Huntington Village Scoops', 'huntington-village-scoops', 'scoop_shop', '351 New York Ave', 'Huntington', 'NY', '11743', NULL, false, true, ST_MakePoint(-73.4257, 40.8698)::geography),
('Cold Spring Harbor Gelato', 'cold-spring-harbor-gelato', 'scoop_shop', '4 Main St', 'Cold Spring Harbor', 'NY', '11724', NULL, false, true, ST_MakePoint(-73.4580, 40.8718)::geography),
('Northport Creamery', 'northport-creamery', 'scoop_shop', '89 Main St', 'Northport', 'NY', '11768', NULL, false, true, ST_MakePoint(-73.3444, 40.9008)::geography),
('Bay Shore Cones', 'bay-shore-cones', 'scoop_shop', '56 E Main St', 'Bay Shore', 'NY', '11706', NULL, false, true, ST_MakePoint(-73.2450, 40.7253)::geography),
('Lindenhurst Freeze', 'lindenhurst-freeze', 'scoop_shop', '200 S Wellwood Ave', 'Lindenhurst', 'NY', '11757', NULL, false, true, ST_MakePoint(-73.3732, 40.6822)::geography),
('Amityville Creamery', 'amityville-creamery', 'scoop_shop', '163 Broadway', 'Amityville', 'NY', '11701', NULL, false, true, ST_MakePoint(-73.4177, 40.6787)::geography),
('West Islip Ice Cream', 'west-islip-ice-cream', 'scoop_shop', '560 Montauk Hwy', 'West Islip', 'NY', '11795', NULL, false, true, ST_MakePoint(-73.2906, 40.7066)::geography),
('Centerport Scoops', 'centerport-scoops', 'scoop_shop', '176 Centerport Rd', 'Centerport', 'NY', '11721', NULL, false, true, ST_MakePoint(-73.3747, 40.8924)::geography),
('Stony Brook Creamery', 'stony-brook-creamery', 'scoop_shop', '114 Main St', 'Stony Brook', 'NY', '11790', NULL, false, true, ST_MakePoint(-73.1410, 40.9264)::geography),
('Port Jefferson Scoops', 'port-jefferson-scoops', 'scoop_shop', '115 E Main St', 'Port Jefferson', 'NY', '11777', NULL, false, true, ST_MakePoint(-73.0692, 40.9467)::geography),
('Setauket Creamery', 'setauket-creamery', 'scoop_shop', '201 Main St', 'East Setauket', 'NY', '11733', NULL, false, true, ST_MakePoint(-73.1077, 40.9467)::geography),
('Ronkonkoma Ice Cream', 'ronkonkoma-ice-cream', 'scoop_shop', '215 Portion Rd', 'Lake Ronkonkoma', 'NY', '11779', NULL, false, true, ST_MakePoint(-73.1069, 40.8126)::geography),
('Medford Freeze', 'medford-freeze', 'scoop_shop', '2964 Route 112', 'Medford', 'NY', '11763', NULL, false, true, ST_MakePoint(-72.9851, 40.8136)::geography),
('Riverhead Creamery', 'riverhead-creamery', 'scoop_shop', '72 E Main St', 'Riverhead', 'NY', '11901', NULL, false, true, ST_MakePoint(-72.6630, 40.9164)::geography),
('Hampton Bays Scoops', 'hampton-bays-scoops', 'scoop_shop', '45 W Montauk Hwy', 'Hampton Bays', 'NY', '11946', NULL, false, true, ST_MakePoint(-72.5218, 40.8699)::geography),
('Sag Harbor Ice Cream', 'sag-harbor-ice-cream', 'scoop_shop', '63 Main St', 'Sag Harbor', 'NY', '11963', NULL, true, true, ST_MakePoint(-72.2926, 40.9999)::geography),
('East Hampton Gelato', 'east-hampton-gelato', 'scoop_shop', '74 Main St', 'East Hampton', 'NY', '11937', NULL, false, true, ST_MakePoint(-72.1847, 40.9634)::geography),
('Southampton Creamery', 'southampton-creamery', 'scoop_shop', '56 Main St', 'Southampton', 'NY', '11968', NULL, false, true, ST_MakePoint(-72.3895, 40.8846)::geography),
('Westhampton Beach Freeze', 'westhampton-beach-freeze', 'scoop_shop', '115 Main St', 'Westhampton Beach', 'NY', '11978', NULL, false, true, ST_MakePoint(-72.6476, 40.8073)::geography),
('Carvel - Smithtown', 'carvel-smithtown', 'scoop_shop', '724 Smithtown Bypass', 'Smithtown', 'NY', '11787', NULL, false, true, ST_MakePoint(-73.2065, 40.8515)::geography),
('Baskin-Robbins - Commack', 'baskin-robbins-commack', 'scoop_shop', '2015 Jericho Tpke', 'Commack', 'NY', '11725', NULL, false, true, ST_MakePoint(-73.2866, 40.8434)::geography),
('Dairy Queen - Patchogue', 'dairy-queen-patchogue', 'scoop_shop', '475 Sunrise Hwy', 'Patchogue', 'NY', '11772', NULL, false, true, ST_MakePoint(-73.0133, 40.7614)::geography),
('Whole Foods - Commack', 'whole-foods-commack', 'supermarket', '6000 Jericho Tpke', 'Commack', 'NY', '11725', NULL, false, true, ST_MakePoint(-73.2668, 40.8426)::geography),
('Stop & Shop - Smithtown', 'stop-shop-smithtown', 'supermarket', '1 Edgewater Ave', 'Smithtown', 'NY', '11787', NULL, false, true, ST_MakePoint(-73.1997, 40.8626)::geography),
('King Kullen - Bay Shore', 'king-kullen-bay-shore', 'supermarket', '1730 Sunrise Hwy', 'Bay Shore', 'NY', '11706', NULL, false, true, ST_MakePoint(-73.2329, 40.7329)::geography),
('Mattituck Creamery', 'mattituck-creamery', 'scoop_shop', '10050 Main Rd', 'Mattituck', 'NY', '11952', NULL, false, true, ST_MakePoint(-72.5318, 40.9907)::geography),
('Cutchogue Farmstand Ice Cream', 'cutchogue-farmstand', 'farmers_market', '26405 Main Rd', 'Cutchogue', 'NY', '11935', NULL, false, true, ST_MakePoint(-72.4809, 41.0106)::geography),
('Orient Point Scoops', 'orient-point-scoops', 'scoop_shop', '44965 Main Rd', 'Orient', 'NY', '11957', NULL, false, true, ST_MakePoint(-72.3004, 41.1370)::geography),
('Fire Island Creamery', 'fire-island-creamery', 'scoop_shop', '1 Bay Walk', 'Ocean Beach', 'NY', '11770', NULL, false, true, ST_MakePoint(-73.1558, 40.6466)::geography),
('Amagansett Scoops', 'amagansett-scoops', 'scoop_shop', '203 Main St', 'Amagansett', 'NY', '11930', NULL, false, true, ST_MakePoint(-72.1494, 40.9738)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHILADELPHIA - CENTER CITY (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Franklin Fountain', 'franklin-fountain-philly', 'scoop_shop', '116 Market St', 'Philadelphia', 'PA', '19106', 'franklinfountain', true, true, ST_MakePoint(-75.1439, 39.9505)::geography),
('Bassetts Ice Cream', 'bassetts-ice-cream-rtm', 'scoop_shop', '51 N 12th St', 'Philadelphia', 'PA', '19107', 'bassettsicecream', true, true, ST_MakePoint(-75.1590, 39.9528)::geography),
('Scoop DeVille - Rittenhouse', 'scoop-deville-rittenhouse', 'scoop_shop', '1524 Chestnut St', 'Philadelphia', 'PA', '19102', NULL, false, true, ST_MakePoint(-75.1657, 39.9512)::geography),
('Capogiro Gelato - 13th St', 'capogiro-13th-st', 'scoop_shop', '119 S 13th St', 'Philadelphia', 'PA', '19107', 'capogirogelato', true, true, ST_MakePoint(-75.1611, 39.9489)::geography),
('Cold Stone - Walnut St', 'cold-stone-walnut-philly', 'scoop_shop', '1735 Walnut St', 'Philadelphia', 'PA', '19103', NULL, false, true, ST_MakePoint(-75.1697, 39.9505)::geography),
('Old City Creamery', 'old-city-creamery-philly', 'scoop_shop', '222 Market St', 'Philadelphia', 'PA', '19106', NULL, false, true, ST_MakePoint(-75.1435, 39.9512)::geography),
('Rittenhouse Gelato', 'rittenhouse-gelato', 'scoop_shop', '1900 Sansom St', 'Philadelphia', 'PA', '19103', NULL, false, true, ST_MakePoint(-75.1710, 39.9509)::geography),
('Little Baby''s Ice Cream - CC', 'little-babys-cc', 'scoop_shop', '2311 Spruce St', 'Philadelphia', 'PA', '19103', 'littlebabysic', true, true, ST_MakePoint(-75.1773, 39.9469)::geography),
('South St Scoops', 'south-st-scoops-philly', 'scoop_shop', '400 South St', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1495, 39.9407)::geography),
('Penn''s Landing Creamery', 'penns-landing-creamery', 'scoop_shop', '101 S Columbus Blvd', 'Philadelphia', 'PA', '19106', NULL, false, true, ST_MakePoint(-75.1404, 39.9470)::geography),
('Logan Square Freeze', 'logan-square-freeze', 'scoop_shop', '1 Logan Sq', 'Philadelphia', 'PA', '19103', NULL, false, true, ST_MakePoint(-75.1715, 39.9574)::geography),
('Chinatown Ice Cream', 'chinatown-ice-cream-philly', 'scoop_shop', '901 Race St', 'Philadelphia', 'PA', '19107', NULL, false, true, ST_MakePoint(-75.1552, 39.9559)::geography),
('Wawa - Broad & Walnut', 'wawa-broad-walnut', 'supermarket', '1500 Walnut St', 'Philadelphia', 'PA', '19102', NULL, false, true, ST_MakePoint(-75.1658, 39.9497)::geography),
('Whole Foods - Center City', 'whole-foods-cc-philly', 'supermarket', '929 South St', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1559, 39.9410)::geography),
('Trader Joe''s - Center City', 'trader-joes-cc-philly', 'supermarket', '2121 Market St', 'Philadelphia', 'PA', '19103', NULL, false, true, ST_MakePoint(-75.1752, 39.9537)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHILADELPHIA - UNIVERSITY CITY / WEST PHILLY (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Milk Jawn', 'milk-jawn-ucity', 'scoop_shop', '3640 Lancaster Ave', 'Philadelphia', 'PA', '19104', 'milkjawn', true, true, ST_MakePoint(-75.1953, 39.9600)::geography),
('University City Creamery', 'ucity-creamery', 'scoop_shop', '3411 Walnut St', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.1914, 39.9527)::geography),
('Drexel Scoops', 'drexel-scoops', 'scoop_shop', '3201 Chestnut St', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.1882, 39.9550)::geography),
('Clark Park Creamery', 'clark-park-creamery', 'scoop_shop', '4350 Baltimore Ave', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.2096, 39.9483)::geography),
('Cedar Park Cones', 'cedar-park-cones', 'scoop_shop', '4900 Baltimore Ave', 'Philadelphia', 'PA', '19143', NULL, false, true, ST_MakePoint(-75.2180, 39.9454)::geography),
('Dock St Creamery', 'dock-st-creamery', 'restaurant', '2118 Washington Ave', 'Philadelphia', 'PA', '19146', NULL, false, true, ST_MakePoint(-75.1751, 39.9395)::geography),
('Rita''s - University City', 'ritas-ucity', 'scoop_shop', '115 S 40th St', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.1997, 39.9531)::geography),
('Spruce Hill Scoops', 'spruce-hill-scoops', 'scoop_shop', '4308 Spruce St', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.2055, 39.9504)::geography),
('Cobbs Creek Creamery', 'cobbs-creek-creamery', 'scoop_shop', '6125 Market St', 'Philadelphia', 'PA', '19139', NULL, false, true, ST_MakePoint(-75.2375, 39.9603)::geography),
('Whole Foods - U City', 'whole-foods-ucity', 'supermarket', '3401 Walnut St', 'Philadelphia', 'PA', '19104', NULL, false, true, ST_MakePoint(-75.1912, 39.9527)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHILADELPHIA - SOUTH PHILLY / ITALIAN MARKET (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Capogiro - S 9th St', 'capogiro-9th-st', 'scoop_shop', '1625 E Passyunk Ave', 'Philadelphia', 'PA', '19148', 'capogirogelato', true, true, ST_MakePoint(-75.1588, 39.9330)::geography),
('Italian Market Gelato', 'italian-market-gelato', 'scoop_shop', '919 S 9th St', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1574, 39.9389)::geography),
('Passyunk Creamery', 'passyunk-creamery', 'scoop_shop', '1501 E Passyunk Ave', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1603, 39.9346)::geography),
('Dairy Queen - Oregon Ave', 'dairy-queen-oregon-ave', 'scoop_shop', '2300 Oregon Ave', 'Philadelphia', 'PA', '19145', NULL, false, true, ST_MakePoint(-75.1779, 39.9164)::geography),
('Packer Park Scoops', 'packer-park-scoops', 'scoop_shop', '2001 Packer Ave', 'Philadelphia', 'PA', '19145', NULL, false, true, ST_MakePoint(-75.1718, 39.9126)::geography),
('Point Breeze Creamery', 'point-breeze-creamery', 'scoop_shop', '1500 S Broad St', 'Philadelphia', 'PA', '19146', NULL, false, true, ST_MakePoint(-75.1685, 39.9308)::geography),
('Dickinson Narrows Scoops', 'dickinson-narrows-scoops', 'scoop_shop', '1143 S 2nd St', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1440, 39.9377)::geography),
('Mifflin Square Freeze', 'mifflin-square-freeze', 'scoop_shop', '703 Wolf St', 'Philadelphia', 'PA', '19148', NULL, false, true, ST_MakePoint(-75.1528, 39.9260)::geography),
('Pennsport Creamery', 'pennsport-creamery', 'scoop_shop', '300 Moore St', 'Philadelphia', 'PA', '19148', NULL, false, true, ST_MakePoint(-75.1472, 39.9300)::geography),
('Farmstand at Italian Market', 'farmstand-italian-market', 'farmers_market', '1001 S 9th St', 'Philadelphia', 'PA', '19147', NULL, false, true, ST_MakePoint(-75.1570, 39.9379)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHILADELPHIA - NORTHERN LIBERTIES / FISHTOWN (10)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Weckerly''s Ice Cream', 'weckerlys-ice-cream', 'scoop_shop', '9 W Girard Ave', 'Philadelphia', 'PA', '19123', 'weckerlys', true, true, ST_MakePoint(-75.1431, 39.9676)::geography),
('Fishtown Freeze', 'fishtown-freeze', 'scoop_shop', '1220 Frankford Ave', 'Philadelphia', 'PA', '19125', NULL, false, true, ST_MakePoint(-75.1297, 39.9726)::geography),
('Kensington Creamery', 'kensington-creamery', 'scoop_shop', '1502 Frankford Ave', 'Philadelphia', 'PA', '19125', NULL, false, true, ST_MakePoint(-75.1265, 39.9763)::geography),
('Northern Liberties Gelato', 'nolibs-gelato', 'scoop_shop', '600 N 2nd St', 'Philadelphia', 'PA', '19123', NULL, false, true, ST_MakePoint(-75.1414, 39.9636)::geography),
('Girard Ave Scoops', 'girard-ave-scoops', 'scoop_shop', '935 W Girard Ave', 'Philadelphia', 'PA', '19123', NULL, false, true, ST_MakePoint(-75.1543, 39.9683)::geography),
('Piazza Creamery', 'piazza-creamery-philly', 'scoop_shop', '1001 N 2nd St', 'Philadelphia', 'PA', '19123', NULL, false, true, ST_MakePoint(-75.1382, 39.9665)::geography),
('Frankford Hall Ice Cream', 'frankford-hall-ice-cream', 'restaurant', '1210 Frankford Ave', 'Philadelphia', 'PA', '19125', NULL, false, true, ST_MakePoint(-75.1303, 39.9720)::geography),
('Spring Garden Scoops', 'spring-garden-scoops', 'scoop_shop', '801 Spring Garden St', 'Philadelphia', 'PA', '19123', NULL, false, true, ST_MakePoint(-75.1522, 39.9613)::geography),
('Callowhill Creamery', 'callowhill-creamery', 'scoop_shop', '420 Callowhill St', 'Philadelphia', 'PA', '19123', NULL, false, true, ST_MakePoint(-75.1472, 39.9595)::geography),
('Front St Freeze', 'front-st-freeze-philly', 'scoop_shop', '1 N Front St', 'Philadelphia', 'PA', '19106', NULL, false, true, ST_MakePoint(-75.1396, 39.9509)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PHILADELPHIA - MAIN LINE SUBURBS (15)
-- ============================================
INSERT INTO locations (name, slug, location_type, address_line1, city, state, zip, instagram, is_claimed, is_active, coordinates)
VALUES
('Bryn Mawr Creamery', 'bryn-mawr-creamery', 'scoop_shop', '824 W Lancaster Ave', 'Bryn Mawr', 'PA', '19010', NULL, true, true, ST_MakePoint(-75.3177, 40.0205)::geography),
('Ardmore Gelato', 'ardmore-gelato', 'scoop_shop', '36 W Lancaster Ave', 'Ardmore', 'PA', '19003', NULL, false, true, ST_MakePoint(-75.2863, 40.0089)::geography),
('Wayne Scoops', 'wayne-scoops', 'scoop_shop', '166 N Wayne Ave', 'Wayne', 'PA', '19087', NULL, false, true, ST_MakePoint(-75.3878, 40.0441)::geography),
('King of Prussia Ice Cream', 'kop-ice-cream', 'scoop_shop', '160 N Gulph Rd', 'King of Prussia', 'PA', '19406', NULL, false, true, ST_MakePoint(-75.3919, 40.0886)::geography),
('Narberth Cones', 'narberth-cones', 'scoop_shop', '227 Haverford Ave', 'Narberth', 'PA', '19072', NULL, false, true, ST_MakePoint(-75.2621, 40.0081)::geography),
('Haverford Creamery', 'haverford-creamery', 'scoop_shop', '546 Station Ave', 'Haverford', 'PA', '19041', NULL, false, true, ST_MakePoint(-75.2998, 40.0133)::geography),
('Rosemont Gelato', 'rosemont-gelato', 'scoop_shop', '1149 Lancaster Ave', 'Rosemont', 'PA', '19010', NULL, false, true, ST_MakePoint(-75.3290, 40.0248)::geography),
('Villanova Scoops', 'villanova-scoops', 'scoop_shop', '789 E Lancaster Ave', 'Villanova', 'PA', '19085', NULL, false, true, ST_MakePoint(-75.3426, 40.0378)::geography),
('Devon Ice Cream', 'devon-ice-cream', 'scoop_shop', '301 W Lancaster Ave', 'Devon', 'PA', '19333', NULL, false, true, ST_MakePoint(-75.4155, 40.0507)::geography),
('Media Creamery', 'media-creamery-pa', 'scoop_shop', '22 E State St', 'Media', 'PA', '19063', NULL, true, true, ST_MakePoint(-75.3883, 39.9165)::geography),
('Conshohocken Cones', 'conshohocken-cones', 'scoop_shop', '31 Fayette St', 'Conshohocken', 'PA', '19428', NULL, false, true, ST_MakePoint(-75.3016, 40.0785)::geography),
('Swarthmore Scoops', 'swarthmore-scoops', 'scoop_shop', '100 Park Ave', 'Swarthmore', 'PA', '19081', NULL, false, true, ST_MakePoint(-75.3494, 39.9019)::geography),
('Whole Foods - KoP', 'whole-foods-kop', 'supermarket', '240 N Gulph Rd', 'King of Prussia', 'PA', '19406', NULL, false, true, ST_MakePoint(-75.3897, 40.0912)::geography),
('Trader Joe''s - Wayne', 'trader-joes-wayne', 'supermarket', '821 W Lancaster Ave', 'Wayne', 'PA', '19087', NULL, false, true, ST_MakePoint(-75.3879, 40.0447)::geography),
('Wegmans - Malvern', 'wegmans-malvern', 'supermarket', '50 Founders Way', 'Malvern', 'PA', '19355', NULL, false, true, ST_MakePoint(-75.5213, 40.0599)::geography)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- VERIFY COUNT
-- ============================================
-- SELECT count(*) FROM locations;
-- Expected: seed 001 (~60) + seed 002 (~209) + seed 003 (~540) = ~810 locations
