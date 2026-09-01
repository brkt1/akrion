# Supabase Backend and CMS Setup

`supabase-migrations.sql` is the single authoritative database and storage migration. Run it from the Supabase SQL Editor with the project-owner role. It is idempotent and does not seed invented content, create an Auth user, or set a password.

Do not run `master-setup.sql`; it is retained only as a safe deprecated entry point.

## Schema

The migration preserves and extends the existing content tables:

- `blog_posts` — article content, slugs, publishing/scheduling state, SEO, reading time, and related articles
- `portfolio_projects` — case-study content, verified result/testimonial fields, media, SEO, status, and ordering
- `services` — the five service records, deliverables, media, status, and ordering
- `contact_messages` — optional backend inquiries, statuses, and internal notes

It also creates:

- `page_sections` — draft and published snapshots for Homepage and About content
- `testimonials` — verified testimonial records with an explicit verification gate and publishing state
- `media_assets` and `media_usages` — media metadata and where-used protection
- `site_settings` — draft and published contact, brand, footer, and SEO settings
- `published_page_sections` and `published_site_settings` — public views that never expose draft values

Existing records default to `published` so current public content remains readable. New page sections, settings, and testimonials default to `draft`. No demo projects, articles, testimonials, dates, or metrics are inserted.

## Authorization model

Row Level Security is enabled on every CMS table.

- Anonymous and ordinary authenticated visitors can read published content only.
- Only a signed-in user with server-controlled `app_metadata.role = "admin"` can create, update, publish, archive, or delete CMS content.
- Contact inquiries have no anonymous read or insert policy.
- Storage objects are publicly readable for website delivery, but only an authorized admin can upload, replace, or delete them.

See `ADMIN-SETUP.md` for credential rotation and admin-claim assignment.

## Storage

The migration creates or updates two buckets:

- `images`: JPEG, PNG, WebP, or AVIF; maximum 10 MB
- `media`: the same image types plus MP4 and WebM; maximum 50 MB

GIF and SVG uploads are intentionally excluded. File restrictions exist in the bucket and should also be validated in the admin UI before upload.

## Browser configuration

The current browser client contains the project URL and publishable/anon key in `src/lib/supabase.js`. Those values identify the public project and are not admin credentials; RLS is the security boundary. They may be moved to Vite environment variables as configuration hygiene:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

The client must be updated to read these variables before that optional move takes effect. The anon key is expected in a browser application; it is not permission to bypass RLS. Never expose a Supabase secret or service-role key through a `VITE_*` variable.

## Contact inquiries

The current Contact page continues to WhatsApp and does not save an inquiry. The admin must label inquiries unavailable until a real server endpoint validates and stores submissions. A trusted server handler may use the service role; the browser must not.

## Verification

After applying the migration, follow `TESTING-GUIDE.md`. At minimum, test an anonymous session, a normal authenticated session, and the designated admin separately.
