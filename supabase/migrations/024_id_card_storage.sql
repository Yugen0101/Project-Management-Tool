-- Storage bucket for ID card photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('id-cards', 'id-cards', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage objects
-- Allow public access to view ID card photos
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'id-cards');

-- Allow admins to upload ID card photos
CREATE POLICY "Admins can upload ID card photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'id-cards' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- Allow admins to delete ID card photos
CREATE POLICY "Admins can delete ID card photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'id-cards' AND
    EXISTS (
        SELECT 1 FROM public.users
        WHERE id = auth.uid() AND role = 'admin'
    )
);
