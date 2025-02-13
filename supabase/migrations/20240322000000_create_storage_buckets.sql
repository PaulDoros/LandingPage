-- Create storage buckets for different media types
insert into storage.buckets (id, name, public)
values 
  ('sections', 'sections', true),
  ('images', 'images', true),
  ('videos', 'videos', true);

-- Set up storage policies for the sections bucket
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'sections' );

create policy "Authenticated users can upload media"
  on storage.objects for insert
  with check (
    bucket_id in ('sections', 'images', 'videos')
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own media"
  on storage.objects for update
  using (
    bucket_id in ('sections', 'images', 'videos')
    and auth.uid() = owner
  );

create policy "Users can delete their own media"
  on storage.objects for delete
  using (
    bucket_id in ('sections', 'images', 'videos')
    and auth.uid() = owner
  );

-- Create a function to handle section deletion and cleanup storage
create or replace function public.handle_section_deletion()
returns trigger
language plpgsql
security definer
as $$
declare
  section_path text;
begin
  -- Construct the section path (you might want to adjust this based on your actual path structure)
  section_path := 'sections/' || old.id || '/%';
  
  -- Delete all storage objects associated with this section
  delete from storage.objects
  where bucket_id = 'sections'
  and name like section_path;
  
  return old;
end;
$$;

-- Create trigger for section deletion
drop trigger if exists on_section_delete on public.sections;
create trigger on_section_delete
  after delete on public.sections
  for each row
  execute function public.handle_section_deletion();

-- Update the media table to include section_id
alter table public.media
add column if not exists section_id uuid references public.sections(id) on delete cascade,
add column if not exists storage_path text; 