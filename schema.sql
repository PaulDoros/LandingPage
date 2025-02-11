-- Drop existing tables if they exist
DROP TABLE IF EXISTS carousel_images;
DROP TABLE IF EXISTS landing_pages;

-- Create a table for landing pages
CREATE TABLE landing_pages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme JSONB NOT NULL DEFAULT '{
        "colors": {
            "primary": "#3b82f6",
            "secondary": "#1e40af",
            "background": "#ffffff",
            "text": "#000000",
            "accent": "#f59e0b"
        },
        "typography": {
            "fontFamily": "Inter",
            "fontSize": {
                "base": "16px",
                "heading1": "48px",
                "heading2": "36px",
                "heading3": "24px",
                "paragraph": "16px"
            }
        }
    }',
    sections JSONB NOT NULL DEFAULT '[]',
    meta JSONB NOT NULL DEFAULT '{
        "title": "My Landing Page",
        "description": "Welcome to my landing page",
        "keywords": []
    }',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create a table for carousel images
CREATE TABLE carousel_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landing_page_id UUID REFERENCES landing_pages(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    order_position INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX idx_landing_pages_user_id ON landing_pages(user_id);
CREATE INDEX idx_carousel_images_landing_page_id ON carousel_images(landing_page_id);

-- Enable Row Level Security (RLS)
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;

-- Create policies for landing_pages
CREATE POLICY "Public pages are viewable by everyone" ON landing_pages
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own pages" ON landing_pages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pages" ON landing_pages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pages" ON landing_pages
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for carousel_images
CREATE POLICY "Carousel images are viewable by everyone" ON carousel_images
    FOR SELECT USING (true);

CREATE POLICY "Users can insert images to their pages" ON carousel_images
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = carousel_images.landing_page_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update images on their pages" ON carousel_images
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = carousel_images.landing_page_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete images from their pages" ON carousel_images
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM landing_pages
            WHERE id = carousel_images.landing_page_id
            AND user_id = auth.uid()
        )
    );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_landing_pages_updated_at
    BEFORE UPDATE ON landing_pages
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column(); 