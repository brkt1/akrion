import { spawnSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomBytes, randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

// Run only on the owner's machine. The CLI authenticates through the owner's
// account; service keys, backups, and generated passwords never enter Git.
const ref = process.env.SUPABASE_PROJECT_REF || 'gavhkkrnsuisqsjnnaow'
if (!/^[a-z]{20}$/.test(ref)) throw new Error('Invalid Supabase project reference.')
const cli = process.env.SUPABASE_CLI_PATH || 'supabase'
const runCli = (args) => {
  const result = spawnSync(cli, args, { encoding: 'utf8', windowsHide: true, maxBuffer: 32 * 1024 * 1024, timeout: 180000 })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(result.stderr || 'Supabase CLI command failed.')
  return JSON.parse(result.stdout)
}
const query = (sql) => {
  const result = runCli(['db', 'query', '--linked', sql, '--output', 'json'])
  return result.rows || result
}

const snapshot = async () => {
  const tables = query("select table_name from information_schema.tables where table_schema='public' and table_type='BASE TABLE';")
  const data = {}
  for (const { table_name: table } of tables) {
    if (!/^[a-z_]+$/.test(table)) continue
    data[table] = query(`select * from public."${table}";`)
  }
  const policies = query("select schemaname,tablename,policyname,roles,cmd,qual,with_check from pg_policies where schemaname in ('public','storage');")
  const users = query('select id,email,raw_app_meta_data from auth.users;')
  const storage = query('select bucket_id,name,metadata from storage.objects;')
  const directory = resolve('.backend-backups')
  await mkdir(directory, { recursive: true })
  const filename = resolve(directory, `${new Date().toISOString().replace(/[:.]/g, '-')}.json`)
  await writeFile(filename, JSON.stringify({ ref, exportedAt: new Date().toISOString(), data, policies, users, storage }, null, 2), { mode: 0o600 })
  console.log(`Saved local backup: ${filename}`)
  console.log(JSON.stringify({ counts: Object.fromEntries(Object.entries(data).map(([name, rows]) => [name, rows.length])), users: users.length, storageObjects: storage.length }))
}

const getAdminClient = () => {
  const response = runCli(['projects', 'api-keys', '--project-ref', ref, '--reveal', '--output', 'json'])
  const keys = response.rows || response
  const key = keys.find((item) => item.name === 'service_role')?.api_key
  if (!key) throw new Error('A service-role key is required for this local administration task.')
  return createClient(`https://${ref}.supabase.co`, key, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } })
}

const createOwner = async () => {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Set ADMIN_EMAIL to the verified owner email.')
  const client = getAdminClient()
  const { data, error } = await client.auth.admin.listUsers({ perPage: 1000 })
  if (error) throw error
  const existing = data.users.find((user) => user.email?.toLowerCase() === email)
  const credentialsPath = resolve('.env.owner.local')
  let password
  try {
    const stored = await readFile(credentialsPath, 'utf8')
    if (stored.includes(`ADMIN_EMAIL=${email}\n`)) password = stored.match(/^ADMIN_PASSWORD=(.+)$/m)?.[1]
  } catch {}
  if (!existing) {
    password ||= `${randomBytes(18).toString('base64url')}aA9!`
    const { error: createError } = await client.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role: 'admin' } })
    if (createError) throw createError
    await writeFile(credentialsPath, `ADMIN_EMAIL=${email}\nADMIN_PASSWORD=${password}\nADMIN_URL=https://akrion-digitals.vercel.app/admin\n`, { mode: 0o600 })
    console.log(`Created owner account. Private credentials saved to ${credentialsPath}`)
  } else {
    const { error: updateError } = await client.auth.admin.updateUserById(existing.id, { app_metadata: { ...existing.app_metadata, role: 'admin' } })
    if (updateError) throw updateError
    console.log('Existing owner account authorized; its password was preserved.')
  }
  if (password) {
    const browserKey = process.env.VITE_SUPABASE_ANON_KEY
    if (!browserKey) throw new Error('Set the existing browser key to verify the new login.')
    const browser = createClient(`https://${ref}.supabase.co`, browserKey, { auth: { persistSession: false, autoRefreshToken: false } })
    const { data: signedIn, error: loginError } = await browser.auth.signInWithPassword({ email, password })
    if (loginError) throw loginError
    if (signedIn.user.app_metadata?.role !== 'admin') throw new Error('Admin role was not present in the issued session.')
    const result = await browser.from('page_sections').select('id').limit(1)
    if (result.error) throw result.error
    await browser.auth.signOut()
    console.log('Verified password login, server-controlled admin role, and protected CMS access.')
  }
}

const ownerLink = async (redirectTo = 'https://akrion-digitals.vercel.app/admin') => {
  const client = getAdminClient()
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (!email) throw new Error('Set ADMIN_EMAIL to the verified owner email.')
  const { data, error } = await client.auth.admin.generateLink({ type: 'magiclink', email, options: { redirectTo } })
  if (error) throw error
  return data.properties
}

const verify = async () => {
  const properties = await ownerLink()
  const browserKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!browserKey) throw new Error('Set VITE_SUPABASE_ANON_KEY.')
  const options = { auth: { persistSession: false, autoRefreshToken: false } }
  const browser = createClient(`https://${ref}.supabase.co`, browserKey, options)
  const anonymous = createClient(`https://${ref}.supabase.co`, browserKey, options)
  const { data, error } = await browser.auth.verifyOtp({ token_hash: properties.hashed_token, type: 'magiclink' })
  if (error) throw error
  if (data.user.app_metadata?.role !== 'admin') throw new Error('Owner session is missing its protected admin role.')
  const marker = randomUUID()
  let rowId
  try {
    const draft = await browser.from('page_sections').insert({ page_key: '__cms_verification', section_key: marker, draft_content: { private: marker }, status: 'draft' }).select('id').single()
    if (draft.error) throw draft.error
    rowId = draft.data.id
    const hidden = await anonymous.from('published_page_sections').select('*').eq('id', rowId)
    if (hidden.error || hidden.data.length) throw new Error('A draft was not correctly hidden from the public view.')
    const updated = await browser.from('page_sections').update({ status: 'published', published_content: { heading: marker }, published_at: new Date().toISOString() }).eq('id', rowId)
    if (updated.error) throw updated.error
    const published = await anonymous.from('published_page_sections').select('*').eq('id', rowId).single()
    if (published.error || published.data.content?.heading !== marker || published.data.draft_content) throw new Error('Published content is not correctly separated from its private draft.')
    const denied = await anonymous.from('page_sections').insert({ page_key: '__cms_verification', section_key: marker + '-anonymous', status: 'draft' })
    if (!denied.error) throw new Error('Anonymous content writes were unexpectedly allowed.')
    const counts = {}
    for (const table of ['portfolio_projects', 'blog_posts', 'services', 'testimonials']) {
      const result = await browser.from(table).select('id', { count: 'exact', head: true })
      if (result.error) throw result.error
      counts[table] = result.count
    }
    console.log(JSON.stringify({ ownerLogin: 'passed', adminRole: 'passed', cmsReadWrite: 'passed', draftPrivacy: 'passed', anonymousWritesDenied: 'passed', counts }))
  } finally {
    await browser.from('page_sections').delete().eq('page_key', '__cms_verification').in('section_key', [marker, marker + '-anonymous'])
    await browser.auth.signOut()
  }
}

try {
  if (process.argv[2] === 'snapshot') await snapshot()
  else if (process.argv[2] === 'create-owner') await createOwner()
  else if (process.argv[2] === 'verify') await verify()
  else if (process.argv[2] === 'owner-link') console.log(JSON.stringify({ url: (await ownerLink()).action_link }))
  else throw new Error('Choose snapshot, create-owner, verify, or owner-link.')
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
