import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { productionPhotos, productionGallery, productionCollection, getProductionPhotoForUrl } from '../src/data/productionPhotos.js'
import { getProjectMedia, serializeMediaItems } from '../src/data/portfolioMedia.js'

test('real BTS photography has unique identities and meaningful descriptions', () => {
  assert.equal(productionGallery.length, 11)
  assert.equal(new Set(productionGallery.map((photo) => photo.id)).size, 11)
  for (const photo of productionGallery) {
    assert.ok(photo.alt.length > 30)
    assert.equal(photo.width, 1200)
    assert.equal(photo.smallWidth, 720)
    assert.ok(photo.height > photo.width)
    assert.match(photo.srcSet, /720w, .*1200w/)
  }
  assert.ok(productionPhotos.onLocation)
  assert.equal(productionCollection.slug, 'behind-the-scenes-at-akrion')
})

test('every photo has lightweight WebP sizes without EXIF/GPS or XMP metadata', async () => {
  let total = 0
  for (const photo of productionGallery) {
    for (const src of [photo.srcTiny, photo.srcSmall, photo.src]) {
      const file = await readFile(new URL(`../public${src}`, import.meta.url))
      assert.equal(file.toString('ascii', 0, 4), 'RIFF')
      assert.equal(file.toString('ascii', 8, 12), 'WEBP')
      assert.ok(file.length < 250 * 1024)
      if (src === photo.srcTiny) assert.ok(file.length < 45 * 1024)
      for (let offset = 12; offset + 8 <= file.length;) {
        const chunk = file.toString('ascii', offset, offset + 4)
        assert.ok(!['EXIF', 'XMP '].includes(chunk))
        const size = file.readUInt32LE(offset + 4)
        offset += 8 + size + (size % 2)
      }
      total += file.length
    }
  }
  assert.ok(total < 2.4 * 1024 * 1024)
})

test('BTS photographs use the existing editable media collection format', () => {
  const stored = serializeMediaItems(productionGallery.map((photo) => ({
    id: photo.id, title: photo.title, type: 'image', category: 'photos',
    url: `https://www.akriondigitals.com${photo.src}`,
    thumbnail: `https://www.akriondigitals.com${photo.srcSmall}`,
    alt: photo.alt, caption: '', orientation: 'portrait',
  })))
  assert.equal(getProjectMedia({ media_items: stored }).length, 11)
  assert.ok(stored.every((item) => item.category === 'photos' && item.thumbnail.endsWith('-720.webp')))
})

test('CMS photos keep their portrait dimensions without affecting custom uploads', () => {
  const local = getProductionPhotoForUrl(productionPhotos.onLocation.src)
  assert.equal(local.height, 2133)
  assert.equal(local.srcSmall, productionPhotos.onLocation.srcSmall)
  const stored = getProductionPhotoForUrl('https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/akrion-bts-on-location-1200.webp')
  assert.equal(stored.width, 1200)
  assert.match(stored.srcSmall, /-720.webp$/)
  assert.equal(stored.fallbackSrc, productionPhotos.onLocation.srcSmall)
  assert.match(local.fallbackSrc, /^https:\/\/gavhkkrnsuisqsjnnaow\.supabase\.co\/storage\//)
  assert.equal(getProductionPhotoForUrl('https://other.test/images/production/akrion-bts-on-location-1200.webp'), null)
  assert.equal(getProductionPhotoForUrl('https://www.akriondigitals.com/other/akrion-bts-on-location-1200.webp'), null)
})
