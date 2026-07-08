import { expect, test } from '@playwright/test'

test.describe('errors', () => {
  test('missing project slug returns 404', async ({ page }) => {
    const response = await page.goto('/lavori/slug-inesistente')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })
})
