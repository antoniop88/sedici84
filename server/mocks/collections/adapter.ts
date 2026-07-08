import type { CollectionSlugIndex } from '../../../config/collections/contract'

/**
 * Per-collection mock data source (development only). Register one adapter per collection in
 * ./registry.ts so the dispatch layer and dev BFF routes stay generic — no `if (key === '...')`.
 */
export type CollectionMockAdapter = {
  list: (
    filters?: Record<string, string | number | boolean | undefined>,
    locale?: string,
  ) => unknown[]
  findBySlug: (slug: string, locale: string) => unknown | null
  slugs: () => CollectionSlugIndex[]
}
