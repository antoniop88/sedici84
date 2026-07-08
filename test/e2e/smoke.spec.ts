import { expect, test } from '@playwright/test'

test.use({ locale: 'it-IT' })

test.describe('smoke', () => {
  test('home page renders in SSR', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('main pages respond successfully', async ({ page }) => {
    for (const path of ['/chi-siamo', '/contatti', '/immobili', '/lavori']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    }
  })

  test('header navigation links work', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: /navigazione principale|main navigation/i })
      .getByRole('link', { name: /contatti|contact/i })
      .click()
    await expect(page).toHaveURL(/\/contatti/)
  })
})
