# Testing the Supabase CMS Migration

Run `supabase-migrations.sql` twice in the Supabase SQL Editor. Both runs must finish successfully; the second run verifies idempotency.

## 1. Verify the schema

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'site_settings',
    'contact_messages'
  )
ORDER BY table_name;
```

Expected: nine rows.

Verify the public snapshot views separately:

```sql
SELECT table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('published_page_sections', 'published_site_settings')
ORDER BY table_name;
```

Expected: two rows.

## 2. Verify RLS and policy intent

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'site_settings',
    'contact_messages'
  )
ORDER BY tablename;
```

Every row must show `rowsecurity = true`.

```sql
SELECT schemaname, tablename, policyname, roles, cmd, qual, with_check
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN (
    'blog_posts', 'portfolio_projects', 'services', 'page_sections',
    'testimonials', 'media_assets', 'media_usages', 'site_settings',
    'contact_messages'
  ))
  OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, policyname;
```

Confirm all mutation policies call `cms_is_admin()`. There must be no content or storage mutation policy whose condition is simply `true`. `contact_messages` must have no anonymous policy.

## 3. Verify permissions from real sessions

Use three separate browser sessions or test users; do not rely only on the SQL Editor's owner role, which can bypass RLS.

### Anonymous visitor

- Can read published blog posts, projects, services, verified published testimonials, and active public media metadata.
- Can read `published_page_sections` and `published_site_settings`.
- Cannot read base `page_sections`, base `site_settings`, drafts, archived items, media usages, or contact inquiries.
- Cannot insert, update, publish, archive, upload, replace, or delete anything.

### Authenticated non-admin

- Has the same published-content visibility as an anonymous visitor.
- Cannot open or mutate admin content.
- Cannot read inquiries.

### Authorized admin

- JWT contains `app_metadata.role = "admin"`.
- Can create a draft, preview it in the admin, publish it, unpublish it, and archive it.
- Can upload supported media and cannot upload an unsupported or oversized file.
- Can read and update inquiries only if a trusted backend has actually stored them.

Sign out and back in after changing `app_metadata`; an existing session retains its old JWT until refreshed.

## 4. Verify draft isolation

Create a `page_sections` record as the admin with different draft and published values, then query as an anonymous client:

```sql
-- Run as the admin through the API, not as an anonymous visitor.
INSERT INTO public.page_sections (
  page_key, section_key, draft_content, published_content, status, published_at
)
VALUES (
  'verification-only',
  'draft-isolation',
  '{"heading":"PRIVATE DRAFT"}',
  '{"heading":"PUBLIC COPY"}',
  'published',
  now()
)
ON CONFLICT (page_key, section_key) DO UPDATE
SET draft_content = EXCLUDED.draft_content,
    published_content = EXCLUDED.published_content,
    status = EXCLUDED.status,
    published_at = EXCLUDED.published_at;
```

Anonymous clients must see `PUBLIC COPY` through `published_page_sections` and must never receive `PRIVATE DRAFT`. Remove the verification record afterward as the admin.

## 5. Verify storage restrictions

Confirm both buckets and their limits:

```sql
SELECT id, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('images', 'media')
ORDER BY id;
```

Attempt one supported upload and one rejected upload from the admin UI. Then repeat the supported upload as anonymous and non-admin users; both must fail.

## 6. Verify public integration

- Existing published records still appear on the correct public pages.
- Drafts never appear on public routes.
- Published slug changes resolve after the site's prerender/deployment step.
- Removed public sections do not reappear.
- The current WhatsApp Contact form does not claim that an inquiry was stored.
- `npm run build` succeeds.

## Failure response

If an anonymous mutation or inquiry read succeeds, disable the admin rollout, inspect all policies in `pg_policies`, remove the unexpected permissive policy, and rerun the authoritative migration before retesting.
