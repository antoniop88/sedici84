import { expect, test } from '@playwright/test'

test.describe('cookie consent', () => {
  test.beforeEach(async ({ context }) => {
    await context.clearCookies()
  })

  test('banner appears and three actions work with persistence', async ({ page }) => {
    await page.goto('/')
    const banner = page.getByRole('dialog', { name: /cookie|preferenze/i })
    await expect(banner).toBeVisible()

    await page.getByRole('button', { name: /preferenze|preferences/i }).click()
    await expect(page.getByRole('checkbox', { name: /analitici|analytics/i })).toBeVisible()
    await page.getByRole('button', { name: /annulla|cancel|close preferences/i }).click()

    await page.getByRole('button', { name: /rifiuta|reject/i }).click()
    await expect(banner).toBeHidden()

    await page.reload()
    await expect(banner).toBeHidden()

    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await expect(banner).toBeVisible()

    await page.getByRole('button', { name: /accetta tutti|accept all/i }).click()
    await expect(banner).toBeHidden()

    await page.reload()
    await expect(banner).toBeHidden()
  })
})
