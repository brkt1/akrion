-- =============================================================================
-- AKRION DIGITALS CMS + SECURITY MIGRATION (AUTHORITATIVE)
-- =============================================================================
-- Run this file from the Supabase SQL Editor with the project-owner role.
-- It is safe to run more than once and preserves existing content and Auth users.
--
-- This migration deliberately DOES NOT create an Auth user or set a password.
-- An administrator is authorized only when their server-controlled JWT
-- app_metadata contains: { "role": "admin" }
-- See ADMIN-SETUP.md for the required manual setup and rotation steps.
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Authorization and timestamp helpers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.cms_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

COMMENT ON FUNCTION public.cms_is_admin() IS
  'True only when the signed-in user JWT has server-controlled app_metadata.role=admin.';

REVOKE ALL ON FUNCTION public.cms_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cms_is_admin() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = timezone('utc', now());
  RETURN NEW;
END;
$$;

-- -----------------------------------------------------------------------------
-- 2. Existing content tables, extended for the CMS
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT 'Akrion Digitals',
  date date NOT NULL DEFAULT current_date,
  image text,
  category text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS excerpt text,
  ADD COLUMN IF NOT EXISTS image_alt text,
  ADD COLUMN IF NOT EXISTS publisher text NOT NULL DEFAULT 'Akrion Digitals',
  ADD COLUMN IF NOT EXISTS publication_date date,
  ADD COLUMN IF NOT EXISTS reading_time integer,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS related_article_ids bigint[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

ALTER TABLE public.blog_posts ALTER COLUMN content SET DEFAULT '';
ALTER TABLE public.blog_posts ALTER COLUMN author SET DEFAULT 'Akrion Digitals';
ALTER TABLE public.blog_posts ALTER COLUMN date SET DEFAULT current_date;

UPDATE public.blog_posts
SET publisher = COALESCE(NULLIF(publisher, ''), NULLIF(author, ''), 'Akrion Digitals'),
    publication_date = COALESCE(publication_date, date),
    published_at = CASE
      WHEN status = 'published' THEN COALESCE(published_at, date::timestamptz, created_at)
      ELSE published_at
    END
WHERE publisher IS NULL
   OR publisher = ''
   OR publication_date IS NULL
   OR (status = 'published' AND published_at IS NULL);

CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_unique
  ON public.blog_posts (lower(slug))
  WHERE slug IS NOT NULL AND btrim(slug) <> '';

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id BIGSERIAL PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  image text,
  category text,
  link text,
  tags text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.portfolio_projects
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS client_name text,
  ADD COLUMN IF NOT EXISTS industry text,
  ADD COLUMN IF NOT EXISTS project_year integer,
  ADD COLUMN IF NOT EXISTS services text,
  ADD COLUMN IF NOT EXISTS supporting_tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS card_description text,
  ADD COLUMN IF NOT EXISTS project_summary text,
  ADD COLUMN IF NOT EXISTS challenge text,
  ADD COLUMN IF NOT EXISTS approach jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS work_delivered text,
  ADD COLUMN IF NOT EXISTS result text,
  ADD COLUMN IF NOT EXISTS metrics jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verified_testimonial jsonb,
  ADD COLUMN IF NOT EXISTS testimonial_quote text,
  ADD COLUMN IF NOT EXISTS testimonial_name text,
  ADD COLUMN IF NOT EXISTS testimonial_role text,
  ADD COLUMN IF NOT EXISTS testimonial_organization text,
  ADD COLUMN IF NOT EXISTS featured_image text,
  ADD COLUMN IF NOT EXISTS alt_text text,
  ADD COLUMN IF NOT EXISTS image_caption text,
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS video_url text,
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS homepage_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

ALTER TABLE public.portfolio_projects ALTER COLUMN description SET DEFAULT '';

UPDATE public.portfolio_projects
SET card_description = COALESCE(card_description, description),
    featured_image = COALESCE(featured_image, image),
    published_at = CASE
      WHEN status = 'published' THEN COALESCE(published_at, created_at)
      ELSE published_at
    END
WHERE card_description IS NULL
   OR featured_image IS NULL
   OR (status = 'published' AND published_at IS NULL);

CREATE UNIQUE INDEX IF NOT EXISTS portfolio_projects_slug_unique
  ON public.portfolio_projects (lower(slug))
  WHERE slug IS NOT NULL AND btrim(slug) <> '';

CREATE TABLE IF NOT EXISTS public.services (
  id BIGSERIAL PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS slug text,
  ADD COLUMN IF NOT EXISTS number text,
  ADD COLUMN IF NOT EXISTS deliverables text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS main_image text,
  ADD COLUMN IF NOT EXISTS secondary_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz;

ALTER TABLE public.services ALTER COLUMN description SET DEFAULT '';

UPDATE public.services
SET published_at = COALESCE(published_at, created_at)
WHERE status = 'published' AND published_at IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS services_slug_unique
  ON public.services (lower(slug))
  WHERE slug IS NOT NULL AND btrim(slug) <> '';

-- -----------------------------------------------------------------------------
-- 3. Page content, testimonials, media, settings, and inquiries
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.page_sections (
  id BIGSERIAL PRIMARY KEY,
  page_key text NOT NULL,
  section_key text NOT NULL,
  draft_content jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_content jsonb,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (page_key, section_key)
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id BIGSERIAL PRIMARY KEY,
  client_name text NOT NULL,
  client_role text,
  client_company text,
  quotation text NOT NULL,
  project_image text,
  verified_result text,
  rating numeric(2,1),
  is_verified boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.media_assets (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  path text NOT NULL,
  folder text NOT NULL DEFAULT '',
  url text,
  size bigint,
  mime_type text NOT NULL,
  width integer,
  height integer,
  alt_text text,
  is_placeholder boolean NOT NULL DEFAULT false,
  bucket_id text NOT NULL DEFAULT 'images',
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid,
  archived_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (bucket_id, path)
);

CREATE TABLE IF NOT EXISTS public.media_usages (
  id BIGSERIAL PRIMARY KEY,
  media_id bigint NOT NULL REFERENCES public.media_assets(id) ON DELETE RESTRICT,
  entity_type text NOT NULL,
  entity_key text NOT NULL,
  field_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (media_id, entity_type, entity_key, field_name)
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  setting_key text PRIMARY KEY,
  draft_value jsonb NOT NULL DEFAULT '{}'::jsonb,
  published_value jsonb,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id BIGSERIAL PRIMARY KEY,
  name text NOT NULL,
  email text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.contact_messages
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS service text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT timezone('utc', now());

ALTER TABLE public.contact_messages ALTER COLUMN email DROP NOT NULL;

-- -----------------------------------------------------------------------------
-- 4. Defensive constraints (added only when not already present)
-- -----------------------------------------------------------------------------

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_status_check' AND conrelid = 'public.blog_posts'::regclass) THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_status_check
      CHECK (status IN ('draft', 'scheduled', 'published', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'blog_posts_reading_time_check' AND conrelid = 'public.blog_posts'::regclass) THEN
    ALTER TABLE public.blog_posts
      ADD CONSTRAINT blog_posts_reading_time_check
      CHECK (reading_time IS NULL OR reading_time > 0) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_projects_status_check' AND conrelid = 'public.portfolio_projects'::regclass) THEN
    ALTER TABLE public.portfolio_projects
      ADD CONSTRAINT portfolio_projects_status_check
      CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_projects_year_check' AND conrelid = 'public.portfolio_projects'::regclass) THEN
    ALTER TABLE public.portfolio_projects
      ADD CONSTRAINT portfolio_projects_year_check
      CHECK (project_year IS NULL OR project_year BETWEEN 1900 AND 2200) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'portfolio_projects_supporting_tags_check' AND conrelid = 'public.portfolio_projects'::regclass) THEN
    ALTER TABLE public.portfolio_projects
      ADD CONSTRAINT portfolio_projects_supporting_tags_check
      CHECK (cardinality(supporting_tags) <= 2) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'services_status_check' AND conrelid = 'public.services'::regclass) THEN
    ALTER TABLE public.services
      ADD CONSTRAINT services_status_check
      CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'page_sections_status_check' AND conrelid = 'public.page_sections'::regclass) THEN
    ALTER TABLE public.page_sections
      ADD CONSTRAINT page_sections_status_check
      CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_status_check' AND conrelid = 'public.testimonials'::regclass) THEN
    ALTER TABLE public.testimonials
      ADD CONSTRAINT testimonials_status_check
      CHECK (status IN ('draft', 'published', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'testimonials_rating_check' AND conrelid = 'public.testimonials'::regclass) THEN
    ALTER TABLE public.testimonials
      ADD CONSTRAINT testimonials_rating_check
      CHECK (rating IS NULL OR rating BETWEEN 1 AND 5) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_assets_status_check' AND conrelid = 'public.media_assets'::regclass) THEN
    ALTER TABLE public.media_assets
      ADD CONSTRAINT media_assets_status_check
      CHECK (status IN ('active', 'archived')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_assets_size_check' AND conrelid = 'public.media_assets'::regclass) THEN
    ALTER TABLE public.media_assets
      ADD CONSTRAINT media_assets_size_check
      CHECK (size IS NULL OR (size > 0 AND size <= 52428800)) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'media_assets_mime_check' AND conrelid = 'public.media_assets'::regclass) THEN
    ALTER TABLE public.media_assets
      ADD CONSTRAINT media_assets_mime_check
      CHECK (mime_type IN (
        'image/jpeg', 'image/png', 'image/webp', 'image/avif',
        'video/mp4', 'video/webm'
      )) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_settings_status_check' AND conrelid = 'public.site_settings'::regclass) THEN
    ALTER TABLE public.site_settings
      ADD CONSTRAINT site_settings_status_check
      CHECK (status IN ('draft', 'published')) NOT VALID;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'contact_messages_status_check' AND conrelid = 'public.contact_messages'::regclass) THEN
    ALTER TABLE public.contact_messages
      ADD CONSTRAINT contact_messages_status_check
      CHECK (status IN ('new', 'contacted', 'in_discussion', 'completed', 'archived')) NOT VALID;
  END IF;
END
$$;

-- -----------------------------------------------------------------------------
-- 5. Updated-at triggers
-- -----------------------------------------------------------------------------

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_portfolio_projects_updated_at ON public.portfolio_projects;
CREATE TRIGGER set_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_page_sections_updated_at ON public.page_sections;
CREATE TRIGGER set_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_testimonials_updated_at ON public.testimonials;
CREATE TRIGGER set_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_media_assets_updated_at ON public.media_assets;
CREATE TRIGGER set_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER set_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Remove the obsolete trigger name left by the legacy setup scripts.
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
DROP TRIGGER IF EXISTS update_portfolio_projects_updated_at ON public.portfolio_projects;
DROP TRIGGER IF EXISTS update_services_updated_at ON public.services;

-- -----------------------------------------------------------------------------
-- 6. Row-level security
-- -----------------------------------------------------------------------------

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- These tables are owned by this migration. Remove prior policies so a legacy
-- true/true policy cannot remain active alongside the secure policies below.
DO $$
DECLARE
  target_table text;
  existing_policy record;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'site_settings',
    'contact_messages'
  ]
  LOOP
    FOR existing_policy IN
      SELECT policyname
      FROM pg_policies
      WHERE schemaname = 'public' AND tablename = target_table
    LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', existing_policy.policyname, target_table);
    END LOOP;
  END LOOP;
END
$$;

CREATE POLICY "Published blog posts are public"
  ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' AND archived_at IS NULL);
CREATE POLICY "Admins manage blog posts"
  ON public.blog_posts FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Published portfolio projects are public"
  ON public.portfolio_projects FOR SELECT TO anon, authenticated
  USING (status = 'published' AND archived_at IS NULL);
CREATE POLICY "Admins manage portfolio projects"
  ON public.portfolio_projects FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Published services are public"
  ON public.services FOR SELECT TO anon, authenticated
  USING (status = 'published' AND archived_at IS NULL);
CREATE POLICY "Admins manage services"
  ON public.services FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Admins manage page sections"
  ON public.page_sections FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Published testimonials are public"
  ON public.testimonials FOR SELECT TO anon, authenticated
  USING (status = 'published' AND is_verified AND archived_at IS NULL);
CREATE POLICY "Admins manage testimonials"
  ON public.testimonials FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Active media metadata is public"
  ON public.media_assets FOR SELECT TO anon, authenticated
  USING (status = 'active' AND archived_at IS NULL);
CREATE POLICY "Admins manage media metadata"
  ON public.media_assets FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Admins manage media usage"
  ON public.media_usages FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

CREATE POLICY "Admins manage site settings"
  ON public.site_settings FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

-- There is intentionally no anonymous policy on contact_messages. A future
-- server-side form handler may insert with the service role after validation.
CREATE POLICY "Admins manage contact inquiries"
  ON public.contact_messages FOR ALL TO authenticated
  USING ((SELECT public.cms_is_admin())) WITH CHECK ((SELECT public.cms_is_admin()));

-- Explicit grants complement RLS. Anonymous users can read only rows admitted
-- by the public SELECT policies and cannot mutate any CMS table.
REVOKE ALL ON TABLE
  public.blog_posts,
  public.portfolio_projects,
  public.services,
  public.page_sections,
  public.testimonials,
  public.media_assets,
  public.media_usages,
  public.site_settings,
  public.contact_messages
FROM PUBLIC, anon;

GRANT SELECT ON TABLE
  public.blog_posts,
  public.portfolio_projects,
  public.services,
  public.testimonials,
  public.media_assets
TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE
  public.blog_posts,
  public.portfolio_projects,
  public.services,
  public.page_sections,
  public.testimonials,
  public.media_assets,
  public.media_usages,
  public.site_settings,
  public.contact_messages
TO authenticated;

GRANT ALL ON TABLE
  public.blog_posts,
  public.portfolio_projects,
  public.services,
  public.page_sections,
  public.testimonials,
  public.media_assets,
  public.media_usages,
  public.site_settings,
  public.contact_messages
TO service_role;

DO $$
DECLARE
  table_name text;
  sequence_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'contact_messages'
  ]
  LOOP
    sequence_name := pg_get_serial_sequence(format('public.%I', table_name), 'id');
    IF sequence_name IS NOT NULL THEN
      EXECUTE format('REVOKE ALL ON SEQUENCE %s FROM PUBLIC, anon', sequence_name);
      EXECUTE format('GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated, service_role', sequence_name);
    END IF;
  END LOOP;
END
$$;

-- These curated security-barrier views intentionally use PostgreSQL's default
-- view-owner permissions. That lets public roles read only the explicit
-- published projection while the base tables remain admin-only. Never add a
-- draft column to either view.
CREATE OR REPLACE VIEW public.published_page_sections
WITH (security_barrier = true)
AS
SELECT
  id,
  page_key,
  section_key,
  published_content AS content,
  published_at,
  updated_at
FROM public.page_sections
WHERE status = 'published' AND published_content IS NOT NULL;

CREATE OR REPLACE VIEW public.published_site_settings
WITH (security_barrier = true)
AS
SELECT
  setting_key,
  published_value AS value,
  published_at,
  updated_at
FROM public.site_settings
WHERE status = 'published' AND published_value IS NOT NULL;

REVOKE ALL ON TABLE public.published_page_sections, public.published_site_settings FROM PUBLIC;
GRANT SELECT ON TABLE public.published_page_sections, public.published_site_settings TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- 7. Storage buckets and secure policies
-- -----------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'images', 'images', true, 10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']::text[]
  ),
  (
    'media', 'media', true, 52428800,
    ARRAY[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif',
      'video/mp4', 'video/webm'
    ]::text[]
  )
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Replace every storage mutation policy. This project treats this migration as
-- authoritative for Storage; retaining an unknown true/true policy would leave
-- uploads or deletion open despite the restrictive policies below. Existing
-- SELECT-only policies for unrelated buckets are preserved.
DO $$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', existing_policy.policyname);
  END LOOP;
END
$$;

-- Remove legacy public read-policy names and this migration's read-policy name
-- so rerunning remains idempotent.
DROP POLICY IF EXISTS "Public read access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public update access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access on images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Akrion media is publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Akrion admins upload media" ON storage.objects;
DROP POLICY IF EXISTS "Akrion admins update media" ON storage.objects;
DROP POLICY IF EXISTS "Akrion admins delete media" ON storage.objects;

CREATE POLICY "Akrion media is publicly readable"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id IN ('images', 'media'));

CREATE POLICY "Akrion admins upload media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('images', 'media')
    AND (SELECT public.cms_is_admin())
  );

CREATE POLICY "Akrion admins update media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('images', 'media')
    AND (SELECT public.cms_is_admin())
  )
  WITH CHECK (
    bucket_id IN ('images', 'media')
    AND (SELECT public.cms_is_admin())
  );

CREATE POLICY "Akrion admins delete media"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('images', 'media')
    AND (SELECT public.cms_is_admin())
  );

COMMIT;

-- =============================================================================
-- MANUAL STEPS AFTER THIS MIGRATION
-- 1. Rotate any credential that was previously committed to Git.
-- 2. Create or retain the administrator through Supabase Auth (not SQL).
-- 3. Set that user's app_metadata.role to "admin" with the Dashboard or a
--    trusted service-role script, then sign out/in so the JWT refreshes.
-- 4. Keep Contact Inquiries marked unavailable until a server-side submission
--    endpoint writes validated submissions with the service role.
-- =============================================================================
