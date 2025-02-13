-- Drop existing trigger and function
drop trigger if exists on_section_delete on public.sections;
drop function if exists handle_section_deletion();

-- Create an improved function to handle section deletion and storage cleanup
create or replace function handle_section_deletion()
returns trigger
language plpgsql
security definer
as $$
begin
    -- Delete all storage objects in the section's folder and subfolders
    delete from storage.objects
    where bucket_id = 'sections'
        and (
            -- Delete the main folder and all its contents
            name like old.id || '/%'
            -- Also delete any files directly in the section folder
            or name = old.id
        );

    -- The media records will be automatically deleted due to the ON DELETE CASCADE
    -- constraint on the section_id foreign key in the media table

    return old;
end;
$$;

-- Recreate the trigger
create trigger on_section_delete
    before delete on public.sections
    for each row
    execute function handle_section_deletion();

-- Ensure we have the cascade delete on media table
alter table public.media 
    drop constraint if exists media_section_id_fkey,
    add constraint media_section_id_fkey 
        foreign key (section_id) 
        references public.sections(id) 
        on delete cascade; 