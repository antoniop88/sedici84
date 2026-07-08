import type { z } from 'zod'
import type { CollectionKey } from './collections/keys'
import type { LocaleCode, LocalePaths } from './collections/contract'
import { getLocalizedValue, getPathForLocale } from './collections/contract'
import { propertyItemSchema, type PropertyItem } from './collections/schemas'
import { site } from './site'

export type { CollectionKey } from './collections/keys'

export type {
  LocaleCode,
  LocalizedString,
  LocalePaths,
  CollectionSlugIndex,
  CollectionListResponse,
} from './collections/contract'
export type {
  ApiLocalizedString,
  ApiPropertyItem,
  ApiCollectionSlugIndex,
  ApiCollectionListResponse,
  ApiCollectionListResponseOf,
  ApiLocaleCode,
} from './collections/openapi-types'
export { getLocalizedValue, getPathForLocale, collectionApiPaths } from './collections/contract'
export { propertyItemSchema, type PropertyItem } from './collections/schemas'

type SitemapChangefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

export type CollectionSchemaOrgConfig<T> = {
  type: string
  map: (item: T, locale: LocaleCode, url: string) => Record<string, unknown>
}

/** A registry-driven filter control rendered on the generic collection list page. */
export type CollectionFilter = {
  name: string
  type: 'text' | 'number'
  labelKey: string
}

export type CollectionOgImageContext = {
  cover: string
}

export type CollectionConfig<TSchema extends z.ZodType = z.ZodType> = {
  key: string
  paths: LocalePaths
  schema: TSchema
  schemaOrg: CollectionSchemaOrgConfig<z.infer<TSchema>>
  ogImage: string
  /** Extra props for the OG image component, keyed on the item — mirrors schemaOrg.map. */
  ogImageProps?: (
    item: z.infer<TSchema>,
    locale: LocaleCode,
    context: CollectionOgImageContext,
  ) => Record<string, unknown>
  sitemap: {
    changefreq: SitemapChangefreq
    priority: number
  }
  cacheTtl: number
  mediaDomains: string[]
  filters: CollectionFilter[]
  i18n: {
    listTitleKey: string
    listDescriptionKey: string
    listMetaTitleKey: string
    listMetaDescriptionKey: string
    backToListKey: string
    emptyKey: string
    paginationKey: string
    prevPageKey: string
    nextPageKey: string
    pageOfKey: string
    applyKey: string
  }
  listComponent?: string
  detailComponent?: string
}

function mapPropertySchemaOrg(item: PropertyItem, locale: LocaleCode, url: string) {
  const title = getLocalizedValue(item.title, locale)
  const description = getLocalizedValue(item.description, locale)
  const city = getLocalizedValue(item.address.city, locale)

  return {
    '@type': 'RealEstateListing',
    '@id': `${url}#listing`,
    name: title,
    description,
    url,
    image: item.images,
    dateModified: item.updatedAt,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressCountry: item.address.country,
      ...(item.address.postalCode ? { postalCode: item.address.postalCode } : {}),
      ...(item.address.street
        ? { streetAddress: getLocalizedValue(item.address.street, locale) }
        : {}),
    },
    ...(item.rooms ? { numberOfRooms: item.rooms } : {}),
    ...(item.sqm
      ? {
          floorSize: {
            '@type': 'QuantitativeValue',
            value: item.sqm,
            unitCode: 'MTK',
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      price: item.price,
      priceCurrency: item.currency,
      availability: 'https://schema.org/InStock',
    },
  }
}

const immobiliConfig = {
  key: 'immobili',
  paths: {
    it: '/immobili',
    en: '/properties',
  },
  schema: propertyItemSchema,
  schemaOrg: {
    type: 'RealEstateListing',
    map: mapPropertySchemaOrg,
  },
  ogImage: 'OgProperty',
  ogImageProps: (item, locale, context) => ({
    cover: context.cover,
    price: item.price,
    currency: item.currency,
    propertyType: getLocalizedValue(item.propertyType, locale),
  }),
  sitemap: {
    changefreq: 'weekly',
    priority: 0.8,
  },
  cacheTtl: 300,
  mediaDomains: ['picsum.photos', 'fastly.picsum.photos'],
  filters: [
    { name: 'city', type: 'text', labelKey: 'properties.filters.city' },
    { name: 'type', type: 'text', labelKey: 'properties.filters.type' },
    { name: 'minPrice', type: 'number', labelKey: 'properties.filters.minPrice' },
    { name: 'maxPrice', type: 'number', labelKey: 'properties.filters.maxPrice' },
  ],
  i18n: {
    listTitleKey: 'properties.title',
    listDescriptionKey: 'properties.lead',
    listMetaTitleKey: 'properties.metaTitle',
    listMetaDescriptionKey: 'properties.metaDescription',
    backToListKey: 'properties.backToList',
    emptyKey: 'properties.empty',
    paginationKey: 'properties.pagination',
    prevPageKey: 'properties.prevPage',
    nextPageKey: 'properties.nextPage',
    pageOfKey: 'properties.pageOf',
    applyKey: 'properties.filters.apply',
  },
  listComponent: 'PropertyCard',
  detailComponent: 'PropertyDetail',
} satisfies CollectionConfig<typeof propertyItemSchema>

// Esempio estensione blog — decommentare per testare estensibilità senza toccare il motore
// import { blogItemSchema, type BlogItem } from './collections/schemas'
//
// const blogConfig = {
//   key: 'blog',
//   paths: { it: '/blog', en: '/blog' },
//   schema: blogItemSchema,
//   schemaOrg: {
//     type: 'BlogPosting',
//     map: (item: BlogItem, locale: LocaleCode, url: string) => ({
//       '@type': 'BlogPosting',
//       '@id': `${url}#article`,
//       headline: getLocalizedValue(item.title, locale),
//       description: getLocalizedValue(item.description, locale),
//       url,
//       image: item.images?.[0],
//       datePublished: item.publishedAt,
//       dateModified: item.updatedAt,
//       author: { '@type': 'Person', name: getLocalizedValue(item.author, locale) },
//     }),
//   },
//   ogImage: 'OgDefault',
//   sitemap: { changefreq: 'weekly', priority: 0.7 },
//   cacheTtl: 300,
//   mediaDomains: ['picsum.photos'],
//   filters: ['tag'],
//   i18n: {
//     listTitleKey: 'blog.metaTitle',
//     listDescriptionKey: 'blog.metaDescription',
//     backToListKey: 'blog.backToList',
//   },
// } satisfies CollectionConfig<typeof blogItemSchema>

export const collectionsRegistry = {
  immobili: immobiliConfig,
  // blog: blogConfig,
} as const

// Compile-time guard: every declared CollectionKey (config/collections/keys.ts) must be registered.
// Using Record<CollectionKey, unknown> avoids the function-parameter variance issues that a full
// `satisfies Record<CollectionKey, CollectionConfig>` would trigger on schemaOrg.map.
const _registryIsComplete: Record<CollectionKey, unknown> = collectionsRegistry
void _registryIsComplete

export type CollectionItem<K extends CollectionKey> = z.infer<
  (typeof collectionsRegistry)[K]['schema']
>

export function isCollectionKey(key: string): key is CollectionKey {
  return key in collectionsRegistry
}

export function getCollectionConfig<K extends CollectionKey>(key: K) {
  return collectionsRegistry[key]
}

export function resolveCollectionKey(segment: string, locale: LocaleCode): CollectionKey | null {
  for (const [key, config] of Object.entries(collectionsRegistry)) {
    const path = getPathForLocale(config.paths, locale)
    const normalized = path.replace(/^\//, '')
    if (normalized === segment) {
      return key as CollectionKey
    }
  }
  return null
}

export function getCollectionPath(key: CollectionKey, locale: LocaleCode): string {
  return getPathForLocale(collectionsRegistry[key].paths, locale)
}

export function getCollectionSegment(key: CollectionKey, locale: LocaleCode): string {
  return getCollectionPath(key, locale).replace(/^\//, '')
}

/** Find the collection whose URL segment (in ANY locale) equals `segment`, or null. */
export function findCollectionKeyBySegment(segment: string): CollectionKey | null {
  for (const key of getAllCollectionKeys()) {
    for (const loc of localeCodes) {
      if (getCollectionSegment(key, loc) === segment) return key
    }
  }
  return null
}

export function getAllMediaDomains(): string[] {
  const domains = new Set<string>()
  for (const config of Object.values(collectionsRegistry)) {
    for (const domain of config.mediaDomains) {
      domains.add(domain)
    }
  }
  return [...domains]
}

export function getAllCollectionKeys(): CollectionKey[] {
  return Object.keys(collectionsRegistry) as CollectionKey[]
}

export const localeCodes = site.locales.map((l) => l.code) as LocaleCode[]

export const defaultLocaleCode = site.defaultLocale as LocaleCode

export function isLocaleCode(value: string): value is LocaleCode {
  return (localeCodes as string[]).includes(value)
}
