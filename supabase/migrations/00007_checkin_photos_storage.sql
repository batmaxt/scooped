-- Create checkin-photos storage bucket (public so images can be displayed without auth)
INSERT INTO storage.buckets (id, name, public)
VALUES ('checkin-photos', 'checkin-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload their own checkin photos
CREATE POLICY "Users can upload their own checkin photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'checkin-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own checkin photos
CREATE POLICY "Users can update their own checkin photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'checkin-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own checkin photos
CREATE POLICY "Users can delete their own checkin photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'checkin-photos'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to view checkin photos (public bucket)
CREATE POLICY "Anyone can view checkin photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'checkin-photos');
