-- Create the function for updating timestamps
CREATE OR REPLACE FUNCTION set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create media table
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  bucket_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  alt_text TEXT,
  title TEXT,
  description TEXT,
  position INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, bucket_path)
);

-- Add RLS policies
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Media items are viewable by everyone"
  ON media FOR SELECT
  USING (true);

CREATE POLICY "Media items can be inserted by authenticated users"
  ON media FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Media items can be updated by authenticated users"
  ON media FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Media items can be deleted by authenticated users"
  ON media FOR DELETE
  TO authenticated
  USING (true);

-- Add trigger for updated_at
CREATE TRIGGER set_media_updated_at
  BEFORE UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION set_current_timestamp_updated_at();

-- Create function to enforce single media for single-media sections
CREATE OR REPLACE FUNCTION enforce_single_media()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM sections s
    WHERE s.id = NEW.section_id
    AND s.type = 'single-media'
    AND EXISTS (
      SELECT 1 FROM media m
      WHERE m.section_id = s.id
      AND m.id != NEW.id
    )
  ) THEN
    RAISE EXCEPTION 'Single media sections can only have one media item';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_media_trigger
  BEFORE INSERT OR UPDATE ON media
  FOR EACH ROW
  EXECUTE FUNCTION enforce_single_media(); 