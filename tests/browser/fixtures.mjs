import { readFile } from 'node:fs/promises'

// Local-only browser fixtures. These records never reach the live database.
const picture = 'https://media.example.test/project.webp'
const media = (id, category) => ({ id, type: category === 'photos' ? 'image' : 'video', category, title: `QA ${category}`, url: category === 'photos' ? picture : 'https://www.youtube.com/watch?v=M7lc1UVf-VE', thumbnail: category === 'photos' ? '' : picture, alt: 'Local test project visual', caption: '', orientation: category === 'reels' ? 'portrait' : 'landscape' })
export const makeRecords = () => [
  { id: 501, title: 'QA Company Collection', slug: 'qa-company-collection', description: 'Local test collection.', card_description: 'Local test collection.', image: picture, category: 'Video production', status: 'published', collection_type: 'company', featured: true, media_items: ['tv-promo', 'interview', 'behind-the-scenes', 'reels', 'photos'].map((category, index) => media(`qa-${index}`, category)), gallery: [], sort_order: 0 },
  { id: 502, title: 'QA Photo Project', slug: 'qa-photo-project', description: 'Local photo project.', card_description: 'Local photo project.', image: picture, category: 'Photography', status: 'published', collection_type: 'project', media_items: [media('qa-photo', 'photos')], gallery: [], sort_order: 1 },
]

export const installFixtures = async (page, { admin = false } = {}) => {
  page.on('pageerror', (error) => console.error(`Browser exception: ${error.message}`))
  let records = makeRecords()
  const writes = []
  const image = await readFile(new URL('../../src/assets/services/service-brand-identity-720.webp', import.meta.url))
  const user = { id: '11111111-1111-4111-8111-111111111111', aud: 'authenticated', role: 'authenticated', email: 'qa@example.test', app_metadata: { role: 'admin' } }
  if (admin) {
    const payload = Buffer.from(JSON.stringify({ ...user, sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')
    await page.addInitScript((session) => localStorage.setItem('sb-portfolio-qa-auth-token', JSON.stringify(session)), { access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.localtest`, refresh_token: 'local-only', token_type: 'bearer', expires_at: Math.floor(Date.now() / 1000) + 3600, expires_in: 3600, user })
  }
  await page.route('https://media.example.test/**', (route) => route.fulfill({ contentType: 'image/webp', body: image }))
  await page.route('https://i.ytimg.com/**', (route) => route.fulfill({ contentType: 'image/webp', body: image }))
  await page.route('https://www.youtube-nocookie.com/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Local test video player</title><p>Player request verified.</p>' }))
  await page.route('https://portfolio-qa.supabase.co/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const headers = { 'content-type': 'application/json', 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-expose-headers': 'content-range', 'content-range': '0-1/2' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 200, headers, body: '{}' })
    if (url.pathname.startsWith('/auth/v1/user')) return route.fulfill({ headers, body: JSON.stringify(user) })
    if (url.pathname.startsWith('/storage/v1/object/')) return route.fulfill({ headers, body: JSON.stringify({ Key: 'images/portfolio/qa-upload.png', Id: 'qa-upload' }) })
    if (url.pathname.includes('/rest/v1/portfolio_projects')) {
      if (request.method() === 'POST') {
        const [created] = request.postDataJSON(); writes.push(created)
        const record = { ...created, id: 503 }
        records.push(record)
        return route.fulfill({ headers, body: JSON.stringify(record) })
      }
      if (request.method() === 'PATCH') {
        const update = request.postDataJSON(); writes.push(update)
        const id = Number(url.searchParams.get('id')?.replace('eq.', ''))
        records = records.map((record) => record.id === id ? { ...record, ...update } : record)
        return route.fulfill({ headers, body: JSON.stringify(records.find((record) => record.id === id)) })
      }
      const filtered = records.filter((record) => (!url.searchParams.get('status') || record.status === url.searchParams.get('status').replace('eq.', '')) && (!url.searchParams.get('id') || record.id === Number(url.searchParams.get('id').replace('eq.', ''))))
      return route.fulfill({ headers, body: JSON.stringify(filtered) })
    }
    return route.fulfill({ headers, body: '[]' })
  })
  return { writes, getRecords: () => records }
}
