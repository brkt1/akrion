import { test, expect } from '@playwright/test'
import { installFixtures } from './fixtures.mjs'

for (const [width, height] of [[320, 568], [390, 844], [1440, 900]]) {
  test(`video dialog follows portrait and landscape media at ${width}px`, async ({ page }) => {
    await installFixtures(page)
    await page.setViewportSize({ width, height })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/portfolio/qa-company-collection')
    await page.getByRole('button', { name: 'Watch QA reels', exact: true }).click()
    const dialog = page.getByRole('dialog')
    const frame = dialog.locator('iframe')
    const size = () => frame.evaluate((iframe) => {
      const picture = iframe.getBoundingClientRect()
      const outer = iframe.closest('dialog').getBoundingClientRect()
      return { picture: picture.width, frame: outer.width, ratio: picture.width / picture.height }
    })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText('Use the player’s Settings → Quality when available.')).toBeVisible()
    await expect(dialog.getByRole('link', { name: /Open on YouTube/ })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=M7lc1UVf-VE')
    const portrait = await size()
    expect(portrait.ratio).toBeCloseTo(9 / 16, 2)
    expect(portrait.frame - portrait.picture).toBeLessThan(3)

    await dialog.getByRole('button', { name: 'Show previous media' }).click()
    const landscape = await size()
    expect(landscape.ratio).toBeCloseTo(16 / 9, 2)
    expect(landscape.frame - landscape.picture).toBeLessThan(3)
    expect(landscape.frame).toBeGreaterThan(portrait.frame)
    expect(landscape.frame).toBeLessThan(width)
    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('iframe')).toHaveCount(0)
  })
}
