-- Menu photos table: stores photos of menu boards scanned at locations
CREATE TABLE menu_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  photo_url TEXT NOT NULL,
  extracted_flavors TEXT[] DEFAULT '{}',
  new_flavors_added INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_menu_photos_location ON menu_photos(location_id);
CREATE INDEX idx_menu_photos_created ON menu_photos(created_at DESC);

ALTER TABLE menu_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu photos are viewable by everyone" ON menu_photos FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upload menu photos" ON menu_photos FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can delete their own menu photos" ON menu_photos FOR DELETE USING (uploaded_by = auth.uid());

-- Storage bucket for menu photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-photos', 'menu-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload menu photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'menu-photos'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);

CREATE POLICY "Anyone can view menu photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'menu-photos');

CREATE POLICY "Users can delete their own menu photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'menu-photos'
  AND (storage.foldername(name))[1] = auth.uid()::TEXT
);
