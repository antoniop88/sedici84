import type { CollectionMockAdapter } from './adapter'
import { immobiliMockAdapter } from './immobili'

/**
 * Mock adapters keyed by collection key. Adding a collection's dev mock is a single entry here —
 * the dispatch layer (server/utils/collections-mock-data.ts) and the dev BFF routes read from this.
 */
export const mockRegistry: Record<string, CollectionMockAdapter> = {
  immobili: immobiliMockAdapter,
}
