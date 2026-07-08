#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const mockRoutes = [
  '/collections/immobili',
  '/collections/immobili/attico-brera',
  '/collections/immobili/slugs',
]

async function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      ...options,
    })
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve(undefined)
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

async function waitForHealth(url, timeoutMs = 30_000) {
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
  throw new Error(`Health check timed out for ${url}`)
}

async function main() {
  const port = 3100 + Math.floor(Math.random() * 500)
  const baseUrl = `http://127.0.0.1:${port}`

  const env = {
    ...process.env,
    NUXT_PUBLIC_SITE_URL: baseUrl,
    NUXT_PUBLIC_ENV: 'development',
    NUXT_API_BASE_URL: 'https://backend.invalid.test',
    NUXT_USE_FASTILY_MOCK: 'true',
    NITRO_PRESET: 'node-server',
    HOST: '127.0.0.1',
    PORT: String(port),
  }

  console.log('==> Building app with simulated real backend configured')
  await run('pnpm', ['build'], { cwd: rootDir, env })

  console.log('==> Starting production server')
  const server = spawn('node', ['.output/server/index.mjs'], {
    cwd: rootDir,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  let failed = false

  try {
    await waitForHealth(`${baseUrl}/api/health`)

    for (const route of mockRoutes) {
      const response = await fetch(`${baseUrl}${route}`)
      if (response.status !== 404) {
        console.error(`Expected 404 for ${route}, received ${response.status}`)
        failed = true
      }
    }
  } finally {
    server.kill('SIGTERM')
    await once(server, 'exit').catch(() => undefined)
  }

  if (failed) {
    process.exit(1)
  }

  console.log('==> Mock routes correctly blocked when API base URL is configured')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
