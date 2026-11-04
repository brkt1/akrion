import { test, expect } from '@playwright/test'
import { installFixtures } from './fixtures.mjs'
import { productionPhotos } from '../../src/data/productionPhotos.js'

for (const width of [320, 390, 768, 1440]) {
  test(`photo frames match the photographs at ${width}px`, async ({ page }) => {
    const fixture = await installFixtures(page)
    const photos = [productionPhotos.onLocation, productionPhotos.interviewSet]
    // The last image is a custom landscape image without stored dimensions.
    // It must also size naturally, rather than rely on the editor orientation.
    fixture.getRecords()[0].media_items = [
      ...photos.map((photo) => ({ id: photo.id, type: 'image', category: 'photos', title: photo.title, url: photo.src, thumbnail: photo.srcSmall, alt: photo.alt, orientation: 'portrait' })),
      { id: 'landscape', type: 'image', category: 'photos', title: 'Landscape', url: 'https://media.example.test/landscape.webp', orientation: 'landscape' },
    ]
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/portfolio/qa-company-collection', { waitUntil: 'domcontentloaded' })
    const cards = page.locator('.portfolio-case-gallery-item')
    await expect(cards).toHaveCount(3)
    for (const card of await cards.all()) {
      const image = card.locator('img')
      await image.scrollIntoViewIfNeeded()
      await expect(image).toHaveAttribute('data-image-state', 'loaded')
      const dimensions = await image.evaluate((img) => {
        const frame = img.closest('button').getBoundingClientRect()
        const picture = img.getBoundingClientRect()
        return { frameWidth: frame.width, frameHeight: frame.height, width: picture.width, height: picture.height, ratio: img.naturalWidth / img.naturalHeight, padding: getComputedStyle(img).padding }
      })
      expect(Math.abs(dimensions.frameWidth - dimensions.width)).toBeLessThan(3)
      expect(Math.abs(dimensions.frameHeight - dimensions.height)).toBeLessThan(3)
      expect(dimensions.width / dimensions.height).toBeCloseTo(dimensions.ratio, 2)
      expect(dimensions.padding).toBe('0px')
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
    const portrait = cards.first().locator('button')
    await portrait.scrollIntoViewIfNeeded()
    if ([390, 1440].includes(width)) await page.screenshot({ path: `test-results/photo-frames-${width}.png` })
    await portrait.click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByRole('dialog').locator('img')).toHaveCSS('object-fit', 'contain')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).not.toBeVisible()
  })
}
