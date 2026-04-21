-- Collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  fabric TEXT,
  origin TEXT,
  description TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view published collections"
ON public.collections FOR SELECT
TO anon, authenticated
USING (published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins insert collections"
ON public.collections FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update collections"
ON public.collections FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete collections"
ON public.collections FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Site content key-value store
CREATE TABLE public.site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view site content"
ON public.site_content FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins insert site content"
ON public.site_content FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins update site content"
ON public.site_content FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete site content"
ON public.site_content FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update/delete leads, appointments, chat data for management
CREATE POLICY "Admins update leads"
ON public.leads FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete leads"
ON public.leads FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete appointments"
ON public.appointments FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete sessions"
ON public.chat_sessions FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins delete messages"
ON public.chat_messages FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER collections_touch BEFORE UPDATE ON public.collections
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed collections
INSERT INTO public.collections (slug, name, fabric, origin, description, sort_order, published) VALUES
('banarasi', 'Banarasi Silk', 'Pure Mulberry Silk', 'Varanasi, UP', 'Woven on pit looms with real zari — the empress of Indian sarees.', 1, true),
('tussar', 'Tussar Wild Silk', 'Tussar Silk', 'Bhagalpur, Bihar', 'Wild-harvested cocoons, slubbed texture, natural gold lustre.', 2, true),
('kantha', 'Kantha Embroidery', 'Mulberry Silk / Cotton', 'Bengal', 'Generations of running-stitch storytelling on lustrous silk.', 3, true),
('batik', 'Batik Resist', 'Tussar / Mulberry', 'Santiniketan', 'Hand wax-resist dyeing — every saree is a one-off.', 4, true);

-- Seed site content
INSERT INTO public.site_content (key, value, description) VALUES
('contact_email', 'reshmip632@gmail.com', 'Primary contact email'),
('contact_phone', '+91 70013 78042', 'Display phone number'),
('whatsapp_number', '917001378042', 'WhatsApp number in international format, no + or spaces'),
('whatsapp_default_message', 'Namaste! I came across Megh Balika and would like to know more.', 'Default pre-filled WhatsApp message'),
('hero_eyebrow', 'Bengal • Banaras • The World', 'Small text above hero headline'),
('hero_headline', 'Megh Balika', 'Main hero headline'),
('hero_tagline', 'The Cloud Maiden — luxury sarees, woven for the world.', 'Hero subtitle'),
('about_intro', 'Megh Balika is a luxury B2B saree house bridging India''s artisan ateliers with the world''s most discerning boutiques.', 'About page intro paragraph');