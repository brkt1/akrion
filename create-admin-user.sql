-- =============================================================================
-- ADMIN AUTHORIZATION HELPER (NO CREDENTIAL CREATION)
-- =============================================================================
-- Supabase Auth users and passwords must be created or rotated through the
-- Dashboard or a trusted Admin API environment. This file never creates a user,
-- stores a password, or grants access through editable user_metadata.
--
-- Preferred workflow:
--   1. Run supabase-migrations.sql.
--   2. Create/reset the user under Authentication > Users.
--   3. Run create-admin.js from a trusted machine with environment variables;
--      it safely places { "role": "admin" } in server-controlled app_metadata.
--
-- If a project owner must assign the role in the SQL Editor, replace the
-- placeholder before running ONLY the statement below. It does not change the
-- user's password and does not create a user.
-- =============================================================================

UPDATE auth.users
SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
  || jsonb_build_object('role', 'admin'),
    updated_at = timezone('utc', now())
WHERE lower(email) = lower('<ADMIN_EMAIL>');

-- Expected result: UPDATE 1. If it reports UPDATE 0, stop and verify the user
-- in Authentication > Users. Sign out/in afterward to refresh the JWT claims.
