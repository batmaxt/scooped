-- ============================================
-- FIX: Enable RLS on tables that were created
-- outside of migrations and are missing policies.
-- Supabase Security Advisor flagged these.
-- Uses DO blocks to skip gracefully if already applied.
-- ============================================

-- ============================================
-- NOTIFICATIONS
-- ============================================
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can create notifications"
    ON notifications FOR INSERT
    TO authenticated
    WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own notifications"
    ON notifications FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- CHECKIN_LIKES
-- ============================================
ALTER TABLE IF EXISTS checkin_likes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Likes are viewable by everyone"
    ON checkin_likes FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own likes"
    ON checkin_likes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own likes"
    ON checkin_likes FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- CHECKIN_COMMENTS
-- ============================================
ALTER TABLE IF EXISTS checkin_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Comments are viewable by everyone"
    ON checkin_comments FOR SELECT
    USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own comments"
    ON checkin_comments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own comments"
    ON checkin_comments FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- LISTS
-- ============================================
ALTER TABLE IF EXISTS lists ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view own lists and public lists"
    ON lists FOR SELECT
    USING (auth.uid() = user_id OR is_public = true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create own lists"
    ON lists FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own lists"
    ON lists FOR UPDATE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own lists"
    ON lists FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- LIST_ITEMS
-- ============================================
ALTER TABLE IF EXISTS list_items ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can view items in accessible lists"
    ON list_items FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM lists
        WHERE lists.id = list_items.list_id
        AND (lists.user_id = auth.uid() OR lists.is_public = true)
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can add items to own lists"
    ON list_items FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM lists
        WHERE lists.id = list_items.list_id
        AND lists.user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update items in own lists"
    ON list_items FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM lists
        WHERE lists.id = list_items.list_id
        AND lists.user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete items from own lists"
    ON list_items FOR DELETE
    USING (
      EXISTS (
        SELECT 1 FROM lists
        WHERE lists.id = list_items.list_id
        AND lists.user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
