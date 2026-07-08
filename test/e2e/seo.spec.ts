import { expect, test } from '@playwright/test'

test.describe('seo', () => {
  test('sitemap.xml responds', async ({ request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.ok()).toBeTruthy()
    expect(response.headers()['content-type']).toMatch(/xml/)
  })

  test('robots.txt responds', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.ok()).toBeTruthy()
    const body = await response.text()
    expect(body).toMatch(/User-agent|Disallow|Sitemap/i)
  })
})
