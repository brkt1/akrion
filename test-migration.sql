-- Read-only audit to run AFTER supabase-migrations.sql.
-- It raises an exception when a required security invariant is missing.

DO $$
DECLARE
  expected_tables text[] := ARRAY[
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'site_settings',
    'contact_messages'
  ];
  existing_count integer;
BEGIN
  SELECT count(*) INTO existing_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = ANY(expected_tables);

  IF existing_count <> cardinality(expected_tables) THEN
    RAISE EXCEPTION 'CMS schema incomplete: found % of % required tables',
      existing_count, cardinality(expected_tables);
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename = ANY(expected_tables)
      AND rowsecurity = false
  ) THEN
    RAISE EXCEPTION 'RLS is disabled on one or more CMS tables';
  END IF;

  IF to_regprocedure('public.cms_is_admin()') IS NULL THEN
    RAISE EXCEPTION 'Missing public.cms_is_admin()';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = ANY(expected_tables)
      AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
      AND COALESCE(qual, '') NOT LIKE '%cms_is_admin()%'
      AND COALESCE(with_check, '') NOT LIKE '%cms_is_admin()%'
  ) THEN
    RAISE EXCEPTION 'Found a CMS mutation policy that does not require cms_is_admin()';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd IN ('ALL', 'INSERT', 'UPDATE', 'DELETE')
      AND COALESCE(qual, '') NOT LIKE '%cms_is_admin()%'
      AND COALESCE(with_check, '') NOT LIKE '%cms_is_admin()%'
  ) THEN
    RAISE EXCEPTION 'Found a Storage mutation policy that does not require cms_is_admin()';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'contact_messages'
      AND ('public'::name = ANY(roles) OR 'anon'::name = ANY(roles))
  ) THEN
    RAISE EXCEPTION 'Contact inquiries are exposed to anonymous/public roles';
  END IF;

  IF to_regclass('public.published_page_sections') IS NULL
     OR to_regclass('public.published_site_settings') IS NULL THEN
    RAISE EXCEPTION 'Published projection views are missing';
  END IF;

  IF (SELECT count(*) FROM storage.buckets WHERE id IN ('images', 'media')) <> 2 THEN
    RAISE EXCEPTION 'Required Storage buckets are missing';
  END IF;
END
$$;

SELECT 'Migration security audit passed.' AS status;
