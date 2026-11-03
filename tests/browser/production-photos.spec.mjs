import { test, expect } from '@playwright/test'
import { installFixtures } from './fixtures.mjs'
import { productionGallery, productionCollection } from '../../src/data/productionPhotos.js'

const albumRecord = () => ({
  id: 504, slug: productionCollection.slug, title: productionCollection.title,
  image: productionGallery[0].src, description: productionCollection.description,
  status: 'published', category: 'Behind the Scenes',
  media_items: productionGallery.map((photo) => ({
    id: photo.id, title: photo.title, type: 'image', category: 'photos',
    url: photo.src, thumbnail: photo.srcSmall, alt: photo.alt, orientation: 'portrait',
  })),
})

for (const width of [390, 1440]) {
  test(`real production photography fits the existing site at ${width}px`, async ({ page }) => {
    await installFixtures(page)
    await page.setViewportSize({ width, height: 900 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const route of ['/', '/about', '/services', '/blog']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      const content = page.locator(route === '/' ? '#root' : 'main')
      await expect(content).toBeVisible()
      if (route === '/about') {
        await expect(page.locator('.about-story-collage-tile img')).toHaveCount(3)
        for (const tile of await page.locator('.about-story-collage-tile img').all()) await tile.evaluate((img) => img.decode())
      }
      const pictures = content.locator('img[src*="/images/production/"]')
      await expect(pictures.first()).toBeAttached()
      const visible = await pictures.all()
      for (const picture of visible) {
        // Hidden crossfade layers stay lazy; inspect visible frames only.
        if (!await picture.isVisible() || await picture.evaluate((img) => img.closest('[aria-hidden="true"]') !== null)) continue
        await picture.scrollIntoViewIfNeeded()
        await picture.evaluate((img) => img.decode())
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
      expect(await content.locator('img[src*="service-"], img[src*="team-placeholder"], img[src*="unsplash"]').count()).toBe(0)
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await page.screenshot({ path: `test-results/real-photos-${route.replaceAll('/', '') || 'home'}-${width}.png` })
      if (route === '/') {
        const introduction = page.locator('.who-we-are-image-frame')
        await introduction.scrollIntoViewIfNeeded()
        await introduction.locator('img').evaluate((img) => img.decode())
        await introduction.screenshot({ path: `test-results/real-photos-introduction-${width}.png` })
      }
    }
  })
}

test('BTS album uses thumbnails and opens the original aspect ratio in the viewer', async ({ page }) => {
  const fixture = await installFixtures(page)
  fixture.getRecords().push(albumRecord())
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`/portfolio/${productionCollection.slug}`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.portfolio-case-gallery-item')).toHaveCount(11)
  await expect(page.locator('.portfolio-case-gallery-image').first()).toHaveAttribute('src', /-720.webp$/)
  await page.getByRole('button', { name: 'View On location', exact: true }).click()
  const fullImage = page.getByRole('dialog').locator('.portfolio-media-viewer-stage > img')
  await expect(fullImage).toHaveAttribute('src', /-1200.webp$/)
  await expect(fullImage).toHaveCSS('object-fit', 'contain')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('long albums remain visible on short screens with normal motion enabled', async ({ page }) => {
  const fixture = await installFixtures(page)
  const album = albumRecord()
  album.media_items = Array.from({ length: 40 }, (_, index) => ({ ...album.media_items[index % 11], id: `long-album-${index}` }))
  fixture.getRecords().push(album)
  await page.setViewportSize({ width: 640, height: 360 })
  await page.goto(`/portfolio/${productionCollection.slug}`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.portfolio-case-gallery-item')).toHaveCount(40)
  const first = page.locator('.portfolio-case-gallery-trigger').first()
  await first.scrollIntoViewIfNeeded()
  await expect(page.locator('.portfolio-case-section--work .portfolio-case-shell')).toHaveCSS('opacity', '1')
  await first.click()
  await expect(page.getByRole('dialog')).toBeVisible()
})
