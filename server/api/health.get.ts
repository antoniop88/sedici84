import type { H3Event } from 'h3'
import { collectionApiPaths, getAllCollectionKeys } from '../../config/collections'
import { isFastilyMockEnabled } from '../utils/fastily-mock'

const FASTILY_PING_TIMEOUT_MS = 2_000

type FastilyHealth = {
  reachable: boolean
  latencyMs?: number
  error?: string
}

async function checkFastilyHealth(event: H3Event): Promise<FastilyHealth> {
  const config = useRuntimeConfig(event)
  let baseUrl = config.apiBaseUrl?.replace(/\/$/, '') ?? ''

  if (!baseUrl && isFastilyMockEnabled()) {
    baseUrl = (config.public.siteUrl ?? 'http://localhost:3000').replace(/\/$/, '')
  }

  if (!baseUrl) {
    return { reachable: false, error: 'not_configured' }
  }

  const [firstKey] = getAllCollectionKeys()
  if (!firstKey) {
    return { reachable: false, error: 'no_collections' }
  }

  const startedAt = Date.now()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FASTILY_PING_TIMEOUT_MS)

  try {
    await $fetch(collectionApiPaths.slugs(firstKey), {
      baseURL: baseUrl,
      method: 'GET',
      signal: controller.signal,
      headers: config.apiKey ? { 'X-Api-Key': config.apiKey } : undefined,
      retry: 0,
    })
    return { reachable: true, latencyMs: Date.now() - startedAt }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'unreachable'
    return {
      reachable: false,
      latencyMs: Date.now() - startedAt,
      error: message,
    }
  } finally {
    clearTimeout(timeout)
  }
}

export default defineEventHandler(async (event) => {
  const fastily = await checkFastilyHealth(event)

  return {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    dependencies: {
      fastily,
    },
  }
})
