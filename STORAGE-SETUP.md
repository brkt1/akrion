# Supabase Storage Setup

Storage buckets and policies are managed by `supabase-migrations.sql`. Do not create separate public upload, update, or delete policies in the Dashboard.

## Buckets

The idempotent migration creates or updates:

| Bucket | Public delivery | Maximum size | Allowed MIME types |
| --- | --- | ---: | --- |
| `images` | Yes | 10 MB | JPEG, PNG, WebP, AVIF |
| `media` | Yes | 50 MB | JPEG, PNG, WebP, AVIF, MP4, WebM |

Public delivery is required for current website assets. It does not permit uploads or destructive actions. Storage mutations require a signed-in user whose server-controlled `app_metadata.role` is `admin`.

SVG and GIF uploads are intentionally excluded. SVG can contain active content, and GIF is inefficient for the short loops used by this site; use optimized WebP/AVIF images and MP4/WebM video instead.

## Apply

1. Open **Supabase Dashboard → SQL Editor**.
2. Run the complete `supabase-migrations.sql` file.
3. Under **Storage**, confirm the `images` and `media` buckets exist.
4. Under **Storage → Policies**, confirm the only Akrion write policies are the three `Akrion admins … media` policies.
5. Configure the administrator as described in `ADMIN-SETUP.md`.

## Verification

Use separate sessions for each test:

- Anonymous: public media URLs load; upload, replace, and delete fail.
- Authenticated non-admin: public media loads; every mutation fails.
- Admin: allowed file types within the size limit upload; replace and delete succeed.
- Invalid file: SVG, GIF, executable content, an unsupported MIME type, or an oversized file is rejected.

The UI must still validate extensions, MIME type, and size before upload and show an understandable error. Bucket restrictions are the final server-side boundary, not a replacement for UI validation.

## Media metadata

After a successful upload, the CMS should store the file in `media_assets`, including alternative text and placeholder status. `media_usages` records where the asset is used. Deletion should be blocked while usage rows exist (`ON DELETE RESTRICT`) unless the administrator deliberately replaces every reference first.

## Troubleshooting

- **Bucket not found:** rerun the authoritative migration with the project-owner role.
- **Permission denied for an admin:** verify `app_metadata.role = "admin"`, then sign out and back in to refresh the JWT.
- **Anonymous upload succeeds:** remove the unexpected permissive policy immediately and rerun the migration. Check for manually created policies whose names are not managed by this repository.
- **Public image does not load:** confirm the object is in `images` or `media` and the bucket remains public.
