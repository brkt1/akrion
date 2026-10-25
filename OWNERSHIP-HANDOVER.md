# Akrion deployment handover

Updated 25 October 2026.

## Live deployment

- Website: https://akrion-digitals.vercel.app
- Content Studio: https://akrion-digitals.vercel.app/admin
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

`akriondigitals.com` and `www.akriondigitals.com` must be connected to this new
Vercel project through the domain owner's DNS account. Until that transfer is
verified, use the working `.vercel.app` address above. Do not delete the old
Vercel project or change email-related DNS records during the domain transfer.
Both domains have been added to the new project, pending the TXT ownership
challenges shown in Vercel. Existing A records already resolve to Vercel and
do not need to be replaced to complete those challenges.

Supabase Free projects can pause after inactivity. If that happens, the owner
can resume `Akrion` in the Supabase dashboard; creating a replacement database
is not necessary.

## Local maintenance and verification

The authenticated official Supabase CLI is linked to the existing project.
`supabase/config.toml` records the production authentication redirect settings.
The ignored `.backend-backups` folder contains a dated pre-change export of
public content, policies, a minimal user inventory, and storage object metadata.
It is not a download of the uploaded binary files or a full Auth backup.

`scripts/maintain-backend.mjs` supports `snapshot`, `verify`, `create-owner`, and
`owner-link`. It runs only on the owner's machine using the authenticated CLI;
it is not part of the deployed application. Set `SUPABASE_CLI_PATH` if the CLI
is not available on PATH, and `ADMIN_EMAIL` for owner-specific commands. Load
the ignored local environment with Node's `--env-file=.env.local` when needed.
An `owner-link` is a short-lived credential: never commit or share its output.

Verification completed: production build, owner Auth session and protected CMS
access, draft/public separation, anonymous write denial, and live homepage
publishing. The published hero was tested using the existing copy and CTA URL,
without adding test copy to the website.

Compatible React Router and WebSocket dependency patches removed the four
high-severity production audit findings. Two moderate React Router advisories
remain and require a separately tested major-version upgrade; development-tool
audit findings also remain. The build is static/client-rendered, not a React
Router SSR server. Do not run `npm audit fix --force` without migration testing.
