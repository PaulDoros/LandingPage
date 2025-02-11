BEGIN;

-- Drop existing table and related objects if they exist
DROP TRIGGER IF EXISTS update_content_blocks_updated_at ON content_blocks;
DROP FUNCTION IF EXISTS update_content_blocks_updated_at_column();
DROP TABLE IF EXISTS content_blocks;

-- Create content_blocks table
CREATE TABLE content_blocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID NOT NULL,
    block_type VARCHAR(50) NOT NULL, -- 'heading', 'text', 'button', 'image', 'video', 'html', 'card'
    content JSONB NOT NULL,
    styles JSONB NOT NULL DEFAULT '{
        "padding": "p-6",
        "margin": "my-4",
        "backgroundColor": "bg-white",
        "textColor": "text-gray-900",
        "borderRadius": "rounded-lg",
        "borderColor": "border-gray-200",
        "borderWidth": "border",
        "shadow": "shadow-sm",
        "width": "w-full",
        "hover": "hover:shadow-md",
        "transition": "transition-all"
    }',
    position INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT content_blocks_section_id_fkey FOREIGN KEY (section_id) REFERENCES landing_pages(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

-- Create indexes
DROP INDEX IF EXISTS idx_content_blocks_section_id;
DROP INDEX IF EXISTS idx_content_blocks_position;
DROP INDEX IF EXISTS idx_content_blocks_block_type;

CREATE INDEX idx_content_blocks_section_id ON content_blocks(section_id);
CREATE INDEX idx_content_blocks_position ON content_blocks(position);
CREATE INDEX idx_content_blocks_block_type ON content_blocks(block_type);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public content blocks are viewable by everyone" ON content_blocks;
DROP POLICY IF EXISTS "Only authenticated users can insert content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Only authenticated users can update content blocks" ON content_blocks;
DROP POLICY IF EXISTS "Only authenticated users can delete content blocks" ON content_blocks;

-- Create policies
CREATE POLICY "Public content blocks are viewable by everyone" ON content_blocks
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert content blocks" ON content_blocks
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update content blocks" ON content_blocks
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete content blocks" ON content_blocks
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_blocks_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON content_blocks
    FOR EACH ROW
    EXECUTE PROCEDURE update_content_blocks_updated_at_column();

-- Insert example content blocks
DO $$ 
BEGIN
    -- Only insert if no content blocks exist
    IF NOT EXISTS (SELECT 1 FROM content_blocks LIMIT 1) THEN
        INSERT INTO content_blocks (section_id, block_type, content, position) 
        SELECT 
            id as section_id,
            'card',
            jsonb_build_object(
                'title', 'Feature Card',
                'description', 'This is a customizable feature card that showcases your product or service.',
                'image', jsonb_build_object(
                    'src', 'https://via.placeholder.com/300',
                    'alt', 'Feature illustration',
                    'width', 300,
                    'height', 200
                ),
                'button', jsonb_build_object(
                    'text', 'Learn More',
                    'link', '#',
                    'variant', 'primary',
                    'isVisible', true
                ),
                'badge', jsonb_build_object(
                    'text', 'New',
                    'isVisible', true
                )
            ),
            0
        FROM landing_pages
        LIMIT 1;

        INSERT INTO content_blocks (section_id, block_type, content, position) 
        SELECT 
            id as section_id,
            'card',
            jsonb_build_object(
                'title', 'Pricing Card',
                'description', 'Our most popular plan for small businesses.',
                'price', jsonb_build_object(
                    'amount', '29',
                    'currency', '$',
                    'period', '/month'
                ),
                'features', jsonb_build_array(
                    'Feature 1',
                    'Feature 2',
                    'Feature 3'
                ),
                'button', jsonb_build_object(
                    'text', 'Get Started',
                    'link', '#',
                    'variant', 'primary',
                    'isVisible', true
                ),
                'badge', jsonb_build_object(
                    'text', 'Popular',
                    'isVisible', true
                )
            ),
            1
        FROM landing_pages
        LIMIT 1;
    END IF;
END $$;

COMMIT; 