import { expect, test } from '@playwright/test'

test.use({ locale: 'it-IT' })

test.describe('smoke', () => {
  test('home page renders in SSR', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('main pages respond successfully', async ({ page }) => {
    for (const path of ['/chi-siamo', '/servizi', '/contatti', '/collezioni']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(200)
    }
  })

  test('header navigation links work', async ({ page }) => {
    await page.goto('/')
    // Since the nav-split redesign, Contatti is the header's main button, not a nav word.
    await page
      .getByRole('banner')
      .getByRole('link', { name: /contattaci|contact us/i })
      .click()
    await expect(page).toHaveURL(/\/contatti/)

    await page.goto('/')
    await page
      .getByRole('navigation', { name: /navigazione principale|main navigation/i })
      .getByRole('link', { name: /servizi|services/i })
      .click()
    await expect(page).toHaveURL(/\/servizi/)
  })
})
