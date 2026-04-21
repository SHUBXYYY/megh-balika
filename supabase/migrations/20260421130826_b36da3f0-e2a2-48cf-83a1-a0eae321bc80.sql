-- Create public storage bucket for collection images
insert into storage.buckets (id, name, public)
values ('collection-images', 'collection-images', true)
on conflict (id) do nothing;

-- RLS policies on storage.objects for this bucket
create policy "Public read collection images"
on storage.objects for select
using (bucket_id = 'collection-images');

create policy "Admins upload collection images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'collection-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update collection images"
on storage.objects for update
to authenticated
using (bucket_id = 'collection-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete collection images"
on storage.objects for delete
to authenticated
using (bucket_id = 'collection-images' and public.has_role(auth.uid(), 'admin'));