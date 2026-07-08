import type { H3Event } from 'h3'

const MOCK_LATENCY_MIN_MS = 50
const MOCK_LATENCY_MAX_MS = 150

export function isFastilyMockEnabled(): boolean {
  const publicEnv = process.env.NUXT_PUBLIC_ENV ?? 'development'
  if (publicEnv === 'production') return false

  const apiBaseUrl = process.env.NUXT_API_BASE_URL ?? ''
  if (apiBaseUrl) return false

  if (process.env.NUXT_USE_FASTILY_MOCK === 'false') return false

  return true
}

export async function simulateFastilyLatency(): Promise<void> {
  const delay =
    MOCK_LATENCY_MIN_MS + Math.floor(Math.random() * (MOCK_LATENCY_MAX_MS - MOCK_LATENCY_MIN_MS))
  await new Promise((resolve) => setTimeout(resolve, delay))
}

export function assertFastilyMockEnabled(event: H3Event): void {
  if (!isFastilyMockEnabled()) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  const apiKey = process.env.NUXT_API_KEY
  if (apiKey && getHeader(event, 'x-api-key') !== apiKey) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}

export function parseListQuery(event: H3Event) {
  const query = getQuery(event)
  const locale = String(query.locale ?? 'it')
  const page = Math.max(1, Number(query.page ?? 1) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize ?? 12) || 12))

  const filters: Record<string, string> = {}
  for (const [key, value] of Object.entries(query)) {
    if (['locale', 'page', 'pageSize'].includes(key)) continue
    if (value !== undefined && value !== '') {
      filters[key] = String(value)
    }
  }

  return { locale, page, pageSize, filters }
}
