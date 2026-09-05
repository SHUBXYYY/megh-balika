DROP POLICY IF EXISTS "Anyone view published collections" ON public.collections;

CREATE POLICY "Anyone view published collections"
ON public.collections
FOR SELECT
TO anon, authenticated
USING (published = true);

CREATE POLICY "Admins view all collections"
ON public.collections
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));