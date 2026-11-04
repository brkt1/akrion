import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { installFixtures } from './fixtures.mjs'

const originalCover = 'https://gavhkkrnsuisqsjnnaow.supabase.co/storage/v1/object/public/images/portfolio/1777418739694_voxqus.png'
const useDocumentary = (fixture) => Object.assign(fixture.getRecords()[0], {
  id: 36, title: 'Documentary Film Production', slug: 'documentary-film-production', image: originalCover,
})

for (const width of [320, 375, 390, 430, 768, 1440]) {
  test(`portfolio cover images load automatically at ${width}px`, async ({ page }) => {
    const fixture = await installFixtures(page)
    useDocumentary(fixture)
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' })
    const covers = page.locator('.portfolio-grid-card-image')
    await expect(covers).toHaveCount(2)
    for (const cover of await covers.all()) {
      await cover.scrollIntoViewIfNeeded()
      // Do not call decode() or change loading: the page itself must request
      // and display each thumbnail, exactly as it does for a visitor.
      await expect(cover).toHaveAttribute('data-image-state', 'loaded')
      expect(await cover.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true)
      const bounds = await cover.boundingBox()
      expect(bounds.width).toBeGreaterThan(100)
      expect(bounds.height).toBeGreaterThan(100)
    }
    expect(await covers.first().getAttribute('loading')).toBe('eager')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    if ([390, 1440].includes(width)) await page.screenshot({ path: `test-results/portfolio-covers-${width}.png` })
  })
}

test('failed optimized covers recover to the existing original photograph', async ({ page }) => {
  const fixture = await installFixtures(page)
  useDocumentary(fixture)
  const photo = await readFile(new URL('../../src/assets/portfolio/documentary-film-720.webp', import.meta.url))
  await page.route('**/src/assets/portfolio/documentary-film-*.webp*', (route) => route.request().resourceType() === 'image' ? route.abort('failed') : route.continue())
  await page.route(originalCover, (route) => route.fulfill({ contentType: 'image/webp', body: photo }))
  await page.goto('/portfolio', { waitUntil: 'domcontentloaded' })
  const cover = page.locator('.portfolio-grid-card-image').first()
  await expect(cover).toHaveAttribute('src', originalCover)
  await expect(cover).toHaveAttribute('data-image-state', 'loaded')
  expect(await cover.getAttribute('srcset')).toBeNull()
  await page.getByRole('link', { name: 'View the Documentary Film Production case study', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Documentary Film Production')
})

test('stalled cover requests recover without waiting for a browser network error', async ({ page }) => {
  const fixture = await installFixtures(page)
  useDocumentary(fixture)
  const photo = await readFile(new URL('../../src/assets/portfolio/documentary-film-720.webp', import.meta.url))
  let release
  const stalled = new Promise((resolve) => { release = resolve })
  await page.route('**/src/assets/portfolio/documentary-film-*.webp*', async (route) => {
    if (route.request().resourceType() !== 'image') return route.continue()
    await stalled
    await route.abort().catch(() => {})
  })
  await page.route(originalCover, (route) => route.fulfill({ contentType: 'image/webp', body: photo }))
  try {
    await page.goto('/portfolio', { waitUntil: 'domcontentloaded' })
    const cover = page.locator('.portfolio-grid-card-image').first()
    await expect(cover).toHaveAttribute('data-image-state', 'loading')
    await expect(cover).toHaveAttribute('src', originalCover, { timeout: 12000 })
    await expect(cover).toHaveAttribute('data-image-state', 'loaded')
  } finally { release() }
})

test('unavailable custom images show a readable fallback rather than an empty card', async ({ page }) => {
  await installFixtures(page)
  await page.route('https://media.example.test/**', (route) => route.abort('failed'))
  await page.goto('/portfolio', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('.portfolio-card-media .portfolio-image-unavailable')).toHaveCount(2)
  await expect(page.locator('.portfolio-card-media .portfolio-image-unavailable').first()).toHaveText('Image unavailable')
})
