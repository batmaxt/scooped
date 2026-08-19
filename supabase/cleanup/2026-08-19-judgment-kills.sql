-- Judgment-call kills, approved by owner 2026-08-19:
-- Carvel Cookie Dough Dinker, Carvel Cotton Candy Crunch,
-- Milk Bar Toasted Marshmallow Sundae, Friendly's Royal Banana Split,
-- Haagen-Dazs Banana Split, Morgenstern's garbled "Salt & Pepper Pineapple"
CREATE TEMP TABLE jk (id uuid PRIMARY KEY);
INSERT INTO jk (id) VALUES
('ad7cc802-7829-413c-b36d-470808330e7d'),
('95f058e5-838b-4197-9891-21cfed9fb314'),
('15454b4c-36ce-49ea-b869-3fca897acb70'),
('13f929a8-cc63-4954-a714-cb01194ddb00'),
('eed0c809-fdda-49a8-8800-a5e3bf9ccde9'),
('279a5569-ccc9-4f9b-aa43-479311349a06');

DELETE FROM availability WHERE flavor_id IN (SELECT id FROM jk);
DELETE FROM checkins WHERE flavor_id IN (SELECT id FROM jk);
DELETE FROM alerts WHERE flavor_id IN (SELECT id FROM jk);
DELETE FROM list_items WHERE flavor_id IN (SELECT id FROM jk);
DELETE FROM flavors WHERE id IN (SELECT id FROM jk);
