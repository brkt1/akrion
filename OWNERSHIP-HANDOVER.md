# Akrion deployment handover

Updated 27 October 2026.

## Live deployment

- Website: https://www.akriondigitals.com
- Content Studio: https://www.akriondigitals.com/admin
- Alternate deployment address: https://akrion-digitals.vercel.app
- Vercel team: `akrion-s-projects`
- Vercel project: `akrion-digitals`
- Supabase project: `Akrion` (`gavhkkrnsuisqsjnnaow`), in the owner's existing organization.
- Admin account: the owner-designated account (personal login details are not recorded in source).

The existing Supabase project was resumed with the owner's approval, rather
than replacing it. Existing projects, articles, services, testimonials, users,
and uploaded files were preserved. The owner's existing password was not
changed. A password-setup email was sent with a redirect to the live Content
Studio, not localhost. Passwords and service-role keys are never stored in Git
or in the browser application.

## Content editing

Homepage and About copy read the published CMS views. Homepage projects,
services, and testimonials use their shared content collections. Site Settings
connects contact details, footer social links, and the public header/footer logo.
Drafts are not exposed by the public page-content view, and unauthenticated
visitors cannot write content. Contact inquiries still use the existing
WhatsApp flow; the dashboard does not pretend to store those messages.

The content editor deliberately retains the public design and bundled defaults
when a section has not been published. Existing demo/test records are preserved
for the owner to review rather than silently removed.

### Portfolio collections

Portfolio now supports one card per project/campaign or company collection,
with multiple ordered videos and photos inside. In Content Studio, open
**Portfolio → Add Collection**, select the collection type, add the title,
slug, short description and cover, then use **Add video** / **Add photo**.
Choose a content type for each item: TV & Promo, Interviews, Behind the Scenes,
Reels, or Photos. Set the publication status and save the collection. Draft
collections and all their media remain unavailable to public visitors.

YouTube videos should be Unlisted or Public with embedding enabled. Private
videos are not suitable for normal website visitors. Paste a watch/share/Shorts
link; the editor converts it to a stable video URL. Existing HTTPS MP4/WebM
links also work, but this editor does not upload or transcode video files.
Photos and custom thumbnails use the existing image storage (JPEG/PNG/WebP,
up to 5 MB). A collection supports up to 100 media items, each with a title,
content type, optional caption/alternative text, and orientation. Up/down
controls set playback order; removing an item does not delete its storage file.

Public filters match collections containing that content type. **Watch videos**
opens playback on the Portfolio page; the full case-study page has its own
filterable media gallery. The player is mounted only after a visitor clicks,
uses YouTube's privacy-enhanced domain, and stops when closed. Keyboard focus,
Escape dismissal, portrait reels, mobile layout and reduced motion are supported.

`supabase/migrations/202610270001_portfolio_media_collections.sql` is additive
and has been applied to the owner's existing backend. It adds `collection_type`
and `media_items` without rewriting existing projects or changing their RLS.
NULL media retains the legacy gallery/video fallback; an explicitly saved empty
array clears the collection without resurrecting removed items. Original legacy
fields stay available as a compatibility source. Existing video links must be
given a content type when first edited; no categories or project facts are invented.

## Deployment and account access

The new deployment is linked locally in the ignored `.vercel` directory. After
installing the official Vercel CLI and signing in to the owner's team, deploy
from this repository with:

```powershell
vercel deploy --prod --yes --archive=tgz --scope akrion-s-projects
```

Required Vercel environment variables are `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, and `VITE_SITE_URL`. Only the publishable/anon Supabase
key belongs in a `VITE_` variable. The service-role key must never be used there.
The new Vercel project currently uses CLI deployment; Git integration must be
connected separately through an authorized GitHub account if automatic builds
are desired.

`akriondigitals.com` and `www.akriondigitals.com` are now verified and serving
this new Vercel project over HTTPS. Two `_vercel` TXT verification records were
added through the owner's IONOS account with explicit approval. Existing A,
MX, SPF, DKIM, DMARC, autodiscover, and nameserver records were left unchanged.
Both domains were checked against the current production JavaScript asset.
Keep the verification records in place; the registration remains with IONOS.
`VITE_SITE_URL` and the default Supabase Auth site URL use the `www` domain;
password-setup redirects remain allowed for both domain forms and the alternate
Vercel address.

Supabase Free projects can pause after inactivity. If that happens, the owner
can resume `Akrion` in the Supabase dashboard; creating a replacement database
is not necessary.

## Local maintenance and verification

The authenticated official Supabase CLI is linked to the existing project.
`supabase/config.toml` records the production authentication redirect settings.
The ignored `.backend-backups` folder contains a dated pre-change export of
public content, policies, a minimal user inventory, and storage object metadata.
It is not a download of the uploaded binary files or a full Auth backup.

`scripts/maintain-backend.mjs` supports `snapshot`, `verify`, `verify-media`,
`create-owner`, and `owner-link`. It runs only on the owner's machine using the authenticated CLI;
it is not part of the deployed application. Set `SUPABASE_CLI_PATH` if the CLI
is not available on PATH, and `ADMIN_EMAIL` for owner-specific commands. Load
the ignored local environment with Node's `--env-file=.env.local` when needed.
An `owner-link` is a short-lived credential: never commit or share its output.

`verify-media` checks collection persistence, ordering, empty media lists,
database validation, draft privacy, and anonymous write denial using one
temporary private draft, then deletes only that draft and confirms the existing
record count is unchanged. A pre-migration content snapshot is retained in the
ignored backups directory. `npm test` runs local model tests; `npm run test:browser`
runs isolated Playwright fixtures against localhost, never the live database.
Browser tests default to installed Microsoft Edge; set `PLAYWRIGHT_CHANNEL`
to another installed Playwright channel if needed.

Verification completed: production build, owner Auth session and protected CMS
access, draft/public separation, anonymous write denial, and live homepage
publishing. The published hero was tested using the existing copy and CTA URL,
without adding test copy to the website.

Compatible React Router and WebSocket dependency patches removed the four
high-severity production audit findings. Two moderate React Router advisories
remain and require a separately tested major-version upgrade; development-tool
audit findings also remain. The build is static/client-rendered, not a React
Router SSR server. Do not run `npm audit fix --force` without migration testing.
