/** Shared SEO URL/locale helpers — single source of truth for usePageSeo and useCollectionSeo. */

export const OG_LOCALE_MAP: Record<string, string> = {
  it: 'it_IT',
  en: 'en_US',
}

export function toOgLocale(language: string): string {
  return language.replace('-', '_')
}

export function toAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl
  }
  const base = siteUrl.replace(/\/$/, '')
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${base}${path}`
}
