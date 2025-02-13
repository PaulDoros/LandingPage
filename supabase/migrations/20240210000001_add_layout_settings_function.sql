-- Create a function to update layout settings
create or replace function update_layout_settings(
  p_landing_page_id uuid,
  p_layout_settings jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  update landing_pages
  set 
    layout_settings = p_layout_settings,
    updated_at = now()
  where id = p_landing_page_id;
end;
$$; 