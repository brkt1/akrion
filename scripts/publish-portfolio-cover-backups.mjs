import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { portfolioCoverBackupFiles, getPortfolioCoverBackup } from '../src/data/portfolioCoverBackups.js'

// Owner-run, storage-only maintenance. Adds seven small copies; never rewrites
// project records, policies, original uploads or a different existing object.
const ref = 'gavhkkrnsuisqsjnnaow'
const response = spawnSync(process.env.SUPABASE_CLI_PATH || 'supabase', ['projects', 'api-keys', '--project-ref', ref, '--reveal', '--output', 'json'], { encoding: 'utf8', windowsHide: true, timeout: 120000 })
if (response.error || response.status !== 0) throw new Error('Sign in to the official Supabase CLI before publishing cover backups.')
const keys = JSON.parse(response.stdout)
const key = (keys.rows || keys).find((entry) => entry.name === 'service_role')?.api_key
if (!key) throw new Error('Authorized backend access is required.')
const client = createClient(`https://${ref}.supabase.co`, key, { auth: { persistSession: false, autoRefreshToken: false } })
const hash = (buffer) => createHash('sha256').update(buffer).digest('hex')
for (const [slug, filename] of Object.entries(portfolioCoverBackupFiles)) {
  const body = await readFile(new URL(`../src/assets/portfolio/${filename}`, import.meta.url))
  const name = `portfolio/${getPortfolioCoverBackup(slug).split('/').pop()}`
  const { error } = await client.storage.from('images').upload(name, body, { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
  if (error) {
    const existing = await client.storage.from('images').download(name)
    if (existing.error || hash(Buffer.from(await existing.data.arrayBuffer())) !== hash(body)) throw new Error(`Refusing to overwrite an existing cover: ${slug}`)
  }
  console.log(`Cover backup ready: ${slug} (${Math.round(body.length / 1024)} KB)`)
}
