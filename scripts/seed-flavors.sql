-- ═══════════════════════════════════════════════════════════════
-- STEP 1: Add unique index on flavors.slug for upserts
-- ═══════════════════════════════════════════════════════════════
CREATE UNIQUE INDEX IF NOT EXISTS idx_flavors_slug ON flavors(slug);

-- ═══════════════════════════════════════════════════════════════
-- STEP 2: Insert missing chain brands
-- ═══════════════════════════════════════════════════════════════
INSERT INTO brands (name, slug, brand_type, description) VALUES
  ('Cold Stone Creamery', 'cold-stone-creamery', 'national', 'Mix-in ice cream chain'),
  ('Dairy Queen', 'dairy-queen', 'national', 'Soft-serve and Blizzard chain'),
  ('Friendly''s', 'friendlys', 'regional', 'New England ice cream restaurant chain'),
  ('Insomnia Cookies', 'insomnia-cookies', 'national', 'Late-night cookies and ice cream'),
  ('Hoffman''s Ice Cream', 'hoffmans-ice-cream', 'local_creamery', 'Long Island craft ice cream'),
  ('Arethusa Farm Dairy', 'arethusa-farm-dairy', 'local_creamery', 'Farm-fresh Connecticut ice cream'),
  ('Milk Bar', 'milk-bar', 'artisan', 'Christina Tosi dessert brand')
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- STEP 3: Insert classic/generic flavors (no brand)
-- ═══════════════════════════════════════════════════════════════
INSERT INTO flavors (name, slug, category, tags) VALUES
  ('Vanilla', 'vanilla', 'classic', '{"classic","creamy"}'),
  ('Chocolate', 'chocolate', 'chocolate', '{"classic","chocolate"}'),
  ('Strawberry', 'strawberry', 'fruit', '{"classic","fruit"}'),
  ('Mint Chocolate Chip', 'mint-chocolate-chip', 'classic', '{"classic","mint","chocolate"}'),
  ('Cookies and Cream', 'cookies-and-cream', 'classic', '{"classic","cookies"}'),
  ('Cookie Dough', 'cookie-dough', 'classic', '{"classic","cookie dough"}'),
  ('Butter Pecan', 'butter-pecan', 'nut', '{"classic","nut","butter"}'),
  ('Rocky Road', 'rocky-road', 'chocolate', '{"classic","chocolate","nuts","marshmallow"}'),
  ('Pistachio', 'pistachio', 'nut', '{"classic","nut"}'),
  ('Coffee', 'coffee', 'classic', '{"classic","coffee"}'),
  ('Dulce de Leche', 'dulce-de-leche', 'classic', '{"caramel","sweet"}'),
  ('Rum Raisin', 'rum-raisin', 'classic', '{"classic","raisin"}'),
  ('Peanut Butter Cup', 'peanut-butter-cup', 'nut', '{"peanut butter","chocolate"}'),
  ('Salted Caramel', 'salted-caramel', 'classic', '{"caramel","salty-sweet"}'),
  ('Black Cherry', 'black-cherry', 'fruit', '{"fruit","cherry"}'),
  ('Mango', 'mango', 'fruit', '{"fruit","tropical"}'),
  ('Coconut', 'coconut', 'fruit', '{"tropical","creamy"}'),
  ('Lemon Sorbet', 'lemon-sorbet', 'sorbet', '{"sorbet","citrus","dairy-free"}'),
  ('Rainbow Sorbet', 'rainbow-sorbet', 'sorbet', '{"sorbet","fruit","dairy-free"}'),
  ('Chocolate Chip', 'chocolate-chip', 'classic', '{"classic","chocolate"}'),
  ('French Vanilla', 'french-vanilla', 'classic', '{"classic","creamy","custard"}'),
  ('Neapolitan', 'neapolitan', 'classic', '{"classic","trio"}'),
  ('Cotton Candy', 'cotton-candy', 'novelty', '{"kids","sweet","colorful"}'),
  ('Birthday Cake', 'birthday-cake', 'novelty', '{"sprinkles","sweet","cake"}'),
  ('Ube', 'ube', 'novelty', '{"filipino","purple","sweet potato"}'),
  ('Matcha', 'matcha', 'novelty', '{"japanese","green tea"}'),
  ('Brownie Batter', 'brownie-batter', 'chocolate', '{"chocolate","brownie"}'),
  ('S''mores', 'smores', 'novelty', '{"marshmallow","graham","chocolate"}'),
  ('Chocolate Peanut Butter', 'chocolate-peanut-butter', 'chocolate', '{"chocolate","peanut butter"}'),
  ('Strawberry Cheesecake', 'strawberry-cheesecake', 'fruit', '{"strawberry","cheesecake"}')
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- STEP 4: Insert chain-specific flavors
-- ═══════════════════════════════════════════════════════════════

-- BASKIN-ROBBINS
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Jamoca Almond Fudge', 'br-jamoca-almond-fudge', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"coffee","almond","fudge"}'),
  ('Pralines ''n Cream', 'br-pralines-n-cream', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"praline","caramel","pecan"}'),
  ('Gold Medal Ribbon', 'br-gold-medal-ribbon', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'classic', '{"caramel","chocolate","vanilla"}'),
  ('World Class Chocolate', 'br-world-class-chocolate', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'chocolate', '{"chocolate","rich"}'),
  ('Mint Chocolate Chip', 'br-mint-chocolate-chip', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'classic', '{"mint","chocolate"}'),
  ('Very Berry Strawberry', 'br-very-berry-strawberry', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'fruit', '{"strawberry","fruit"}'),
  ('Peanut Butter ''n Chocolate', 'br-peanut-butter-n-chocolate', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"peanut butter","chocolate"}'),
  ('Baseball Nut', 'br-baseball-nut', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"cashew","rum"}'),
  ('Reese''s Peanut Butter Cup', 'br-reeses-peanut-butter-cup', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"reeses","peanut butter","chocolate"}'),
  ('Chocolate Chip Cookie Dough', 'br-chocolate-chip-cookie-dough', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'classic', '{"cookie dough","chocolate chip"}'),
  ('Old Fashioned Butter Pecan', 'br-old-fashioned-butter-pecan', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'nut', '{"butter pecan","classic"}'),
  ('Oreo Cookies ''n Cream', 'br-oreo-cookies-n-cream', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'classic', '{"oreo","cookies"}'),
  ('Daiquiri Ice', 'br-daiquiri-ice', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'sorbet', '{"lime","rum","refreshing"}'),
  ('OREO ''n Caramel', 'br-oreo-n-caramel', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'classic', '{"oreo","caramel"}'),
  ('Love Potion #31', 'br-love-potion-31', (SELECT id FROM brands WHERE slug='baskin-robbins'), 'novelty', '{"raspberry","chocolate"}')
ON CONFLICT (slug) DO NOTHING;

-- COLD STONE CREAMERY
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Birthday Cake Remix', 'cs-birthday-cake-remix', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'novelty', '{"cake batter","sprinkles","brownie"}'),
  ('Founder''s Favorite', 'cs-founders-favorite', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'classic', '{"sweet cream","brownie","fudge","caramel"}'),
  ('Peanut Butter Cup Perfection', 'cs-pb-cup-perfection', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'nut', '{"chocolate","peanut butter","reeses"}'),
  ('Mud Pie Mojo', 'cs-mud-pie-mojo', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'chocolate', '{"coffee","oreo","peanut butter","fudge"}'),
  ('Sweet Cream', 'cs-sweet-cream', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'classic', '{"sweet cream","signature"}'),
  ('Cake Batter', 'cs-cake-batter', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'novelty', '{"cake batter","sweet"}'),
  ('Coffee Lovers Only', 'cs-coffee-lovers-only', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'classic', '{"coffee","heath","fudge"}'),
  ('Cheesecake Fantasy', 'cs-cheesecake-fantasy', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'classic', '{"cheesecake","strawberry","blueberry","graham"}'),
  ('Cookie Mintster', 'cs-cookie-mintster', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'classic', '{"mint","oreo","fudge"}'),
  ('Chocolate Devotion', 'cs-chocolate-devotion', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'chocolate', '{"chocolate","brownie","fudge"}'),
  ('Berry Berry Berry Good', 'cs-berry-berry-berry-good', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'fruit', '{"berry","strawberry","blueberry","raspberry"}'),
  ('Apple Pie a la Cold Stone', 'cs-apple-pie', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'fruit', '{"apple","cinnamon","pie crust","caramel"}'),
  ('Germanchokolatcake', 'cs-germanchokolatcake', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'chocolate', '{"german chocolate","coconut","caramel"}'),
  ('Our Strawberry Blonde', 'cs-our-strawberry-blonde', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'fruit', '{"strawberry","graham","caramel"}'),
  ('Cotton Candy', 'cs-cotton-candy', (SELECT id FROM brands WHERE slug='cold-stone-creamery'), 'novelty', '{"cotton candy","kids","colorful"}')
ON CONFLICT (slug) DO NOTHING;

-- CARVEL
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Vanilla', 'carvel-vanilla', (SELECT id FROM brands WHERE slug='carvel'), 'classic', '{"classic","soft-serve"}'),
  ('Chocolate', 'carvel-chocolate', (SELECT id FROM brands WHERE slug='carvel'), 'chocolate', '{"classic","soft-serve"}'),
  ('Vanilla & Chocolate Twist', 'carvel-twist', (SELECT id FROM brands WHERE slug='carvel'), 'classic', '{"twist","soft-serve"}'),
  ('Cookie Butter', 'carvel-cookie-butter', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"cookie butter","biscoff"}'),
  ('Cookies & Cream', 'carvel-cookies-cream', (SELECT id FROM brands WHERE slug='carvel'), 'classic', '{"oreo","cookies"}'),
  ('Strawberry', 'carvel-strawberry', (SELECT id FROM brands WHERE slug='carvel'), 'fruit', '{"strawberry","fruit"}'),
  ('Pistachio', 'carvel-pistachio', (SELECT id FROM brands WHERE slug='carvel'), 'nut', '{"pistachio","nut"}'),
  ('Cookie Dough Dinker', 'carvel-cookie-dough-dinker', (SELECT id FROM brands WHERE slug='carvel'), 'classic', '{"cookie dough"}'),
  ('Nutella', 'carvel-nutella', (SELECT id FROM brands WHERE slug='carvel'), 'chocolate', '{"nutella","hazelnut"}'),
  ('Flying Saucer', 'carvel-flying-saucer', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"sandwich","classic"}'),
  ('Fudgie the Whale', 'carvel-fudgie-the-whale', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"cake","fudge","crunch"}'),
  ('Cookie Puss', 'carvel-cookie-puss', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"cake","cookies","crunch"}'),
  ('Crunchie Munchie', 'carvel-crunchie-munchie', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"sprinkles","crunch"}'),
  ('Cotton Candy Crunch', 'carvel-cotton-candy-crunch', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"cotton candy","crunch","kids"}'),
  ('Lil'' Love', 'carvel-lil-love', (SELECT id FROM brands WHERE slug='carvel'), 'novelty', '{"cake","heart"}')
ON CONFLICT (slug) DO NOTHING;

-- DAIRY QUEEN
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Blizzard - Oreo', 'dq-blizzard-oreo', (SELECT id FROM brands WHERE slug='dairy-queen'), 'classic', '{"blizzard","oreo"}'),
  ('Blizzard - Reese''s Peanut Butter Cup', 'dq-blizzard-reeses', (SELECT id FROM brands WHERE slug='dairy-queen'), 'nut', '{"blizzard","reeses","peanut butter"}'),
  ('Blizzard - Cookie Dough', 'dq-blizzard-cookie-dough', (SELECT id FROM brands WHERE slug='dairy-queen'), 'classic', '{"blizzard","cookie dough"}'),
  ('Blizzard - M&M''s', 'dq-blizzard-mms', (SELECT id FROM brands WHERE slug='dairy-queen'), 'novelty', '{"blizzard","candy"}'),
  ('Blizzard - Heath', 'dq-blizzard-heath', (SELECT id FROM brands WHERE slug='dairy-queen'), 'classic', '{"blizzard","heath","toffee"}'),
  ('Blizzard - Butterfinger', 'dq-blizzard-butterfinger', (SELECT id FROM brands WHERE slug='dairy-queen'), 'novelty', '{"blizzard","butterfinger"}'),
  ('Blizzard - Brownie Batter', 'dq-blizzard-brownie-batter', (SELECT id FROM brands WHERE slug='dairy-queen'), 'chocolate', '{"blizzard","brownie"}'),
  ('Blizzard - Snickers', 'dq-blizzard-snickers', (SELECT id FROM brands WHERE slug='dairy-queen'), 'nut', '{"blizzard","snickers","caramel"}'),
  ('Dipped Cone - Chocolate', 'dq-dipped-cone-chocolate', (SELECT id FROM brands WHERE slug='dairy-queen'), 'classic', '{"dipped","cone","chocolate"}'),
  ('Vanilla Soft Serve', 'dq-vanilla-soft-serve', (SELECT id FROM brands WHERE slug='dairy-queen'), 'soft_serve', '{"soft-serve","classic"}'),
  ('Chocolate Soft Serve', 'dq-chocolate-soft-serve', (SELECT id FROM brands WHERE slug='dairy-queen'), 'soft_serve', '{"soft-serve","chocolate"}'),
  ('Dilly Bar', 'dq-dilly-bar', (SELECT id FROM brands WHERE slug='dairy-queen'), 'novelty', '{"bar","dipped","classic"}'),
  ('Buster Bar', 'dq-buster-bar', (SELECT id FROM brands WHERE slug='dairy-queen'), 'novelty', '{"bar","fudge","peanut"}'),
  ('Starkiss Bar', 'dq-starkiss-bar', (SELECT id FROM brands WHERE slug='dairy-queen'), 'novelty', '{"bar","fruit"}'),
  ('Royal New York Cheesecake Blizzard', 'dq-royal-ny-cheesecake', (SELECT id FROM brands WHERE slug='dairy-queen'), 'classic', '{"blizzard","cheesecake","graham"}')
ON CONFLICT (slug) DO NOTHING;

-- BEN & JERRY'S
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Half Baked', 'bj-half-baked', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'chocolate', '{"cookie dough","brownie","chocolate","vanilla"}'),
  ('Cherry Garcia', 'bj-cherry-garcia', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'fruit', '{"cherry","chocolate","fudge"}'),
  ('Phish Food', 'bj-phish-food', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'chocolate', '{"chocolate","caramel","marshmallow"}'),
  ('The Tonight Dough', 'bj-tonight-dough', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"caramel","chocolate","cookie dough"}'),
  ('Americone Dream', 'bj-americone-dream', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"vanilla","fudge","caramel","cone"}'),
  ('Chocolate Fudge Brownie', 'bj-chocolate-fudge-brownie', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'chocolate', '{"chocolate","fudge","brownie"}'),
  ('Strawberry Cheesecake', 'bj-strawberry-cheesecake', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'fruit', '{"strawberry","cheesecake","graham"}'),
  ('New York Super Fudge Chunk', 'bj-ny-super-fudge-chunk', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'chocolate', '{"chocolate","fudge","pecan","walnut"}'),
  ('Chocolate Chip Cookie Dough', 'bj-chocolate-chip-cookie-dough', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"cookie dough","vanilla","chocolate"}'),
  ('Chubby Hubby', 'bj-chubby-hubby', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'nut', '{"peanut butter","pretzel","fudge"}'),
  ('Netflix & Chilll''d', 'bj-netflix-and-chillld', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'novelty', '{"peanut butter","pretzel","brownie"}'),
  ('Salted Caramel Brownie', 'bj-salted-caramel-brownie', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"caramel","brownie","salty-sweet"}'),
  ('Milk & Cookies', 'bj-milk-and-cookies', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"vanilla","cookies","cookie dough"}'),
  ('Bourbon Brown Butter', 'bj-bourbon-brown-butter', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'classic', '{"bourbon","butter","blondie"}'),
  ('Bob Marley''s One Love', 'bj-bob-marleys-one-love', (SELECT id FROM brands WHERE slug='ben-and-jerrys'), 'fruit', '{"banana","caramel","cookie swirl"}')
ON CONFLICT (slug) DO NOTHING;

-- HÄAGEN-DAZS
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Vanilla Bean', 'hd-vanilla-bean', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"vanilla","bean","classic"}'),
  ('Belgian Chocolate', 'hd-belgian-chocolate', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'chocolate', '{"chocolate","belgian","rich"}'),
  ('Strawberry', 'hd-strawberry', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'fruit', '{"strawberry","fruit"}'),
  ('Dulce de Leche', 'hd-dulce-de-leche', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"caramel","dulce de leche"}'),
  ('Coffee', 'hd-coffee', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"coffee","classic"}'),
  ('Butter Pecan', 'hd-butter-pecan', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'nut', '{"butter pecan","classic"}'),
  ('Green Tea', 'hd-green-tea', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'novelty', '{"matcha","green tea","japanese"}'),
  ('Rum Raisin', 'hd-rum-raisin', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"rum","raisin","classic"}'),
  ('Cookies & Cream', 'hd-cookies-and-cream', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"oreo","cookies"}'),
  ('Salted Caramel', 'hd-salted-caramel', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'classic', '{"caramel","salty-sweet"}'),
  ('Chocolate Peanut Butter', 'hd-chocolate-peanut-butter', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'nut', '{"chocolate","peanut butter"}'),
  ('Pistachio', 'hd-pistachio', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'nut', '{"pistachio","classic"}'),
  ('Rocky Road', 'hd-rocky-road', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'chocolate', '{"chocolate","marshmallow","almond"}'),
  ('Banana Peanut Butter Chip', 'hd-banana-pb-chip', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'nut', '{"banana","peanut butter","chocolate"}'),
  ('White Chocolate Raspberry Truffle', 'hd-white-choc-raspberry', (SELECT id FROM brands WHERE slug='haagen-dazs'), 'fruit', '{"white chocolate","raspberry"}')
ON CONFLICT (slug) DO NOTHING;

-- JENI'S
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Salty Caramel', 'jenis-salty-caramel', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'classic', '{"caramel","salty-sweet","signature"}'),
  ('Brambleberry Crisp', 'jenis-brambleberry-crisp', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'fruit', '{"blackberry","crisp","oat"}'),
  ('Gooey Butter Cake', 'jenis-gooey-butter-cake', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'classic', '{"butter cake","st louis","cream cheese"}'),
  ('Brown Butter Almond Brittle', 'jenis-brown-butter-almond', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'nut', '{"brown butter","almond","brittle"}'),
  ('Darkest Chocolate in the World', 'jenis-darkest-chocolate', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'chocolate', '{"chocolate","dark","intense"}'),
  ('Wildberry Lavender', 'jenis-wildberry-lavender', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'fruit', '{"berry","lavender","floral"}'),
  ('Everything Bagel', 'jenis-everything-bagel', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'novelty', '{"everything bagel","cream cheese","savory"}'),
  ('Powdered Jelly Donut', 'jenis-powdered-jelly-donut', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'novelty', '{"jelly","donut","powdered sugar"}'),
  ('Milkiest Chocolate in the World', 'jenis-milkiest-chocolate', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'chocolate', '{"milk chocolate","creamy"}'),
  ('Boston Cream Pie', 'jenis-boston-cream-pie', (SELECT id FROM brands WHERE slug='jenis-splendid-ice-creams'), 'classic', '{"custard","chocolate","pie"}')
ON CONFLICT (slug) DO NOTHING;

-- SALT & STRAW
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Sea Salt with Caramel Ribbons', 'ss-sea-salt-caramel', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'classic', '{"sea salt","caramel","signature"}'),
  ('Double Fold Vanilla', 'ss-double-fold-vanilla', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'classic', '{"vanilla","premium"}'),
  ('Chocolate Gooey Brownie', 'ss-chocolate-gooey-brownie', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'chocolate', '{"brownie","chocolate","gooey"}'),
  ('Honey Lavender', 'ss-honey-lavender', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'novelty', '{"honey","lavender","floral"}'),
  ('Strawberry Honey Balsamic with Black Pepper', 'ss-strawberry-balsamic', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'fruit', '{"strawberry","balsamic","pepper"}'),
  ('Pear & Blue Cheese', 'ss-pear-blue-cheese', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'novelty', '{"pear","blue cheese","savory"}'),
  ('Freckled Woodblock Chocolate', 'ss-freckled-woodblock', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'chocolate', '{"chocolate","freckled"}'),
  ('Arbequina Olive Oil', 'ss-arbequina-olive-oil', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'novelty', '{"olive oil","savory","creamy"}'),
  ('Salted Malted Chocolate Chip Cookie Dough', 'ss-salted-malted-cookie-dough', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'classic', '{"malt","cookie dough","chocolate"}'),
  ('Coffee & Bourbon', 'ss-coffee-bourbon', (SELECT id FROM brands WHERE slug='salt-and-straw'), 'classic', '{"coffee","bourbon","boozy"}')
ON CONFLICT (slug) DO NOTHING;

-- MILK BAR
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Cereal Milk', 'mb-cereal-milk', (SELECT id FROM brands WHERE slug='milk-bar'), 'novelty', '{"cereal","milk","signature"}'),
  ('Birthday Cake', 'mb-birthday-cake', (SELECT id FROM brands WHERE slug='milk-bar'), 'novelty', '{"cake","sprinkles","funfetti"}'),
  ('Cornflake Chocolate Chip Marshmallow', 'mb-cornflake-choc-marsh', (SELECT id FROM brands WHERE slug='milk-bar'), 'novelty', '{"cornflake","chocolate","marshmallow"}'),
  ('Milk Bar Pie', 'mb-milk-bar-pie', (SELECT id FROM brands WHERE slug='milk-bar'), 'classic', '{"pie","butter","oat"}'),
  ('Chocolate Birthday Cake', 'mb-chocolate-birthday-cake', (SELECT id FROM brands WHERE slug='milk-bar'), 'chocolate', '{"chocolate","cake","sprinkles"}'),
  ('Strawberry Lemon', 'mb-strawberry-lemon', (SELECT id FROM brands WHERE slug='milk-bar'), 'fruit', '{"strawberry","lemon","citrus"}')
ON CONFLICT (slug) DO NOTHING;

-- INSOMNIA COOKIES
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Cookie Dough Ice Cream', 'ic-cookie-dough', (SELECT id FROM brands WHERE slug='insomnia-cookies'), 'classic', '{"cookie dough"}'),
  ('Chocolate Ice Cream', 'ic-chocolate', (SELECT id FROM brands WHERE slug='insomnia-cookies'), 'chocolate', '{"chocolate"}'),
  ('Vanilla Ice Cream', 'ic-vanilla', (SELECT id FROM brands WHERE slug='insomnia-cookies'), 'classic', '{"vanilla"}'),
  ('Cookiewich', 'ic-cookiewich', (SELECT id FROM brands WHERE slug='insomnia-cookies'), 'novelty', '{"cookie sandwich","ice cream sandwich"}')
ON CONFLICT (slug) DO NOTHING;

-- HOFFMAN'S
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Peanut Butter Pandemonium', 'hoff-pb-pandemonium', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'nut', '{"peanut butter","chocolate"}'),
  ('Captain Crunch', 'hoff-captain-crunch', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'novelty', '{"cereal","captain crunch"}'),
  ('Campfire', 'hoff-campfire', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'novelty', '{"smores","marshmallow","graham"}'),
  ('Bananas Foster', 'hoff-bananas-foster', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'fruit', '{"banana","caramel","rum"}'),
  ('Salted Pretzel Caramel', 'hoff-salted-pretzel-caramel', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'classic', '{"pretzel","caramel","salty-sweet"}'),
  ('Cannoli', 'hoff-cannoli', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'novelty', '{"cannoli","ricotta","italian"}'),
  ('Espresso Oreo', 'hoff-espresso-oreo', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'classic', '{"espresso","oreo","coffee"}'),
  ('Pumpkin Pie', 'hoff-pumpkin-pie', (SELECT id FROM brands WHERE slug='hoffmans-ice-cream'), 'novelty', '{"pumpkin","pie","seasonal"}')
ON CONFLICT (slug) DO NOTHING;

-- ARETHUSA FARM
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Salted Caramel', 'af-salted-caramel', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'classic', '{"caramel","salty-sweet","farm"}'),
  ('Dark Chocolate', 'af-dark-chocolate', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'chocolate', '{"dark chocolate","rich"}'),
  ('Vanilla', 'af-vanilla', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'classic', '{"vanilla","farm-fresh"}'),
  ('Strawberry', 'af-strawberry', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'fruit', '{"strawberry","farm"}'),
  ('Maple Walnut', 'af-maple-walnut', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'nut', '{"maple","walnut","new england"}'),
  ('Coffee', 'af-coffee', (SELECT id FROM brands WHERE slug='arethusa-farm-dairy'), 'classic', '{"coffee","farm"}')
ON CONFLICT (slug) DO NOTHING;

-- FRIENDLY'S
INSERT INTO flavors (name, slug, brand_id, category, tags) VALUES
  ('Forbidden Chocolate', 'fr-forbidden-chocolate', (SELECT id FROM brands WHERE slug='friendlys'), 'chocolate', '{"chocolate","rich"}'),
  ('Vanilla', 'fr-vanilla', (SELECT id FROM brands WHERE slug='friendlys'), 'classic', '{"vanilla","classic"}'),
  ('Black Raspberry', 'fr-black-raspberry', (SELECT id FROM brands WHERE slug='friendlys'), 'fruit', '{"black raspberry","fruit"}'),
  ('Hunka Chunka PB Fudge', 'fr-hunka-chunka-pb-fudge', (SELECT id FROM brands WHERE slug='friendlys'), 'nut', '{"peanut butter","fudge","chocolate"}'),
  ('Watermelon Sherbet', 'fr-watermelon-sherbet', (SELECT id FROM brands WHERE slug='friendlys'), 'sorbet', '{"watermelon","sherbet"}'),
  ('Rockin'' Poppin'' Cotton Candy', 'fr-rockin-poppin-cotton-candy', (SELECT id FROM brands WHERE slug='friendlys'), 'novelty', '{"cotton candy","pop rocks"}'),
  ('Vienna Mocha Chunk', 'fr-vienna-mocha-chunk', (SELECT id FROM brands WHERE slug='friendlys'), 'classic', '{"mocha","chocolate","coffee"}'),
  ('Butter Crunch', 'fr-butter-crunch', (SELECT id FROM brands WHERE slug='friendlys'), 'classic', '{"butter crunch","toffee"}')
ON CONFLICT (slug) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- STEP 5: Create availability records linking chain flavors to locations
-- ═══════════════════════════════════════════════════════════════

-- Baskin-Robbins locations get BR flavors
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Baskin-Robbins'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'baskin-robbins')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Cold Stone locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Cold Stone Creamery'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'cold-stone-creamery')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Carvel locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Carvel'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'carvel')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Dairy Queen locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Dairy Queen'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'dairy-queen')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Ben & Jerry's locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Ben & Jerry''s'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'ben-and-jerrys')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Häagen-Dazs locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Häagen-Dazs'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'haagen-dazs')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Jeni's locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Jeni''s Splendid'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'jenis-splendid-ice-creams')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Insomnia Cookies locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Insomnia Cookies'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'insomnia-cookies')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Hoffman's locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Hoffman''s Ice Cream'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'hoffmans-ice-cream')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Arethusa Farm locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Arethusa Farm Dairy'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'arethusa-farm-dairy')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Friendly's locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Friendly''s'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'friendlys')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- Milk Bar locations
INSERT INTO availability (location_id, flavor_id, brand_id, is_available, source, last_confirmed_at)
SELECT l.id, f.id, f.brand_id, TRUE, 'seed', NOW()
FROM locations l
CROSS JOIN flavors f
WHERE l.is_chain = TRUE AND l.chain_name = 'Milk Bar'
AND f.brand_id = (SELECT id FROM brands WHERE slug = 'milk-bar')
ON CONFLICT (location_id, flavor_id) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- STEP 6: Verify counts
-- ═══════════════════════════════════════════════════════════════
SELECT 'brands' as entity, COUNT(*) as total FROM brands
UNION ALL
SELECT 'flavors', COUNT(*) FROM flavors
UNION ALL
SELECT 'availability', COUNT(*) FROM availability;
