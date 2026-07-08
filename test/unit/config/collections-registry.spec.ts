/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  collectionsRegistry,
  getAllCollectionKeys,
  type CollectionConfig,
} from '../../../config/collections'
import { propertyItemSchema } from '../../../config/collections/schemas'

const collectionConfigSchema = z.object({
  key: z.string().min(1),
  paths: z.object({
    it: z.string().startsWith('/'),
    en: z.string().startsWith('/'),
  }),
  schema: z.custom<z.ZodType>((value) => value instanceof z.ZodType),
  schemaOrg: z.object({
    type: z.string().min(1),
    map: z.function(),
  }),
  ogImage: z.string().min(1),
  sitemap: z.object({
    changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']),
    priority: z.number().min(0).max(1),
  }),
  cacheTtl: z.number().positive(),
  mediaDomains: z.array(z.string().min(1)).min(1),
  filters: z.array(
    z.object({
      name: z.string().min(1),
      type: z.enum(['text', 'number']),
      labelKey: z.string().min(1),
    }),
  ),
  i18n: z.object({
    listTitleKey: z.string().min(1),
    listDescriptionKey: z.string().min(1),
    listMetaTitleKey: z.string().min(1),
    listMetaDescriptionKey: z.string().min(1),
    backToListKey: z.string().min(1),
    emptyKey: z.string().min(1),
    paginationKey: z.string().min(1),
    prevPageKey: z.string().min(1),
    nextPageKey: z.string().min(1),
    pageOfKey: z.string().min(1),
    applyKey: z.string().min(1),
  }),
})

describe('collections registry', () => {
  it('contains at least the immobili collection', () => {
    expect(getAllCollectionKeys()).toContain('immobili')
  })

  it('validates every registry entry against the collection config schema', () => {
    for (const key of getAllCollectionKeys()) {
      const config = collectionsRegistry[key] as CollectionConfig
      const result = collectionConfigSchema.safeParse(config)
      expect(result.success, `Collection "${key}" failed schema validation`).toBe(true)
      expect(config.key).toBe(key)
    }
  })

  it('uses propertyItemSchema for immobili', () => {
    expect(collectionsRegistry.immobili.schema).toBe(propertyItemSchema)
    expect(collectionsRegistry.immobili.cacheTtl).toBeGreaterThan(0)
    expect(collectionsRegistry.immobili.paths.en).toBe('/properties')
  })
})
