BEGIN;

-- Create sections table
CREATE TABLE sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID NOT NULL REFERENCES landing_pages(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('hero', 'features', 'testimonials', 'pricing', 'contact', 'custom', 'flex')),
    content JSONB NOT NULL DEFAULT '{}',
    styles JSONB NOT NULL DEFAULT '{}',
    position INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_sections_landing_page_id ON sections(landing_page_id);
CREATE INDEX idx_sections_position ON sections(position);
CREATE INDEX idx_sections_type ON sections(type);

-- Enable RLS
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public sections are viewable by everyone" ON sections
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert sections" ON sections
    FOR INSERT WITH CHECK (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = landing_page_id
            AND (user_id = auth.uid() OR user_id IS NULL)
        )
    );

CREATE POLICY "Only authenticated users can update sections" ON sections
    FOR UPDATE USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = landing_page_id
            AND (user_id = auth.uid() OR user_id IS NULL)
        )
    );

CREATE POLICY "Only authenticated users can delete sections" ON sections
    FOR DELETE USING (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = landing_page_id
            AND (user_id = auth.uid() OR user_id IS NULL)
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sections_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_sections_updated_at
    BEFORE UPDATE ON sections
    FOR EACH ROW
    EXECUTE PROCEDURE update_sections_updated_at_column();

-- Migrate existing sections from landing_pages table
INSERT INTO sections (landing_page_id, type, content, styles, position, is_visible)
SELECT 
    id as landing_page_id,
    s->>'type',
    (s->>'content')::jsonb,
    (s->>'styles')::jsonb,
    (s->>'order')::integer as position,
    (s->>'isVisible')::boolean
FROM landing_pages, jsonb_array_elements(sections) s;

-- Remove sections array from landing_pages table
ALTER TABLE landing_pages DROP COLUMN sections;

COMMIT; 