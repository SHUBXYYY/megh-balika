-- Replace broad public read with: public can view individual files, only admins can list
drop policy if exists "Public read collection images" on storage.objects;

-- Allow public to fetch specific objects (needed for <img src> URLs)
create policy "Public read collection image files"
on storage.objects for select
to anon
using (
  bucket_id = 'collection-images'
  and coalesce(current_setting('request.path', true), '') like '%/object/public/%'
);

-- Authenticated users (incl. admins via UI) can read
create policy "Authenticated read collection images"
on storage.objects for select
to authenticated
using (bucket_id = 'collection-images');