import { test, expect } from '@playwright/test'
import { installFixtures } from './fixtures.mjs'

test('mobile starts with small real images and skips decorative slides in data saver mode', async ({ page }) => {
  await installFixtures(page)
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'connection', {
      value: Object.assign(new EventTarget(), { saveData: true, effectiveType: '3g' }),
    })
  })
  await page.setViewportSize({ width: 390, height: 844 })
  const fonts = []
  page.on('request', request => { if (/fonts\.googleapis|fonts\.gstatic/.test(request.url())) fonts.push(request.url()) })
  await page.goto('/')
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible()
  const poster = page.locator('.showreel-card img[src*="interview-monitors"]')
  await expect(poster).toHaveAttribute('data-image-state', 'loaded')
  expect(await poster.evaluate(image => image.currentSrc)).toMatch(/-480\.webp$/)
  const introduction = page.locator('.who-we-are-image-frame img')
  await introduction.scrollIntoViewIfNeeded()
  await expect(introduction).toHaveAttribute('data-image-state', 'loaded')
  expect(await introduction.evaluate(image => image.currentSrc)).toMatch(/-480\.webp$/)
  await expect(page.locator('.hero-background-slideshow')).toHaveAttribute('data-paused', 'true')
  await expect(page.locator('.hero-background-image')).toHaveCount(1)
  expect(fonts).toEqual([])
})

test('the navigation stays mounted while a destination chunk is delayed', async ({ page }) => {
  await installFixtures(page)
  await page.setViewportSize({ width: 1440, height: 900 })
  let release
  const wait = new Promise(resolve => { release = resolve })
  await page.route('**/src/components/About.jsx', async route => { await wait; await route.continue() })
  await page.goto('/')
  const menu = page.getByRole('navigation', { name: 'Main navigation' })
  await menu.evaluate(element => { element.dataset.qaPersistent = 'true' })
  try {
    const requested = page.waitForRequest('**/src/components/About.jsx')
    await menu.getByRole('link', { name: 'About', exact: true }).click()
    await requested
    await expect(menu).toBeVisible()
  } finally {
    release()
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ABOUT.')
  await expect(menu).toHaveAttribute('data-qa-persistent', 'true')
})
