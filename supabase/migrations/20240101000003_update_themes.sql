-- Update default values for themes table
BEGIN;

-- Add missing timestamp columns if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'themes' AND column_name = 'created_at') THEN
        ALTER TABLE themes ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'themes' AND column_name = 'updated_at') THEN
        ALTER TABLE themes ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL;
    END IF;
END $$;

-- Update color columns to be modifiable
ALTER TABLE themes 
ALTER COLUMN primary_color SET DEFAULT '#3b82f6',
ALTER COLUMN primary_color DROP NOT NULL;

ALTER TABLE themes 
ALTER COLUMN secondary_color SET DEFAULT '#1e40af',
ALTER COLUMN secondary_color DROP NOT NULL;

ALTER TABLE themes 
ALTER COLUMN background_color SET DEFAULT '#ffffff',
ALTER COLUMN background_color DROP NOT NULL;

ALTER TABLE themes 
ALTER COLUMN text_color SET DEFAULT '#000000',
ALTER COLUMN text_color DROP NOT NULL;

ALTER TABLE themes 
ALTER COLUMN accent_color SET DEFAULT '#f59e0b',
ALTER COLUMN accent_color DROP NOT NULL;

-- Update font family
ALTER TABLE themes 
ALTER COLUMN font_family SET DEFAULT 'Inter',
ALTER COLUMN font_family DROP NOT NULL;

-- Create or update the trigger for updating updated_at
CREATE OR REPLACE FUNCTION update_themes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_themes_updated_at ON themes;
CREATE TRIGGER update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE PROCEDURE update_themes_updated_at_column();

COMMIT; 