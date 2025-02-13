-- Refresh the schema cache for the media table
select
    *
from
    pg_catalog.pg_tables
where
    schemaname = 'public'
    and tablename = 'media';

-- Ensure media table has the correct structure
create table if not exists public.media (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    section_id uuid references public.sections(id) on delete cascade,
    storage_path text,
    file_path text,
    file_name text,
    mime_type text,
    media_type text check (media_type in ('image', 'video')),
    alt_text text,
    title text,
    description text
);

-- Grant necessary permissions
grant all privileges on table public.media to authenticated;
grant all privileges on table public.media to service_role;

-- Notify PostgREST to reload schema cache
notify pgrst, 'reload schema'; 