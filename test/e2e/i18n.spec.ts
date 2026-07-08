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
})
