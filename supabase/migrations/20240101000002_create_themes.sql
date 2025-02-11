-- Create themes table
CREATE TABLE themes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    primary_color VARCHAR(255) NOT NULL DEFAULT '#3b82f6',
    secondary_color VARCHAR(255) NOT NULL DEFAULT '#1e40af',
    background_color VARCHAR(255) NOT NULL DEFAULT '#ffffff',
    text_color VARCHAR(255) NOT NULL DEFAULT '#000000',
    accent_color VARCHAR(255) NOT NULL DEFAULT '#f59e0b',
    font_family VARCHAR(255) NOT NULL DEFAULT 'Inter',
    font_size_base VARCHAR(255) NOT NULL DEFAULT '16px',
    font_size_h1 VARCHAR(255) NOT NULL DEFAULT '48px',
    font_size_h2 VARCHAR(255) NOT NULL DEFAULT '36px',
    font_size_h3 VARCHAR(255) NOT NULL DEFAULT '24px',
    font_size_paragraph VARCHAR(255) NOT NULL DEFAULT '16px',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE themes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public themes are viewable by everyone" ON themes
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert themes" ON themes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update themes" ON themes
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_themes_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_themes_updated_at
    BEFORE UPDATE ON themes
    FOR EACH ROW
    EXECUTE PROCEDURE update_themes_updated_at_column();

-- Insert default theme
INSERT INTO themes (
    primary_color,
    secondary_color,
    background_color,
    text_color,
    accent_color,
    font_family,
    font_size_base,
    font_size_h1,
    font_size_h2,
    font_size_h3,
    font_size_paragraph
) VALUES (
    '#3b82f6',
    '#1e40af',
    '#ffffff',
    '#000000',
    '#f59e0b',
    'Inter',
    '16px',
    '48px',
    '36px',
    '24px',
    '16px'
); 