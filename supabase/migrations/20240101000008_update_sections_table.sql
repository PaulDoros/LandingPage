-- Update sections table to support more customization
BEGIN;

-- Add new columns for section customization
ALTER TABLE sections
ADD COLUMN IF NOT EXISTS background_color VARCHAR(255),
ADD COLUMN IF NOT EXISTS text_color VARCHAR(255),
ADD COLUMN IF NOT EXISTS padding VARCHAR(255),
ADD COLUMN IF NOT EXISTS margin VARCHAR(255),
ADD COLUMN IF NOT EXISTS container_class VARCHAR(255),
ADD COLUMN IF NOT EXISTS custom_classes TEXT[];

-- Update the styles JSONB to include more default values
UPDATE sections
SET styles = jsonb_build_object(
    'padding', COALESCE(padding, 'py-12 md:py-16'),
    'margin', COALESCE(margin, 'my-0'),
    'backgroundColor', COALESCE(background_color, 'bg-background'),
    'textColor', COALESCE(text_color, 'text-foreground'),
    'containerClass', COALESCE(container_class, 'container mx-auto px-4'),
    'customClasses', COALESCE(custom_classes, ARRAY[]::TEXT[])
)
WHERE styles = '{}'::jsonb;

-- Create a function to update section visibility
CREATE OR REPLACE FUNCTION toggle_section_visibility(section_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_landing_page_id uuid;
    v_user_id uuid;
BEGIN
    -- Get the landing page ID for this section
    SELECT landing_page_id INTO v_landing_page_id
    FROM sections
    WHERE id = section_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Section not found';
    END IF;

    -- Get the user ID for this landing page
    SELECT user_id INTO v_user_id
    FROM landing_pages
    WHERE id = v_landing_page_id;

    -- Check if the current user owns the landing page
    IF v_user_id IS NOT NULL AND v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Not authorized to update this section';
    END IF;

    -- Update the section visibility
    UPDATE sections
    SET is_visible = NOT is_visible,
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = section_id;
END;
$$;

-- Create a function to update section content
CREATE OR REPLACE FUNCTION update_section_content(
    section_id uuid,
    new_content jsonb,
    new_styles jsonb DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_landing_page_id uuid;
    v_user_id uuid;
BEGIN
    -- Get the landing page ID for this section
    SELECT landing_page_id INTO v_landing_page_id
    FROM sections
    WHERE id = section_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Section not found';
    END IF;

    -- Get the user ID for this landing page
    SELECT user_id INTO v_user_id
    FROM landing_pages
    WHERE id = v_landing_page_id;

    -- Check if the current user owns the landing page
    IF v_user_id IS NOT NULL AND v_user_id != auth.uid() THEN
        RAISE EXCEPTION 'Not authorized to update this section';
    END IF;

    -- Update the section content
    UPDATE sections
    SET 
        content = new_content,
        styles = COALESCE(new_styles, styles),
        updated_at = TIMEZONE('utc'::text, NOW())
    WHERE id = section_id;
END;
$$;

COMMIT; 