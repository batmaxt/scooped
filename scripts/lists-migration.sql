-- =============================================================================
-- Lists Feature Migration
-- Run via Supabase Management API in batches
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Batch 1: Create lists table + RLS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  description TEXT CHECK (char_length(description) <= 500),
  is_public BOOLEAN NOT NULL DEFAULT true,
  item_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id, created_at DESC);

ALTER TABLE lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own lists"
  ON lists FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public lists"
  ON lists FOR SELECT USING (is_public = true);

CREATE POLICY "Authenticated users can create lists"
  ON lists FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own lists"
  ON lists FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own lists"
  ON lists FOR DELETE USING (auth.uid() = user_id);

GRANT SELECT ON lists TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON lists TO authenticated;

-- ---------------------------------------------------------------------------
-- Batch 2: Create list_items table + RLS
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('location', 'flavor', 'brand')),
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  flavor_id UUID REFERENCES flavors(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  note TEXT CHECK (char_length(note) <= 280),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT check_item_reference CHECK (
    (item_type = 'location' AND location_id IS NOT NULL AND flavor_id IS NULL AND brand_id IS NULL) OR
    (item_type = 'flavor' AND flavor_id IS NOT NULL AND location_id IS NULL AND brand_id IS NULL) OR
    (item_type = 'brand' AND brand_id IS NOT NULL AND location_id IS NULL AND flavor_id IS NULL)
  ),

  CONSTRAINT unique_list_location UNIQUE (list_id, location_id),
  CONSTRAINT unique_list_flavor UNIQUE (list_id, flavor_id),
  CONSTRAINT unique_list_brand UNIQUE (list_id, brand_id)
);

CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id, position);

ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view items in their own lists"
  ON list_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()));

CREATE POLICY "Users can view items in public lists"
  ON list_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.is_public = true));

CREATE POLICY "Users can add items to their own lists"
  ON list_items FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()));

CREATE POLICY "Users can update items in their own lists"
  ON list_items FOR UPDATE
  USING (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()));

CREATE POLICY "Users can remove items from their own lists"
  ON list_items FOR DELETE
  USING (EXISTS (SELECT 1 FROM lists WHERE lists.id = list_items.list_id AND lists.user_id = auth.uid()));

GRANT SELECT ON list_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON list_items TO authenticated;

-- ---------------------------------------------------------------------------
-- Batch 3: Triggers for item_count + updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION increment_list_item_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lists SET item_count = item_count + 1, updated_at = now() WHERE id = NEW.list_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_increment_list_item_count
  AFTER INSERT ON list_items
  FOR EACH ROW EXECUTE FUNCTION increment_list_item_count();

CREATE OR REPLACE FUNCTION decrement_list_item_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE lists SET item_count = GREATEST(item_count - 1, 0), updated_at = now() WHERE id = OLD.list_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_decrement_list_item_count
  AFTER DELETE ON list_items
  FOR EACH ROW EXECUTE FUNCTION decrement_list_item_count();

CREATE OR REPLACE FUNCTION update_list_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_list_updated_at
  BEFORE UPDATE ON lists
  FOR EACH ROW EXECUTE FUNCTION update_list_updated_at();
