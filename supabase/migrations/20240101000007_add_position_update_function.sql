-- Create a function to update section positions in a single transaction
CREATE OR REPLACE FUNCTION update_section_positions(section_positions jsonb)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update each section's position in a single transaction
    WITH position_updates AS (
        SELECT 
            (jsonb_array_elements(section_positions)->>'id')::uuid as id,
            (jsonb_array_elements(section_positions)->>'position')::integer as position
    )
    UPDATE sections s
    SET position = pu.position
    FROM position_updates pu
    WHERE s.id = pu.id;
END;
$$; 