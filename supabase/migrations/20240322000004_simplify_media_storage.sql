-- First, drop the media_sections join table and media table
drop table if exists public.media_sections cascade;
drop table if exists public.media cascade;

-- Update the section deletion trigger to handle storage cleanup
create or replace function handle_section_deletion()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Delete all storage objects in the section's folder and subfolders
    delete from storage.objects
    where bucket_id = 'sections'
        and name like old.id || '/%';
    
    return old;
end;
$$;

-- Add metadata columns to sections table if needed
alter table public.sections
add column if not exists media_metadata jsonb default '{}'::jsonb;

-- Create an index on the media_metadata column
create index if not exists idx_sections_media_metadata on public.sections using gin (media_metadata);

-- Update storage policies to reflect the simplified structure
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Authenticated users can upload media" on storage.objects;
drop policy if exists "Users can update their own media" on storage.objects;
drop policy if exists "Users can delete their own media" on storage.objects;

-- Create new simplified policies
create policy "Public Access"
    on storage.objects for select
    using ( bucket_id = 'sections' );

create policy "Authenticated users can manage media"
    on storage.objects for all
    using ( bucket_id = 'sections' and auth.role() = 'authenticated' )
    with check ( bucket_id = 'sections' and auth.role() = 'authenticated' ); 