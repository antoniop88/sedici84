import type {
  ApiCollectionListResponseOf,
  ApiCollectionSlugIndex,
  ApiLocaleCode,
  ApiLocalizedString,
} from './openapi-types'

export type LocaleCode = ApiLocaleCode
export type LocalizedString = ApiLocalizedString
export type CollectionSlugIndex = ApiCollectionSlugIndex
export type CollectionListResponse<T> = ApiCollectionListResponseOf<T>

export type LocalePaths = {
  it: string
  en: string
}

export type CollectionListQuery = {
  locale: LocaleCode
  page?: number
  pageSize?: number
  filters?: Record<string, string | number | boolean | undefined>
}

export type CollectionApiPaths = {
  list: (key: string) => string
  item: (key: string, slug: string) => string
  slugs: (key: string) => string
}

export const collectionApiPaths: CollectionApiPaths = {
  list: (key) => `/collections/${key}`,
  item: (key, slug) => `/collections/${key}/${slug}`,
  slugs: (key) => `/collections/${key}/slugs`,
}

export function getPathForLocale(paths: LocalePaths, locale: LocaleCode): string {
  return locale === 'en' ? paths.en : paths.it
}

export function getLocalizedValue(
  value: LocalizedString | undefined,
  locale: LocaleCode,
  fallbackLocale: LocaleCode = 'it',
): string {
  if (!value) return ''
  if (locale === 'en') return value.en ?? value.it ?? ''
  if (locale === 'it') return value.it ?? ''
  return fallbackLocale === 'en' ? (value.en ?? value.it ?? '') : (value.it ?? '')
}
