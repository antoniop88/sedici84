import { expect, test } from '@playwright/test'

test.describe('collections regressions', () => {
  test('sitemap includes EN property slugs with translations only', async ({ request }) => {
    const indexResponse = await request.get('/sitemap.xml')
    expect(indexResponse.ok()).toBeTruthy()

    const enSitemapResponse = await request.get('/__sitemap__/en-US.xml')
    expect(enSitemapResponse.ok()).toBeTruthy()
    const body = await enSitemapResponse.text()

    expect(body).toContain('/en/properties/brera-penthouse')
    expect(body).toContain('/en/properties/navigli-loft')
    expect(body).toContain('/en/properties/como-villa')
    expect(body).not.toContain('/en/properties/monolocale-porta-romana')
  })

  test('EN property without translation returns 404 with noindex', async ({ page }) => {
    const response = await page.goto('/en/properties/monolocale-porta-romana')
    expect(response?.status()).toBe(404)

    const robots = page.locator('meta[name="robots"]')
    await expect(robots).toHaveCount(1)
    await expect(robots).toHaveAttribute('content', /noindex/i)
  })

  test('language switch on translated property uses EN slug', async ({ page }) => {
    await page.goto('/immobili/attico-brera')
    await page
      .getByRole('navigation', { name: /lingua|language/i })
      .getByRole('link', { name: 'English' })
      .click()
    await expect(page).toHaveURL(/\/en\/properties\/brera-penthouse/)
  })

  test('translated EN property detail renders', async ({ page }) => {
    const response = await page.goto('/en/properties/brera-penthouse')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
