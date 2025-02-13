-- Update the section types constraint to include new media types
BEGIN;

-- Drop the existing constraint
ALTER TABLE sections DROP CONSTRAINT IF EXISTS sections_type_check;

-- Add the new constraint with updated types
ALTER TABLE sections ADD CONSTRAINT sections_type_check 
  CHECK (type IN (
    'hero', 
    'features', 
    'testimonials', 
    'pricing', 
    'contact', 
    'custom', 
    'flex',
    'single-media',
    'media-carousel'
  ));

COMMIT; 