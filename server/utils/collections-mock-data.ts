import type {
  CollectionKey,
  CollectionListResponse,
  CollectionSlugIndex,
} from '../../config/collections'
import type { CollectionListQuery } from '../../config/collections/contract'
import { paginateMockList } from '../mocks/collections/immobili'
import { mockRegistry } from '../mocks/collections/registry'

export function fetchMockList(
  key: CollectionKey,
  options: CollectionListQuery,
): CollectionListResponse<unknown> {
  const page = options.page ?? 1
  const pageSize = options.pageSize ?? 12
  const adapter = mockRegistry[key]

  if (!adapter) {
    return { items: [], page, pageSize, total: 0 }
  }

  return paginateMockList(adapter.list(options.filters, options.locale), page, pageSize)
}

export function fetchMockItem(key: CollectionKey, slug: string, locale: string): unknown | null {
  return mockRegistry[key]?.findBySlug(slug, locale) ?? null
}

export function fetchMockSlugs(key: CollectionKey): CollectionSlugIndex[] {
  return mockRegistry[key]?.slugs() ?? []
}
