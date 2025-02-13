-- Clean up existing objects and bucket if they exist
delete from storage.objects where bucket_id = 'sections';
delete from storage.buckets where id = 'sections';

-- Create the sections bucket
insert into storage.buckets (id, name, public)
values ('sections', 'sections', true);

-- Set up RLS (Row Level Security) policies for the sections bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'sections' );

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'sections'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own media"
  on storage.objects for update
  using (
    bucket_id = 'sections'
    and auth.uid() = owner
  );

create policy "Users can delete their own media"
  on storage.objects for delete
  using (
    bucket_id = 'sections'
    and auth.uid() = owner
  );

-- Create a function to ensure section folders exist
create or replace function create_section_folders(section_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  empty_file bytea = '\x'::bytea;
begin
  -- Create the images folder
  insert into storage.objects (
    bucket_id,
    name,
    owner,
    size,
    metadata
  ) values (
    'sections',
    section_id || '/images/.keep',
    auth.uid(),
    0,
    jsonb_build_object('mimetype', 'text/plain')
  ) on conflict (bucket_id, name) do nothing;

  -- Create the videos folder
  insert into storage.objects (
    bucket_id,
    name,
    owner,
    size,
    metadata
  ) values (
    'sections',
    section_id || '/videos/.keep',
    auth.uid(),
    0,
    jsonb_build_object('mimetype', 'text/plain')
  ) on conflict (bucket_id, name) do nothing;
end;
$$;

-- Create a trigger to automatically create folders when a section is created
create or replace function handle_section_creation()
returns trigger
language plpgsql
security definer
as $$
begin
  perform create_section_folders(new.id);
  return new;
end;
$$;

-- Create a trigger for section creation
drop trigger if exists on_section_create on public.sections;
create trigger on_section_create
  after insert on public.sections
  for each row
  execute function handle_section_creation();

-- Create a function to clean up section folders when a section is deleted
create or replace function handle_section_deletion()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Delete all files in the section's folders
  delete from storage.objects
  where bucket_id = 'sections'
    and (
      name like old.id || '/images/%'
      or name like old.id || '/videos/%'
    );
  return old;
end;
$$;

-- Create a trigger for section deletion
drop trigger if exists on_section_delete on public.sections;
create trigger on_section_delete
  after delete on public.sections
  for each row
  execute function handle_section_deletion();

-- Update the media table to track section associations
alter table public.media add column if not exists section_id uuid references public.sections(id) on delete cascade;
alter table public.media add column if not exists media_type text check (media_type in ('image', 'video'));
alter table public.media add column if not exists storage_path text;

-- Create an index for faster media lookups by section
create index if not exists idx_media_section_id on public.media(section_id);

-- Create a function to validate media paths
create or replace function validate_media_path()
returns trigger
language plpgsql
as $$
begin
  -- Ensure the storage path matches the section and media type pattern
  if new.section_id is not null then
    if new.media_type = 'image' and new.storage_path not like new.section_id || '/images/%' then
      raise exception 'Invalid storage path for image in section %', new.section_id;
    end if;
    if new.media_type = 'video' and new.storage_path not like new.section_id || '/videos/%' then
      raise exception 'Invalid storage path for video in section %', new.section_id;
    end if;
  end if;
  return new;
end;
$$;

-- Create a trigger to validate media paths
drop trigger if exists validate_media_path on public.media;
create trigger validate_media_path
  before insert or update on public.media
  for each row
  execute function validate_media_path(); 