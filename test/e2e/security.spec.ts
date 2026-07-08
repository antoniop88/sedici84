import { expect, test } from '@playwright/test'

const keyPages = ['/', '/immobili/attico-brera', '/contatti']

test.describe('security', () => {
  for (const path of keyPages) {
    test(`no console errors or CSP violations on ${path}`, async ({ page }) => {
      const consoleErrors: string[] = []
      const cspViolations: string[] = []

      await page.route('**/_fonts/**', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'font/woff2',
          body: '',
        })
      })

      page.on('console', (message) => {
        if (message.type() !== 'error') return
        const text = message.text()
        if (text.includes('/_fonts/')) return
        if (text.includes('Failed to load resource')) return
        consoleErrors.push(text)
      })

      page.on('pageerror', (error) => {
        consoleErrors.push(error.message)
      })

      await page.addInitScript(() => {
        document.addEventListener('securitypolicyviolation', (event) => {
          ;(window as Window & { __cspViolations?: string[] }).__cspViolations ??= []
          ;(window as Window & { __cspViolations?: string[] }).__cspViolations!.push(
            `${event.violatedDirective}:${event.blockedURI}`,
          )
        })
      })

      const response = await page.goto(path)
      expect(response?.status()).toBeLessThan(400)

      const reported = await page.evaluate(() => {
        return (window as Window & { __cspViolations?: string[] }).__cspViolations ?? []
      })
      cspViolations.push(...reported)

      const actionableViolations = cspViolations.filter(
        (violation) => !violation.startsWith('script-src:eval'),
      )

      expect(consoleErrors, `console errors on ${path}`).toEqual([])
      expect(actionableViolations, `CSP violations on ${path}`).toEqual([])
    })
  }

  test('blocks Umami network requests before cookie consent', async ({ page }) => {
    const umamiRequests: string[] = []

    await page.route('**/*', (route) => {
      const url = route.request().url()
      if (url.includes('analytics.test.local')) {
        umamiRequests.push(url)
      }
      void route.continue()
    })

    await page.goto('/')
    await page.waitForTimeout(1_000)

    expect(umamiRequests).toEqual([])
  })
})
