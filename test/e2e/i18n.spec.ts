import { expect, test } from '@playwright/test'

test.describe('i18n', () => {
  test('language switch updates URL and html lang on static page', async ({ page }) => {
    await page.goto('/chi-siamo')
    await expect(page.locator('html')).toHaveAttribute('lang', /it/)

    await page
      .getByRole('navigation', { name: /lingua|language/i })
      .getByRole('link', { name: 'English' })
      .click()
    await expect(page).toHaveURL(/\/en\/about/)
    await expect(page.locator('html')).toHaveAttribute('lang', /en/)
  })

  test('Italian switch from EN home', async ({ page }) => {
    await page.goto('/en')
    await page
      .getByRole('navigation', { name: /lingua|language/i })
      .getByRole('link', { name: 'Italiano' })
      .click()
    await expect(page).toHaveURL('/')
  })

  test('language switch on an untranslated item goes to the list, not a 404', async ({ page }) => {
    await page.goto('/immobili/monolocale-porta-romana')
    await expect(page.locator('html')).toHaveAttribute('lang', /it/)

    const enLink = page
      .getByRole('navigation', { name: /lingua|language/i })
      .getByRole('link', { name: 'English' })
    // Must target the EN collection list, not /en/immobili/<it-slug> (a 404).
    await expect(enLink).toHaveAttribute('href', '/en/properties')

    await enLink.click()
    await expect(page).toHaveURL(/\/en\/properties$/)
    await expect(page.locator('main h1')).toBeVisible()
  })
})
