ALTER TABLE public.collections
  ADD COLUMN IF NOT EXISTS images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS primary_image_index integer NOT NULL DEFAULT 0;

-- Backfill: if a collection has a legacy image_url and no images yet, seed it.
UPDATE public.collections
SET images = jsonb_build_array(image_url)
WHERE image_url IS NOT NULL
  AND (images IS NULL OR jsonb_array_length(images) = 0);