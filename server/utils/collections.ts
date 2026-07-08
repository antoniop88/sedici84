import type { H3Event } from 'h3'
import { createHash } from 'node:crypto'
import {
  collectionApiPaths,
  type CollectionKey,
  type CollectionListResponse,
  type CollectionSlugIndex,
  type LocaleCode,
  getAllCollectionKeys,
  getCollectionConfig,
  isCollectionKey,
} from '../../config/collections'
import type { CollectionListQuery } from '../../config/collections/contract'
import { fetchMockItem, fetchMockList, fetchMockSlugs } from './collections-mock-data'
import { isFastilyMockEnabled } from './fastily-mock'

const FETCH_TIMEOUT_MS = 8_000

type FetchListOptions = CollectionListQuery

function hashFilters(filters: Record<string, unknown> | undefined): string {
  if (!filters || Object.keys(filters).length === 0) return 'none'
  const sorted = Object.keys(filters)
    .sort()
    .map((k) => `${k}=${String(filters[k])}`)
    .join('&')
  return createHash('sha256').update(sorted).digest('hex').slice(0, 12)
}

function resolveEvent(event?: H3Event): H3Event | undefined {
  return event
}

function getApiBaseUrl(event?: H3Event): string {
  const resolvedEvent = resolveEvent(event)
  const config = useRuntimeConfig(resolvedEvent)
  if (config.apiBaseUrl) return config.apiBaseUrl.replace(/\/$/, '')

  if (isFastilyMockEnabled()) {
    const siteUrl = process.env.NUXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
    return siteUrl.replace(/\/$/, '')
  }

  return ''
}

function getAuthHeaders(event?: H3Event): Record<string, string> {
  const config = useRuntimeConfig(resolveEvent(event))
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (config.apiKey) {
    headers['X-Api-Key'] = config.apiKey
  }
  return headers
}

async function fetchFromFastily<T>(
  path: string,
  query: Record<string, string | number | undefined>,
  event?: H3Event,
): Promise<T | null> {
  const baseUrl = getApiBaseUrl(event)
  if (!baseUrl) {
    console.warn('[collections] No API base URL configured and mock is disabled')
    return null
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const data = await $fetch<T>(path, {
      baseURL: baseUrl,
      query,
      headers: getAuthHeaders(event),
      signal: controller.signal,
      retry: 0,
    })
    return data as T
  } catch (error: unknown) {
    const fetchError = error as { statusCode?: number; message?: string }
    // Genuine "not found" is the ONLY case that maps to null (→ 404 downstream).
    if (fetchError.statusCode === 404) return null
    // Every other failure (5xx, timeout/abort, DNS/connection) is an infrastructure error:
    // surface it as 502 so the SSR page emits a retryable 5xx instead of a soft-404 (empty
    // list with HTTP 200) or a false 404 on a valid, indexed URL.
    const reason = controller.signal.aborted
      ? `timeout after ${FETCH_TIMEOUT_MS}ms`
      : (fetchError.message ?? 'unknown error')
    console.error(`[collections] Upstream request failed ${path}: ${reason}`)
    throw createError({
      statusCode: 502,
      statusMessage: 'Upstream request failed',
      data: { path, upstreamStatus: fetchError.statusCode ?? null },
    })
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchListRaw<K extends CollectionKey>(
  key: K,
  options: FetchListOptions,
  event?: H3Event,
): Promise<CollectionListResponse<unknown>> {
  const config = getCollectionConfig(key)
  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 12

  const response = isFastilyMockEnabled()
    ? fetchMockList(key, options)
    : await fetchFromFastily<CollectionListResponse<unknown>>(
        collectionApiPaths.list(key),
        {
          locale: options.locale,
          page,
          pageSize,
          ...buildFilterQuery(key, options.filters),
        },
        event,
      )

  if (!response) {
    return { items: [], page, pageSize, total: 0 }
  }

  const parsed = response.items
    .map((item) => {
      const result = config.schema.safeParse(item)
      if (!result.success) {
        console.warn(`[collections] Invalid item in list for ${key}:`, result.error.message)
        return null
      }
      return result.data
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)

  return { ...response, items: parsed }
}

async function fetchItemRaw<K extends CollectionKey>(
  key: K,
  slug: string,
  locale: LocaleCode,
  event?: H3Event,
): Promise<unknown | null> {
  const config = getCollectionConfig(key)

  const response = isFastilyMockEnabled()
    ? fetchMockItem(key, slug, locale)
    : await fetchFromFastily<unknown>(collectionApiPaths.item(key, slug), { locale }, event)

  if (!response) return null

  const result = config.schema.safeParse(response)
  if (!result.success) {
    console.warn(`[collections] Invalid item for ${key}/${slug}:`, result.error.message)
    return null
  }

  // Enforce the canonical per-locale slug for BOTH locales (was EN-only): a lenient backend that
  // resolves an item by id or by another locale's slug must not render it at a non-canonical,
  // indexable URL. The mock already resolves strictly per-locale, so this is a no-op there.
  const item = result.data as { slugs?: Partial<Record<LocaleCode, string>> }
  const canonicalSlug = item.slugs?.[locale]
  if (!canonicalSlug || canonicalSlug !== slug) {
    return null
  }

  return result.data
}

async function fetchSlugsRaw(key: CollectionKey, event?: H3Event): Promise<CollectionSlugIndex[]> {
  if (isFastilyMockEnabled()) {
    return fetchMockSlugs(key)
  }

  const path = collectionApiPaths.slugs(key)
  const response = await fetchFromFastily<CollectionSlugIndex[]>(path, {}, event)
  return response ?? []
}

function buildFilterQuery(
  key: CollectionKey,
  filters: Record<string, string | number | boolean | undefined> | undefined,
): Record<string, string> {
  const config = getCollectionConfig(key)
  const query: Record<string, string> = {}

  if (!filters) return query

  for (const [filterKey, value] of Object.entries(filters)) {
    if (config.filters.some((f) => f.name === filterKey) && value !== undefined && value !== '') {
      query[filterKey] = String(value)
    }
  }

  return query
}

function createListCache(key: CollectionKey) {
  const config = getCollectionConfig(key)
  return defineCachedFunction((options: FetchListOptions) => fetchListRaw(key, options), {
    name: `collection-list-${key}`,
    maxAge: config.cacheTtl,
    getKey: (options: FetchListOptions) =>
      `collection:list:${key}:${options.locale}:${hashFilters(options.filters)}:${options.page ?? 1}:${options.pageSize ?? 12}`,
  })
}

function createItemCache(key: CollectionKey) {
  const config = getCollectionConfig(key)
  return defineCachedFunction(
    (slug: string, locale: LocaleCode) => fetchItemRaw(key, slug, locale),
    {
      name: `collection-item-${key}`,
      maxAge: config.cacheTtl,
      getKey: (slug: string, locale: LocaleCode) => `collection:item:${key}:${locale}:${slug}`,
    },
  )
}

function createSlugsCache(key: CollectionKey) {
  const config = getCollectionConfig(key)
  return defineCachedFunction(() => fetchSlugsRaw(key), {
    name: `collection-slugs-${key}`,
    maxAge: config.cacheTtl,
    getKey: () => `collection:slugs:${key}`,
  })
}

const listCaches = Object.fromEntries(
  getAllCollectionKeys().map((key) => [key, createListCache(key)]),
) as Record<CollectionKey, ReturnType<typeof createListCache>>

const itemCaches = Object.fromEntries(
  getAllCollectionKeys().map((key) => [key, createItemCache(key)]),
) as Record<CollectionKey, ReturnType<typeof createItemCache>>

const slugsCaches = Object.fromEntries(
  getAllCollectionKeys().map((key) => [key, createSlugsCache(key)]),
) as Record<CollectionKey, ReturnType<typeof createSlugsCache>>

export async function fetchList<K extends CollectionKey>(
  key: K,
  options: FetchListOptions,
  _event?: H3Event,
) {
  const result = isFastilyMockEnabled()
    ? await fetchListRaw(key, options)
    : await listCaches[key](options)
  return result as CollectionListResponse<import('../../config/collections').CollectionItem<K>>
}

export async function fetchItem<K extends CollectionKey>(
  key: K,
  slug: string,
  locale: LocaleCode,
  _event?: H3Event,
) {
  const result = isFastilyMockEnabled()
    ? await fetchItemRaw(key, slug, locale)
    : await itemCaches[key](slug, locale)
  return result as import('../../config/collections').CollectionItem<K> | null
}

export async function fetchSlugs(key: CollectionKey, _event?: H3Event) {
  return isFastilyMockEnabled() ? fetchSlugsRaw(key) : slugsCaches[key]()
}

export async function invalidateCollection(collection: string, slug?: string): Promise<void> {
  if (!isCollectionKey(collection)) return

  const storage = useStorage('cache')
  const keys = await storage.getKeys()
  const patterns = [
    `collection:list:${collection}`,
    `collection:slugs:${collection}`,
    `collection:item:${collection}`,
  ]

  for (const key of keys) {
    const shouldInvalidate = patterns.some((pattern) => key.includes(pattern))
    if (!shouldInvalidate) continue
    if (slug && key.includes('collection:item') && !key.includes(`:${slug}`)) continue
    await storage.removeItem(key)
  }
}

export function parseAllowedFilters(
  key: CollectionKey,
  query: Record<string, unknown>,
): Record<string, string> {
  const config = getCollectionConfig(key)
  const filters: Record<string, string> = {}

  for (const { name: filterKey } of config.filters) {
    const value = query[filterKey]
    if (value !== undefined && value !== null && value !== '') {
      filters[filterKey] = String(value)
    }
  }

  return filters
}
