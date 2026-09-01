# Secure Admin Setup

The repository does not contain an administrator email, password, or service-role key. Admin access is granted only through server-controlled Supabase `app_metadata`:

```json
{ "role": "admin" }
```

Do not use `user_metadata` for authorization. A signed-in user can edit their own user metadata.

## Required security action

An earlier repository revision contained an administrator email and password. Removing them from the current files does not invalidate the exposed password or erase Git history.

1. Reset that account's password immediately in **Supabase Dashboard → Authentication → Users**.
2. Revoke and replace any server secret or service-role key that may have been copied into an unsafe location.
3. Review recent Auth and database activity.
4. Apply `supabase-migrations.sql` before enabling the admin CMS in production.

## 1. Apply the migration

Open **Supabase Dashboard → SQL Editor**, paste the complete contents of `supabase-migrations.sql`, and run it with the project-owner role. The migration is idempotent, preserves existing Auth users and content, and does not create credentials.

## 2. Create or retain the Auth user

Under **Authentication → Users**, create the administrator if it does not already exist. Use an administrator-controlled address and a unique password of at least 16 characters. Do not place either value in source control.

## 3. Rotate the password and assign the admin claim

Copy `.env.example` to a local `.env` file and replace every placeholder. `.env` is ignored by Git. With Node 20.6 or newer, run:

```bash
node --env-file=.env create-admin.js
```

Or set the values only for the current shell session:

PowerShell:

```powershell
$env:SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co"
$env:SUPABASE_SECRET_KEY = "YOUR_SERVER_SECRET_KEY"
$env:ADMIN_EMAIL = "<ADMIN_EMAIL>"
$env:ADMIN_PASSWORD = "<STRONG_UNIQUE_PASSWORD>"
node create-admin.js
```

Bash:

```bash
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co" \
SUPABASE_SECRET_KEY="YOUR_SERVER_SECRET_KEY" \
ADMIN_EMAIL="<ADMIN_EMAIL>" \
ADMIN_PASSWORD="<STRONG_UNIQUE_PASSWORD>" \
node create-admin.js
```

The script uses a Supabase server secret (or a legacy service-role key) only in the local Node process. It creates the user when absent, or rotates the password when present, and writes `role: admin` to `app_metadata`. It never prints the password.

Alternatively, a project owner can replace `<ADMIN_EMAIL>` in `create-admin-user.sql` and run that one statement after resetting the password in the Dashboard.

## 4. Refresh and verify the session

Sign out and back in so Supabase issues a new JWT. Verify the signed-in user's token contains:

```json
{
  "app_metadata": {
    "role": "admin"
  }
}
```

Then verify:

- An anonymous visitor can read published content but cannot create, edit, publish, archive, or delete it.
- A normal authenticated user cannot open or mutate admin content.
- The designated admin can manage CMS content and uploads.
- Anonymous and non-admin users cannot read contact inquiries.
- Draft page sections and draft site settings are not returned by the public API.

## Contact inquiries

The current public contact form opens WhatsApp and does not submit to Supabase. Keep Contact Inquiries marked unavailable. A future trusted server endpoint may validate a submission and insert it with the service role; do not add an anonymous table-insert policy.

## Secret handling

- Never add a server secret or service-role key to a `VITE_*` variable; Vite exposes those values to browsers.
- Keep `.env` local and use the deployment provider's encrypted environment settings in production.
- The public anon key is not an admin secret. RLS still must remain enabled and restrictive.
- Prefer individual admin accounts, MFA, and regular access reviews.
