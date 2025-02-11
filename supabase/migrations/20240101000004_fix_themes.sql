-- Fix themes table structure
BEGIN;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_themes_updated_at ON themes;

-- Recreate the themes table with proper structure
CREATE TABLE IF NOT EXISTS themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    primary_color VARCHAR(255) DEFAULT '#3b82f6',
    secondary_color VARCHAR(255) DEFAULT '#1e40af',
    background_color VARCHAR(255) DEFAULT '#ffffff',
    text_color VARCHAR(255) DEFAULT '#000000',
    accent_color VARCHAR(255) DEFAULT '#f59e0b',
    font_family VARCHAR(255) DEFAULT 'Inter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Recreate the updated_at trigger
CREATE OR REPLACE FUNCTION update_themes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE PROCEDURE update_themes_updated_at_column();

-- Ensure RLS is enabled
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
DROP POLICY IF EXISTS "Public themes are viewable by everyone" ON themes;
DROP POLICY IF EXISTS "Only authenticated users can insert themes" ON themes;
DROP POLICY IF EXISTS "Only authenticated users can update themes" ON themes;

CREATE POLICY "Public themes are viewable by everyone" ON themes
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert themes" ON themes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update themes" ON themes
    FOR UPDATE USING (auth.role() = 'authenticated');

COMMIT; 