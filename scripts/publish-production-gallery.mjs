import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { isDeepStrictEqual } from 'node:util'
import { basename, resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { productionCollection, productionGallery } from '../src/data/productionPhotos.js'
import { serializeMediaItems } from '../src/data/portfolioMedia.js'

// Owner-run maintenance, never bundled in the browser. New files and one new
// collection only; existing projects, uploads and content are not rewritten.
const mode = process.argv[2]
if (!['draft', 'publish', 'verify'].includes(mode)) throw new Error('Choose draft, publish, or verify.')
const ref = 'gavhkkrnsuisqsjnnaow'
const cli = process.env.SUPABASE_CLI_PATH || 'supabase'
const response = spawnSync(cli, ['projects', 'api-keys', '--project-ref', ref, '--reveal', '--output', 'json'], { encoding: 'utf8', windowsHide: true, timeout: 120000 })
if (response.error || response.status !== 0) throw new Error('Sign in to the official Supabase CLI before publishing photos.')
const keys = JSON.parse(response.stdout)
const serviceKey = (keys.rows || keys).find((key) => key.name === 'service_role')?.api_key
if (!serviceKey) throw new Error('Authorized backend access is required.')
const client = createClient(`https://${ref}.supabase.co`, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
const imageUrl = (path) => client.storage.from('images').getPublicUrl(`portfolio/${basename(path)}`).data.publicUrl
const media = serializeMediaItems(productionGallery.map((photo) => ({
  id: `akrion-bts-${photo.id}`, type: 'image', category: 'photos',
  title: photo.title, url: imageUrl(photo.src), thumbnail: imageUrl(photo.srcSmall),
  alt: photo.alt, caption: '', orientation: 'portrait',
})))
const readCollection = async () => {
  const { data, error } = await client.from('portfolio_projects').select('*').eq('slug', productionCollection.slug).maybeSingle()
  if (error) throw error
  return data
}
const existing = await readCollection()
if (mode === 'draft') {
  for (let start = 0; start < productionGallery.length; start += 3) {
    await Promise.all(productionGallery.slice(start, start + 3).map(async (photo) => {
      for (const path of [photo.srcSmall, photo.src]) {
        const body = await readFile(resolve(`public${path}`))
        const name = `portfolio/${basename(path)}`
        const { error } = await client.storage.from('images').upload(name, body, { contentType: 'image/webp', cacheControl: '31536000', upsert: false })
        if (error) {
          const { data: old, error: readError } = await client.storage.from('images').download(name)
          if (readError || createHash('sha256').update(Buffer.from(await old.arrayBuffer())).digest('hex') !== createHash('sha256').update(body).digest('hex')) throw new Error(`Upload failed or a different file already exists: ${basename(path)}`)
        }
      }
      console.log(`Uploaded responsive photo: ${photo.id}`)
    }))
  }
  if (existing) {
    console.log('Collection already exists; its content and publication status were left unchanged.')
  } else {
    const { data: projects, error: listError } = await client.from('portfolio_projects').select('id,sort_order')
    if (listError) throw listError
    const { error } = await client.from('portfolio_projects').insert({
      slug: productionCollection.slug, title: productionCollection.title,
      description: productionCollection.description, card_description: productionCollection.description,
      project_summary: productionCollection.description,
      category: 'Behind the Scenes', tags: 'Production, BTS',
      image: imageUrl(productionGallery[0].src), featured_image: imageUrl(productionGallery[0].src),
      alt_text: productionGallery[0].alt,
      collection_type: 'project', media_items: media,
      status: 'draft', featured: false, homepage_featured: false,
      sort_order: Math.max(0, ...projects.map((project) => Number(project.sort_order) || 0)) + 1,
      seo_title: `${productionCollection.title} | Akrion Digitals`,
      seo_description: productionCollection.description,
    })
    if (error) throw error
    console.log(`Created one private draft with ${media.length} real photos; ${projects.length} existing projects unchanged.`)
  }
} else {
  if (!existing || existing.title !== productionCollection.title || !isDeepStrictEqual(existing.media_items, media)) throw new Error('The prepared collection is missing or has been edited. Review it before publishing.')
  if (mode === 'publish' && existing.status === 'draft') {
    const { error } = await client.from('portfolio_projects').update({ status: 'published', published_at: new Date().toISOString() }).eq('id', existing.id).eq('status', 'draft')
    if (error) throw error
  }
  const result = await readCollection()
  console.log(JSON.stringify({ slug: result.slug, status: result.status, photos: result.media_items.length, editableInAdmin: true }))
}
