CREATE OR REPLACE FUNCTION public.validate_blog_post()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF char_length(trim(NEW.title)) NOT BETWEEN 1 AND 180 THEN
    RAISE EXCEPTION 'Blog title must be between 1 and 180 characters';
  END IF;
  IF NEW.slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' OR char_length(NEW.slug) > 180 THEN
    RAISE EXCEPTION 'Blog slug must use lowercase letters, numbers, and single hyphens';
  END IF;
  IF char_length(NEW.excerpt) > 500 THEN
    RAISE EXCEPTION 'Blog excerpt must be 500 characters or fewer';
  END IF;
  IF char_length(NEW.content) > 100000 THEN
    RAISE EXCEPTION 'Blog content is too long';
  END IF;
  IF NEW.meta_title IS NOT NULL AND char_length(NEW.meta_title) > 60 THEN
    RAISE EXCEPTION 'Meta title must be 60 characters or fewer';
  END IF;
  IF NEW.meta_description IS NOT NULL AND char_length(NEW.meta_description) > 160 THEN
    RAISE EXCEPTION 'Meta description must be 160 characters or fewer';
  END IF;
  IF NEW.category IS NOT NULL AND char_length(NEW.category) > 80 THEN
    RAISE EXCEPTION 'Category must be 80 characters or fewer';
  END IF;
  IF NEW.image_alt IS NOT NULL AND char_length(NEW.image_alt) > 180 THEN
    RAISE EXCEPTION 'Image alt text must be 180 characters or fewer';
  END IF;
  IF NEW.image_title IS NOT NULL AND char_length(NEW.image_title) > 180 THEN
    RAISE EXCEPTION 'Image title must be 180 characters or fewer';
  END IF;
  IF NEW.image_url IS NOT NULL AND NEW.image_url !~* '^(https?://|/)[^\s]+$' THEN
    RAISE EXCEPTION 'Featured image must be a valid http(s) or site-relative URL';
  END IF;
  IF NEW.published AND NEW.published_at IS NULL THEN
    NEW.published_at = now();
  ELSIF NOT NEW.published THEN
    NEW.published_at = NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_validate
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.validate_blog_post();