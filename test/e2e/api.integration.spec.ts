import { createServer, type Server } from 'node:http'
import { spawn, type ChildProcess } from 'node:child_process'
import { once } from 'node:events'
import { expect, test } from '@playwright/test'
import { mockImmobiliItems, getMockImmobiliSlugs } from '../../server/mocks/collections/immobili'

const REVALIDATE_SECRET = 'ci-revalidate-secret'

async function waitForHealth(url: string, timeoutMs = 30_000) {
  const startedAt = Date.now()
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // retry
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`Timed out waiting for ${url}`)
}

function startMockUpstream(port: number): Promise<Server> {
  let upstreamCalls = 0

  const server = createServer((req, res) => {
    upstreamCalls++
    ;(server as Server & { upstreamCalls: number }).upstreamCalls = upstreamCalls

    const url = req.url ?? ''

    if (url.startsWith('/collections/immobili/slugs')) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(getMockImmobiliSlugs()))
      return
    }

    if (url.startsWith('/collections/immobili/attico-brera')) {
      const item = mockImmobiliItems.find((entry) => entry.slugs.it === 'attico-brera')
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(item))
      return
    }

    if (url.startsWith('/collections/immobili')) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(
        JSON.stringify({
          items: mockImmobiliItems,
          page: 1,
          pageSize: 12,
          total: mockImmobiliItems.length,
        }),
      )
      return
    }

    res.writeHead(404)
    res.end()
  })

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', (error) => {
      if (error) reject(error)
      else resolve(server)
    })
  })
}

function startFailingUpstream(port: number): Promise<Server> {
  const server = createServer((_req, res) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' })
    res.end('upstream boom')
  })

  return new Promise((resolve, reject) => {
    server.listen(port, '127.0.0.1', (error) => {
      if (error) reject(error)
      else resolve(server)
    })
  })
}

test.describe('revalidate webhook', () => {
  test('rejects requests without a valid secret', async ({ request }) => {
    const response = await request.post('/api/collections/revalidate', {
      data: { collection: 'immobili' },
    })
    expect(response.status()).toBe(401)
  })

  test('accepts requests with a valid bearer secret', async ({ request }) => {
    const response = await request.post('/api/collections/revalidate', {
      headers: {
        Authorization: `Bearer ${REVALIDATE_SECRET}`,
      },
      data: { collection: 'immobili', slug: 'attico-brera' },
    })
    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.revalidated).toBe(true)
    expect(body.collection).toBe('immobili')
  })

  test('accepts requests with X-Revalidate-Secret header', async ({ request }) => {
    const response = await request.post('/api/collections/revalidate', {
      headers: {
        'X-Revalidate-Secret': REVALIDATE_SECRET,
      },
      data: { collection: 'immobili' },
    })
    expect(response.ok()).toBeTruthy()
  })

  test('enforces API rate limiting', async ({ request }) => {
    let rateLimited = false

    for (let attempt = 0; attempt < 65; attempt++) {
      const response = await request.get('/api/health')
      if (response.status() === 429) {
        rateLimited = true
        break
      }
    }

    expect(rateLimited).toBe(true)
  })
})

test.describe('collections cache', () => {
  test.describe.configure({ mode: 'serial' })

  test('respects TTL and invalidates on webhook', async () => {
    const mockPort = 4500 + Math.floor(Math.random() * 500)
    const appPort = 3500 + Math.floor(Math.random() * 500)
    const baseUrl = `http://127.0.0.1:${appPort}`
    const mockServer = await startMockUpstream(mockPort)
    const typedMockServer = mockServer as Server & { upstreamCalls: number }
    typedMockServer.upstreamCalls = 0

    const app: ChildProcess = spawn('node', ['.output/server/index.mjs'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOST: '127.0.0.1',
        PORT: String(appPort),
        NUXT_PUBLIC_SITE_URL: baseUrl,
        NUXT_PUBLIC_ENV: 'development',
        NUXT_USE_FASTILY_MOCK: 'false',
        NUXT_API_BASE_URL: `http://127.0.0.1:${mockPort}`,
        NUXT_REVALIDATE_SECRET: REVALIDATE_SECRET,
      },
      stdio: 'pipe',
    })

    try {
      await waitForHealth(`${baseUrl}/api/health`)

      typedMockServer.upstreamCalls = 0
      await fetch(`${baseUrl}/api/collections/immobili?locale=it`)
      const afterFirstList = typedMockServer.upstreamCalls
      await fetch(`${baseUrl}/api/collections/immobili?locale=it`)
      expect(typedMockServer.upstreamCalls).toBe(afterFirstList)
      expect(afterFirstList).toBeGreaterThan(0)

      await fetch(`${baseUrl}/api/collections/immobili/attico-brera?locale=it`)
      const afterFirstItem = typedMockServer.upstreamCalls
      await fetch(`${baseUrl}/api/collections/immobili/attico-brera?locale=it`)
      expect(typedMockServer.upstreamCalls).toBe(afterFirstItem)

      await fetch(`${baseUrl}/api/__sitemap__/collections`)
      const afterFirstSlugs = typedMockServer.upstreamCalls
      await fetch(`${baseUrl}/api/__sitemap__/collections`)
      expect(typedMockServer.upstreamCalls).toBe(afterFirstSlugs)

      typedMockServer.upstreamCalls = 0
      await fetch(`${baseUrl}/api/collections/immobili?locale=it`)
      expect(typedMockServer.upstreamCalls).toBe(0)

      const revalidateResponse = await fetch(`${baseUrl}/api/collections/revalidate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${REVALIDATE_SECRET}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection: 'immobili' }),
      })
      expect(revalidateResponse.ok).toBe(true)

      const beforeRefetch = typedMockServer.upstreamCalls
      await fetch(`${baseUrl}/api/collections/immobili?locale=it`)
      expect(typedMockServer.upstreamCalls).toBeGreaterThan(beforeRefetch)
    } finally {
      app.kill('SIGTERM')
      await once(app, 'exit').catch(() => undefined)
      await new Promise<void>((resolve, reject) => {
        mockServer.close((error) => (error ? reject(error) : resolve()))
      })
    }
  })
})

test.describe('upstream failure taxonomy', () => {
  test('returns 502 (not empty-200, not 404) when the upstream fails', async () => {
    const mockPort = 4700 + Math.floor(Math.random() * 200)
    const appPort = 3700 + Math.floor(Math.random() * 200)
    const baseUrl = `http://127.0.0.1:${appPort}`
    const failingUpstream = await startFailingUpstream(mockPort)

    const app: ChildProcess = spawn('node', ['.output/server/index.mjs'], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        HOST: '127.0.0.1',
        PORT: String(appPort),
        NUXT_PUBLIC_SITE_URL: baseUrl,
        NUXT_PUBLIC_ENV: 'development',
        NUXT_USE_FASTILY_MOCK: 'false',
        NUXT_API_BASE_URL: `http://127.0.0.1:${mockPort}`,
        NUXT_REVALIDATE_SECRET: REVALIDATE_SECRET,
      },
      stdio: 'pipe',
    })

    try {
      await waitForHealth(`${baseUrl}/api/health`)

      const listResponse = await fetch(`${baseUrl}/api/collections/immobili?locale=it`)
      expect(listResponse.status).toBe(502)

      const itemResponse = await fetch(`${baseUrl}/api/collections/immobili/attico-brera?locale=it`)
      expect(itemResponse.status).toBe(502)
    } finally {
      app.kill('SIGTERM')
      await once(app, 'exit').catch(() => undefined)
      await new Promise<void>((resolve, reject) => {
        failingUpstream.close((error) => (error ? reject(error) : resolve()))
      })
    }
  })
})
