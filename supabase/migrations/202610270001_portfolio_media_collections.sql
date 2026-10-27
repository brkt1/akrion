-- Additive migration: legacy gallery/video fields and all existing records stay
-- intact. Media inherits the parent project's existing published/draft RLS.
BEGIN;

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS collection_type text NOT NULL DEFAULT 'project',
  ADD COLUMN IF NOT EXISTS media_items jsonb;

CREATE OR REPLACE FUNCTION public.valid_portfolio_media(items jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
DECLARE item jsonb; seen_ids text[] := '{}';
BEGIN
  IF items IS NULL THEN RETURN true; END IF;
  IF jsonb_typeof(items) <> 'array' THEN RETURN false; END IF;
  IF jsonb_array_length(items) > 100 THEN RETURN false; END IF;
  FOR item IN SELECT value FROM jsonb_array_elements(items) LOOP
    IF jsonb_typeof(item) <> 'object'
      OR jsonb_typeof(item->'id') IS DISTINCT FROM 'string'
      OR length(item->>'id') > 100
      OR jsonb_typeof(item->'title') IS DISTINCT FROM 'string'
      OR jsonb_typeof(item->'url') IS DISTINCT FROM 'string'
      OR COALESCE(item->>'id', '') = ''
      OR item->>'id' = ANY(seen_ids)
      OR COALESCE(item->>'type', '') NOT IN ('image', 'video')
      OR COALESCE(item->>'category', '') NOT IN ('tv-promo', 'interview', 'behind-the-scenes', 'reels', 'photos')
      OR ((item->>'type' = 'image') <> (item->>'category' = 'photos'))
      OR COALESCE(length(btrim(item->>'title')), 0) NOT BETWEEN 1 AND 200
      OR COALESCE(length(item->>'url'), 0) NOT BETWEEN 1 AND 2048
      OR COALESCE(item->>'url', '') !~ '^https://[^[:space:]]+$'
      OR position(chr(92) in item->>'url') > 0
      OR COALESCE(item->>'orientation', '') NOT IN ('landscape', 'portrait', 'square')
      OR length(COALESCE(item->>'alt', '')) > 500
      OR length(COALESCE(item->>'caption', '')) > 1000
      OR (COALESCE(item->>'thumbnail', '') <> '' AND (length(item->>'thumbnail') > 2048 OR item->>'thumbnail' !~ '^https://[^[:space:]]+$' OR position(chr(92) in item->>'thumbnail') > 0))
    THEN RETURN false; END IF;
    seen_ids := array_append(seen_ids, item->>'id');
  END LOOP;
  RETURN true;
END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_collection_type_check' AND conrelid = 'public.portfolio_projects'::regclass) THEN
    ALTER TABLE public.portfolio_projects ADD CONSTRAINT portfolio_collection_type_check CHECK (collection_type IN ('project', 'company'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_media_items_check' AND conrelid = 'public.portfolio_projects'::regclass) THEN
    ALTER TABLE public.portfolio_projects ADD CONSTRAINT portfolio_media_items_check CHECK (public.valid_portfolio_media(media_items));
  END IF;
END $$;

COMMENT ON COLUMN public.portfolio_projects.media_items IS 'Ordered media collection. NULL retains legacy gallery/video fallback; [] intentionally clears it. Each item has its own content type.';
NOTIFY pgrst, 'reload schema';
COMMIT;
