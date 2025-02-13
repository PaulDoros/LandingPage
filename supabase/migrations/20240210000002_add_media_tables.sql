-- Create media table to store metadata
create table media (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  bucket text not null,
  file_path text not null,
  file_name text not null,
  mime_type text not null,
  size integer not null,
  metadata jsonb default '{}'::jsonb,
  alt_text text,
  title text,
  description text
);

-- Create media_sections table for many-to-many relationship
create table media_sections (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  section_id uuid references sections(id) on delete cascade not null,
  media_id uuid references media(id) on delete cascade not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true
);

-- Create storage buckets
select storage.create_bucket('images', 'Public bucket for images');
select storage.create_bucket('videos', 'Public bucket for videos');

-- Create RLS policies for media table
alter table media enable row level security;

create policy "Media is viewable by everyone"
  on media for select
  using (true);

create policy "Media is insertable by authenticated users only"
  on media for insert
  with check (auth.role() = 'authenticated');

create policy "Media is updatable by authenticated users only"
  on media for update
  using (auth.role() = 'authenticated');

create policy "Media is deletable by authenticated users only"
  on media for delete
  using (auth.role() = 'authenticated');

-- Create RLS policies for media_sections table
alter table media_sections enable row level security;

create policy "Media sections are viewable by everyone"
  on media_sections for select
  using (true);

create policy "Media sections are insertable by authenticated users only"
  on media_sections for insert
  with check (auth.role() = 'authenticated');

create policy "Media sections are updatable by authenticated users only"
  on media_sections for update
  using (auth.role() = 'authenticated');

create policy "Media sections are deletable by authenticated users only"
  on media_sections for delete
  using (auth.role() = 'authenticated');

-- Create storage policies
create policy "Images are viewable by everyone"
  on storage.objects for select
  using (bucket_id = 'images');

create policy "Images are uploadable by authenticated users only"
  on storage.objects for insert
  with check (
    bucket_id = 'images' 
    and auth.role() = 'authenticated'
    and (storage.extension(name) = 'png' or 
         storage.extension(name) = 'jpg' or 
         storage.extension(name) = 'jpeg' or 
         storage.extension(name) = 'gif' or 
         storage.extension(name) = 'webp')
  );

create policy "Videos are viewable by everyone"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Videos are uploadable by authenticated users only"
  on storage.objects for insert
  with check (
    bucket_id = 'videos' 
    and auth.role() = 'authenticated'
    and (storage.extension(name) = 'mp4' or 
         storage.extension(name) = 'webm' or 
         storage.extension(name) = 'ogg')
  );

-- Add indexes
create index media_sections_section_id_idx on media_sections(section_id);
create index media_sections_media_id_idx on media_sections(media_id);
create index media_sections_sort_order_idx on media_sections(sort_order);

-- Add functions to help with media management
create or replace function get_section_media(p_section_id uuid)
returns table (
  id uuid,
  file_path text,
  file_name text,
  mime_type text,
  alt_text text,
  title text,
  description text,
  sort_order integer
)
language sql
as $$
  select 
    m.id,
    m.file_path,
    m.file_name,
    m.mime_type,
    m.alt_text,
    m.title,
    m.description,
    ms.sort_order
  from media m
  join media_sections ms on ms.media_id = m.id
  where ms.section_id = p_section_id
  and ms.is_visible = true
  order by ms.sort_order;
$$; 