-- Flavor duels: when a user has scooped the same flavor at two different
-- shops, they pick a winner. Aggregates later power "best Mint Chip in town"
-- rankings — head-to-head verdicts, immune to star inflation.
CREATE TABLE flavor_duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flavor_name TEXT NOT NULL,
  flavor_name_key TEXT NOT NULL,
  winner_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  loser_location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- One verdict per user per flavor per pairing (re-dueling updates it)
  UNIQUE(user_id, flavor_name_key, winner_location_id, loser_location_id)
);

CREATE INDEX idx_flavor_duels_flavor ON flavor_duels(flavor_name_key);
CREATE INDEX idx_flavor_duels_winner ON flavor_duels(winner_location_id);

ALTER TABLE flavor_duels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Duels are viewable by everyone" ON flavor_duels FOR SELECT USING (true);
CREATE POLICY "Users can record their own duels" ON flavor_duels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own duels" ON flavor_duels FOR UPDATE USING (auth.uid() = user_id);
