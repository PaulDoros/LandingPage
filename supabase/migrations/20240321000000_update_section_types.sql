-- Create a function to update the section types constraint
CREATE OR REPLACE FUNCTION update_section_types_constraint()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Drop the existing constraint if it exists
    ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;
    
    -- Add the new constraint with updated section types
    ALTER TABLE sections ADD CONSTRAINT sections_type_check 
        CHECK (type IN ('hero', 'features', 'pricing', 'contact', 'custom', 'flex', 'single-media', 'media-carousel'));
END;
$$; 