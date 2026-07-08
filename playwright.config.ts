import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PLAYWRIGHT_PORT ?? 3100)
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: 'test/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      'sh -c "NUXT_PUBLIC_SITE_URL=' +
      baseURL +
      ' NUXT_PUBLIC_ENV=development test -f .output/server/index.mjs || pnpm build; node .output/server/index.mjs"',
    url: `${baseURL}/api/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      HOST: '127.0.0.1',
      PORT: String(port),
      NUXT_PUBLIC_SITE_URL: baseURL,
      NUXT_PUBLIC_ENV: 'development',
      NUXT_PUBLIC_UMAMI_HOST: 'https://analytics.test.local',
      NUXT_PUBLIC_UMAMI_WEBSITE_ID: 'test-website-id',
    },
  },
})
