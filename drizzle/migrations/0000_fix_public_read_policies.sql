DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public view published blog posts" ON public.blog_posts FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed-in view published or admin blog posts" ON public.blog_posts FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Anyone view published products" ON public.products;
CREATE POLICY "Public view published products" ON public.products FOR SELECT TO anon USING (published = true);
CREATE POLICY "Signed-in view published or admin products" ON public.products FOR SELECT TO authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "View approved or admin" ON public.reviews;
CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT TO anon USING (approved = true);
CREATE POLICY "Signed-in view approved or admin reviews" ON public.reviews FOR SELECT TO authenticated USING (approved = true OR public.has_role(auth.uid(), 'admin'::app_role));

GRANT SELECT ON public.blog_posts, public.products, public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts, public.products, public.reviews TO authenticated;
GRANT ALL ON public.blog_posts, public.products, public.reviews TO service_role;