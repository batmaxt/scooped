-- ============================================================
-- Scooped catalog audit cleanup — 2026-08-19
-- Run this WHOLE FILE at once in the Supabase SQL Editor.
-- Part 1: kill 106 non-flavor products (Blizzards, Creations,
--         Carvel/DQ/HD/VL novelty products, Cookiewich)
-- Part 2: merge 38 duplicate flavors into their keepers
-- Part 3: reattribute misfiled flavors to their real brands
-- Part 4: seed Morgenstern's Finest (31 flavors)
-- ============================================================

-- Part 1 — kill list
CREATE TEMP TABLE kill_ids (id uuid PRIMARY KEY);
INSERT INTO kill_ids (id) VALUES
('bf5af16b-cfde-4c57-a18e-bb17934e4970'),
('a778588b-5181-4367-ac9c-3dea45257775'),
('b24b2206-13dd-4b4a-ba9e-36b3824e2e64'),
('091ad397-5cc4-455a-80bf-681e0541ded0'),
('ba24504d-db7d-42a3-83ea-50706a5194f1'),
('0eea37cb-3727-4dcc-b994-09b3abfbcfc8'),
('1d475902-8336-4846-81e6-d01a38ca7b77'),
('ed263f3c-e4a5-4fdf-9a8c-7a1e19ac8256'),
('8108dcf0-52f0-4423-8080-b5f7a08d0af7'),
('2ab57e80-15d9-4230-a42d-825eab7ce81a'),
('ccc4fe15-a3a8-4478-b352-08fffdf5c2da'),
('b5ccbe76-7ce1-47c2-999f-8b0c7d80bba4'),
('f872ac06-ef4d-42b6-be6a-c14ec6390b66'),
('65d55ab7-b025-426c-9d59-5d8a0ceeab3f'),
('59b26b7d-91e8-45ec-9759-265255fb24df'),
('5a03143b-dcbf-4b84-93d5-5840990f7c74'),
('b9f93df0-e786-4f0b-a284-d5e3c171ca84'),
('9457ff47-8dd0-49c2-9de9-9bf3e4d38fa7'),
('7dd4de9a-2cc6-45cf-ba96-421faed6bfef'),
('cf02b5d6-117e-455f-9021-95bfa9234629'),
('f50ff3d1-c40d-464f-a19b-4f6f235b6ee2'),
('7eb99bb3-aab6-4c3b-97e2-8ed122b8b83e'),
('70f560f4-3cd4-41b6-b811-fa852b070401'),
('fcd21564-fb1b-4c88-99b7-f67bddcffb24'),
('259b7e59-906d-477b-be9f-a12bd38e7bd2'),
('33b1d6a1-b4d2-42e6-851e-50a616662c58'),
('74c68c98-4c9d-4721-b657-827f2cce4dc1'),
('20b995a7-9ea6-449e-b0ee-d2d1682365ef'),
('57639107-60e5-4a11-b7cb-bce20758afa6'),
('27d25906-c52c-40a2-8450-81394e06d2e5'),
('be44cc75-a0c7-4245-af80-7879acb43860'),
('334ab1c8-6316-44fb-9d00-38f5a72c0f78'),
('bea2baec-09e4-4966-9fe9-f434ab8c2136'),
('eeb52a2e-9478-408e-84a4-a6409a14b808'),
('107c88e0-5cee-44d1-8af9-6ba8c169e6bc'),
('a51ce411-e19f-499b-8dca-1a4552cb698d'),
('8def710f-df78-4351-9d75-5d60985a46a2'),
('f021abdd-7ed3-4171-be54-c252f67fa769'),
('b1c216e4-b50f-4fc6-8755-cd951411813c'),
('2a151b40-745e-4604-b3aa-2bb3d9c3513d'),
('b1da9a73-d08c-4d02-a4d0-0835fb1aedf7'),
('0d1bf04a-99af-4950-9767-d89550c02874'),
('6ce76163-ddbe-4704-a12b-3f1b59c1de3e'),
('cb3d4dd6-ceeb-4dc2-acf1-c7d22ecd563a'),
('ee19e981-8529-44f6-b4f7-4274bd0f6c56'),
('ab9ea363-cbbc-4e98-96a1-07dc579fd63e'),
('dd0f0fb6-c655-48e1-95cc-71470b150599'),
('97dad692-e0b8-4ac5-a421-e4ee02cc0582'),
('e72cedbc-6809-46e2-b402-ad183a07d14b'),
('3b3b8e4e-6fb2-4722-941c-b129d3f9a410'),
('73a47909-4670-400d-aed2-0b3e0e651bba'),
('6f90e2b2-56a9-4972-9959-eca65e2312ac'),
('08c4581e-bb0e-4d43-823a-d9f7f50861c0'),
('8d99ce95-6f72-4ef3-b1c2-c82f9440c5b1'),
('20cd2b5a-ec46-4a80-8977-fbfb5ff8a994'),
('c47475a0-0d8d-4d61-b289-694ab844164d'),
('867c155d-c9a8-4106-8c3a-c4d96b8bcf80'),
('6f33eb41-7624-4879-adee-483b4bd9ca07'),
('2b45460c-d6cb-4f0d-a85e-3c0b3a9c7149'),
('c85bb652-51be-441f-9590-f61f4795f264'),
('190ff34f-4754-4eae-81e7-f3d96c1b4b4c'),
('69f90d07-3f12-4db8-94c5-8969cc9d1a91'),
('f239ebfe-faeb-4e60-b892-23b71591b0e4'),
('def68d39-bbbd-431e-bf4c-f092ad6d31bc'),
('ca7a2aa7-a815-4017-9cf8-306faf11b091'),
('575607ec-1ab4-441b-ab52-25e8ca14681a'),
('fec2b704-1455-4279-9c63-0cc6d653eb49'),
('a7834a2c-6009-49ba-9e5e-ce21c72891fa'),
('89084cb9-d95b-4243-a1ee-cfc74cb389cd'),
('de86aa6e-6e08-445b-8ed9-3ccd6149dd5e'),
('b6158f90-a865-4208-85d8-cd3a2c78474b'),
('907b4a12-2ce3-44b9-afac-e09bb99cfcf5'),
('1c8b8358-0391-4be8-8877-48530660731a'),
('65d59aec-0050-4a05-afad-7aa657da3f51'),
('01ffc57a-551b-49e3-9a13-4f23cd8fca25'),
('64c403f3-4151-4a4b-bb09-08493a7293b3'),
('28a57b99-ec47-435c-8d5a-debadc3df00e'),
('1357ea36-a233-4925-a28c-89f47fb70c6b'),
('fcc9b490-71ce-4424-b576-08c3f800a08b'),
('29908dd0-cd20-4795-b524-4f2bf7a0ded4'),
('818e4828-7953-4268-8009-3352e24c9aa8'),
('e031ff46-02ab-490e-a5dc-9894187ec59b'),
('ead7bd07-da15-43d0-838c-3efc3d1cace9'),
('9b100e4e-a76b-4405-b50d-e0d8fba25230'),
('380f7dc4-6696-42be-adf7-144cc840d31b'),
('5ca0bd61-1d3e-4599-a83c-63de9b087906'),
('cb20616a-b493-42a4-8d53-1dd6cb4a898b'),
('3b791b83-1ee9-44fe-8d83-f4a1ff87d7d3'),
('d408010e-da5d-4793-a42a-af1c1cffa89a'),
('1e339bfd-8b78-4580-b658-036cba6ed34d'),
('29ffb945-5054-4e15-ac3a-d1d09a57f0ae'),
('44d190d2-b1f7-4afc-8c92-f6a44d3323ab'),
('2ab8a123-ad13-4225-a083-b8e68262871b'),
('6f4a7f16-8f35-4d18-a8ed-e6d32b6c8096'),
('23bfca60-f47a-4341-a5a8-50b2cb07d9bb'),
('27d3dd3b-de58-4a13-8a7c-c76f8756fffc'),
('a29047ce-c183-42d7-98c6-2d0dc14728e9'),
('8ca80d75-0014-4479-beb0-61f1231cf283'),
('011c04f1-7931-4c3b-8998-46fe6a3727d7'),
('73b707d6-a5e1-49fb-8e10-0a2d5193c5dc'),
('025f617c-2ad4-499d-9e37-31a1a3d3e32b'),
('b8b1725b-dd31-4fb8-9330-0d05378e9558'),
('f247d417-bf19-4b14-bbdf-809404e1cab4'),
('c1290121-a941-46c1-b07b-05812c6384be'),
('8041219d-d524-48d9-8202-bc9396cd7662'),
('c74f4b31-e45e-4c9e-9ee2-0c382ef3fa0d');

DELETE FROM availability WHERE flavor_id IN (SELECT id FROM kill_ids);
DELETE FROM checkins WHERE flavor_id IN (SELECT id FROM kill_ids);
DELETE FROM alerts WHERE flavor_id IN (SELECT id FROM kill_ids);
DELETE FROM list_items WHERE flavor_id IN (SELECT id FROM kill_ids);
DELETE FROM flavors WHERE id IN (SELECT id FROM kill_ids);

-- Part 2 — duplicate merges (dup -> keep)
CREATE TEMP TABLE dup_map (dup uuid PRIMARY KEY, keep uuid);
INSERT INTO dup_map (dup, keep) VALUES
('57989e6d-e102-4cdb-a929-bc550347859f','bccd88ae-a852-4db1-af1e-c063992cfa2d'),
('b0036d14-8a39-45b8-8761-eacf10a94816','6b7d0d05-28be-44e1-869f-d7598babb17d'),
('1ebfd4c4-94ac-4a59-b9fd-0500a361e9af','2c8dd4ac-e822-440f-a1c9-81e2ec0b8908'),
('e53205e7-1a2f-45cd-8ee5-1f88689de2e1','86b65343-14c7-40c4-882a-252924f95fa1'),
('d028d025-1406-469f-a5e9-185183cf30ca','c521c212-47cd-4e85-8418-991aa079519c'),
('8dbdd3e8-a8ba-4818-91fe-05ea9ce2bd49','4844a4a0-f86c-4913-a12c-27159d7967de'),
('83e0195b-056f-47ad-9156-a6f9c64dead2','6bc4ea8f-fb88-47fa-9dc8-792afd589312'),
('7bb79b99-275a-4b64-b53c-3a6a4a1f4c3e','f86644f3-752b-4ef8-af31-e0404be30012'),
('c4718914-df90-40c7-ac63-e265ef94b5b3','cd336ce8-d2b7-4800-a87c-9a1686ed2d6f'),
('ccccef9c-0e24-4f79-9295-ba90370766a4','5fec163f-081d-4719-bfda-9ad234ede1c2'),
('26eabab5-e2ce-449a-a070-a934d920acad','60873d44-ba40-43dd-b5f8-cc37b4f64fd7'),
('f05a09cb-6150-43ae-ad78-cd09d8cfae04','e0f7f81b-107f-4d21-8c78-a794e5ac17d2'),
('5e88cce6-e4fc-48bc-b484-0cf594a8b7e0','056e1798-6d6b-4ce4-be6c-35cf2d77c425'),
('51dbcaad-2120-4dd2-887b-51e7520ae148','99804102-5a34-4269-925d-3635db306a6d'),
('caaa8a90-7593-4e18-bedb-54edd371ca3a','3e0a1811-b820-433d-bad6-28aa01c3c99e'),
('c4b10436-e477-4259-99d0-5a668bef2953','3159e4e3-2780-41e0-8dcb-ad64c80fcb9e'),
('e36ae030-58f3-41ab-abc3-3f5df8ab51cf','86174a5e-4ab6-426a-8352-2cf59671f945'),
('9c6f73c1-f006-435f-bca5-fe84c60aef94','0f1acd8c-b64d-4e86-9ef3-931d50b2c21c'),
('e7856481-ef0a-4001-b4b5-2cf85b071894','08159df7-dbd3-49ed-8b99-d5536138f088'),
('8af9369c-3448-47f9-9833-e7f8948a3993','a9bf583a-0101-4a09-ac2a-3c5effc26fa0'),
('73e321c1-aaae-4851-bd42-d34432aca96f','02d46648-918b-4387-b4cd-acce1b97c703'),
('e2e7f943-ac37-401d-b16b-81ae8aca1cd0','9a26d7f5-66b7-4914-b55a-f98bda72a339'),
('63fa83c6-53b7-417b-a66b-b2a08ab33919','0c5d3cdf-6be5-4a76-bf7c-68392b3dc820'),
('dc97c252-d3fb-4b54-babd-e87a11f83cf5','71195178-d4a9-416e-ae50-6e86ce478006'),
('ef61ddc1-dd97-444d-8013-02f955d59e02','47f5118b-70c3-4b57-a155-b0e277aef073'),
('191acad7-9c5b-4810-af33-6fe4544d98db','47f5118b-70c3-4b57-a155-b0e277aef073'),
('4380a084-f179-47c1-9950-2e205dcd31d7','4d43f247-9a33-467f-a2bc-e1dcefd92f8f'),
('0aa6f085-e1c7-4dbb-b2e5-d7a1faf40d72','508f4ee0-2f94-45e2-940c-9f59860e7d28'),
('d2c81d34-fd19-4f47-869d-77534adac39a','0dab7f8c-eaef-4d6a-9e11-a14828de77fa'),
('5fd36629-eca0-41b3-9f46-840caab0352a','f605a065-9efd-4346-b780-fe51cd630a0a'),
('5b15d35c-7736-4848-b1d1-7951c77823fc','3ee91a7f-768b-4cf4-9940-d073668d859c'),
('7846e21a-141b-49f5-a2a5-9aaf4604aba9','6561274a-25b7-4b9b-8806-63cfbdea004d'),
('8a3880bf-f353-42df-9999-a92c9f0e7cf8','ce1f0986-591b-463f-a0db-88a3e717e2ca'),
('4f003ba2-f60e-45cd-ae6a-034fee732574','a95fa06b-a48a-4628-92fa-7fd6f74b262a'),
('6931c3f0-00d9-408a-a583-3eb182df1296','47c7401f-819f-4583-be21-0b713188ce8e'),
('a42da0fd-8489-42a9-953c-de4913ff4395','fc610cd3-e0d4-40ea-881e-d829c3904279'),
('e77606c2-d75b-4fa1-9adf-1049c0a0977e','34d621c2-438e-4d17-a53d-a3913a09eff9'),
('3c450820-9d0b-49b1-a276-66d15f454f2d','81fb4508-72eb-4fb7-a58f-d1cb4586d429');

DELETE FROM availability a USING dup_map d
WHERE a.flavor_id = d.dup
  AND EXISTS (SELECT 1 FROM availability x
              WHERE x.location_id = a.location_id AND x.flavor_id = d.keep);
UPDATE availability a SET flavor_id = d.keep FROM dup_map d WHERE a.flavor_id = d.dup;
UPDATE checkins c SET flavor_id = d.keep FROM dup_map d WHERE c.flavor_id = d.dup;
UPDATE alerts al SET flavor_id = d.keep FROM dup_map d WHERE al.flavor_id = d.dup;
UPDATE list_items li SET flavor_id = d.keep FROM dup_map d WHERE li.flavor_id = d.dup;
DELETE FROM flavors f USING dup_map d WHERE f.id = d.dup;

-- Part 3 — reattributions
-- Everything Bagel + Powdered Jelly Donut are real Jeni's flavors
UPDATE flavors SET brand_id = '0d1067c0-db96-4055-b9e9-f6cdc579189a'
WHERE id IN ('9b1397ef-1cd8-45df-806c-3218078d2398','64cd3df3-7bf8-4542-bf8e-32af32ff63cf');
-- Chunky Monkey + Heath Bar Crunch are Ben & Jerry's flavors
UPDATE flavors SET brand_id = '8a6be44d-0b7b-4cf5-aae7-50943a830528'
WHERE id IN ('f851c1cb-bf6f-47d1-a1eb-d087983948e9','f89ac2fe-a52f-4541-a5bf-d84b8646c063');

-- Part 4 — Morgenstern's Finest seed
INSERT INTO brands (name, slug, brand_type) VALUES ('Morgenstern''s Finest Ice Cream','morgensterns','artisan') ON CONFLICT (slug) DO NOTHING;
SELECT upsert_flavor('Raw Milk','raw-milk-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Salt and Pepper Pinenut','salt-and-pepper-pinenut-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Madagascar Vanilla','madagascar-vanilla-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Cherry Vanilla Chip','cherry-vanilla-chip-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Salted Chocolate','salted-chocolate-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Chocolate Chocolate Raspberry','chocolate-chocolate-raspberry-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Rockiest Road','rockiest-road-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Grove and Vine Olive Oil Brulee','grove-and-vine-olive-oil-brulee-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Cornflake Banana Caramel','cornflake-banana-caramel-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Hong Kong Milk Tea','hong-kong-milk-tea-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Salted Caramel Swirl','salted-caramel-swirl-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Hojicha Hazelnut Praline','hojicha-hazelnut-praline-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Peanut Butter Cup','peanut-butter-cup-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Pistachio Pistachio Ripple','pistachio-pistachio-ripple-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Lonely Driver Vietnamese Coffee','lonely-driver-vietnamese-coffee-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Malted Almond Mocha','malted-almond-mocha-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Cinnamon Coconut Latte','cinnamon-coconut-latte-morgensterns','morgensterns','non_dairy',NULL);
SELECT upsert_flavor('Chocolate Oat','chocolate-oat-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Cookies N'' Cream','cookies-n-cream-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Matcha Coconut Cookie Dough','matcha-coconut-cookie-dough-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Schoolyard Mint Chip','schoolyard-mint-chip-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Banana Black Sesame','banana-black-sesame-morgensterns','morgensterns','non_dairy',NULL);
SELECT upsert_flavor('Concord Grape Yuzu','concord-grape-yuzu-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Peaches N'' Sour Cream','peaches-n-sour-cream-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Pineapple Salted Egg Yolk','pineapple-salted-egg-yolk-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Smooth N'' Delicious Strawberry','smooth-n-delicious-strawberry-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Vogue A La Mode','vogue-a-la-mode-morgensterns','morgensterns','ice_cream',NULL);
SELECT upsert_flavor('Chocolate Sorbet','chocolate-sorbet-morgensterns','morgensterns','sorbet',NULL);
SELECT upsert_flavor('Mango Lychee Lemonade Sorbet','mango-lychee-lemonade-sorbet-morgensterns','morgensterns','sorbet',NULL);
SELECT upsert_flavor('Raspberry Papaya Sorbet','raspberry-papaya-sorbet-morgensterns','morgensterns','sorbet',NULL);
SELECT upsert_flavor('Strawberry Key Lime Sorbet','strawberry-key-lime-sorbet-morgensterns','morgensterns','sorbet',NULL);
SELECT upsert_flavor('Toasted Coconut Sorbet','toasted-coconut-sorbet-morgensterns','morgensterns','sorbet',NULL);
