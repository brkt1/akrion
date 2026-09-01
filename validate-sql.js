#!/usr/bin/env node

/**
 * Lightweight structural/security checks for the authoritative migration.
 * This does not replace executing the migration twice in a Supabase project.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDirectory = path.dirname(fileURLToPath(import.meta.url))
const migrationPath = path.join(rootDirectory, 'supabase-migrations.sql')
const sql = fs.readFileSync(migrationPath, 'utf8')

const requiredTables = [
  'blog_posts',
  'portfolio_projects',
  'services',
  'page_sections',
  'testimonials',
  'media_assets',
  'media_usages',
  'site_settings',
  'contact_messages',
]

const checks = [
  ['migration is wrapped in a transaction', /^BEGIN;[\s\S]*COMMIT;/m.test(sql)],
  [
    'all CMS tables use idempotent creation',
    requiredTables.every((table) => sql.includes(`CREATE TABLE IF NOT EXISTS public.${table}`)),
  ],
  ['admin helper reads signed app_metadata', /auth\.jwt\(\)\s*->\s*'app_metadata'/.test(sql)],
  ['admin helper never trusts user_metadata', !/user_metadata/.test(sql)],
  ['RLS is enabled for every CMS table', requiredTables.every(
    (table) => sql.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
  )],
  ['content mutations require the admin helper', /FOR ALL TO authenticated[\s\S]{0,120}cms_is_admin\(\)/.test(sql)],
  ['storage mutations require the admin helper', /storage\.objects FOR INSERT TO authenticated[\s\S]{0,220}cms_is_admin\(\)/.test(sql)],
  ['legacy public storage-write policies are removed', [
    'Public upload access',
    'Public update access',
    'Public delete access',
  ].every((name) => sql.includes(`DROP POLICY IF EXISTS "${name}"`))],
  ['no true/true mutation policy remains', !/FOR\s+(INSERT|UPDATE|DELETE)[\s\S]{0,100}(USING|WITH CHECK)\s*\(true\)/i.test(sql)],
  ['migration never creates Auth credentials', !/INSERT\s+INTO\s+auth\.(users|identities)|encrypted_password|\bcrypt\s*\(/i.test(sql)],
  ['migration does not seed fabricated content', !/INSERT\s+INTO\s+(public\.)?(blog_posts|portfolio_projects|services|testimonials|page_sections)\b/i.test(sql)],
  ['storage bucket upsert is idempotent', /INSERT INTO storage\.buckets[\s\S]*ON CONFLICT \(id\) DO UPDATE/.test(sql)],
  ['updated-at helper and triggers exist', sql.includes('FUNCTION public.set_updated_at()') && sql.includes('EXECUTE FUNCTION public.set_updated_at()')],
  ['draft snapshots use public projection views', sql.includes('published_page_sections') && sql.includes('published_site_settings')],
]

console.log('Validating supabase-migrations.sql\n')

let failures = 0
for (const [name, passed] of checks) {
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}`)
  if (!passed) failures += 1
}

console.log(`\n${checks.length - failures} passed, ${failures} failed`)

if (failures > 0) process.exit(1)

console.log('\nNext: apply the migration twice in Supabase, then complete TESTING-GUIDE.md.')
