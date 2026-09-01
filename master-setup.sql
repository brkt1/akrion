-- =============================================================================
-- DEPRECATED LEGACY ENTRY POINT
-- =============================================================================
-- This file intentionally performs no setup. The old version created an Auth
-- user and installed anonymous write policies, so it is no longer safe to run.
--
-- Use the single authoritative, idempotent migration instead:
--   supabase-migrations.sql
--
-- That migration preserves existing users/content, removes legacy permissive
-- policies, creates the CMS schema, and authorizes mutations with the user's
-- server-controlled app_metadata.role value.
-- =============================================================================

DO $$
BEGIN
  RAISE NOTICE 'master-setup.sql is deprecated; run supabase-migrations.sql instead.';
END
$$;
