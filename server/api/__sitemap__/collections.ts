import {
  defaultLocaleCode,
  getAllCollectionKeys,
  getCollectionConfig,
  getPathForLocale,
  type CollectionKey,
} from '../../../config/collections'
import { fetchSlugs } from '../../utils/collections'

type SitemapChangefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'

type SitemapEntry = {
  loc: string
  lastmod?: string
  changefreq?: SitemapChangefreq
  priority?: 0 | 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1
  images?: Array<{ loc: string }>
  alternatives: Array<{ hreflang: string; href: string }>
}

function buildAlternatives(key: CollectionKey, slugs: { it?: string; en?: string }) {
  const config = getCollectionConfig(key)
  const alternatives: Array<{ hreflang: string; href: string }> = []

  if (slugs.it) {
    alternatives.push({
      hreflang: 'x-default',
      href: `${config.paths.it}/${slugs.it}`,
    })
    alternatives.push({
      hreflang: 'it-IT',
      href: `${config.paths.it}/${slugs.it}`,
    })
  }

  if (slugs.en) {
    alternatives.push({
      hreflang: 'en-US',
      href: `/en${config.paths.en}/${slugs.en}`,
    })
  }

  return alternatives
}

export default defineSitemapEventHandler(async (event) => {
  const entries: SitemapEntry[] = []
  const siteConfig = useRuntimeConfig(event)
  const siteUrl = siteConfig.public.siteUrl?.replace(/\/$/, '') ?? ''

  for (const key of getAllCollectionKeys()) {
    const config = getCollectionConfig(key)
    const slugIndex = await fetchSlugs(key, event)

    for (const entry of slugIndex) {
      const itSlug = entry.slugs.it
      if (!itSlug) continue

      const loc = `${getPathForLocale(config.paths, defaultLocaleCode)}/${itSlug}`
      const alternatives = buildAlternatives(key, entry.slugs)

      const images = entry.primaryImage
        ? [
            {
              loc: entry.primaryImage.startsWith('http')
                ? entry.primaryImage
                : `${siteUrl}${entry.primaryImage}`,
            },
          ]
        : undefined

      entries.push({
        loc,
        lastmod: entry.updatedAt,
        changefreq: config.sitemap.changefreq,
        priority: config.sitemap.priority as SitemapEntry['priority'],
        alternatives,
        images,
      })

      const enSlug = entry.slugs.en
      if (enSlug) {
        entries.push({
          loc: `/en${getPathForLocale(config.paths, 'en')}/${enSlug}`,
          lastmod: entry.updatedAt,
          changefreq: config.sitemap.changefreq,
          priority: config.sitemap.priority as SitemapEntry['priority'],
          alternatives,
          images,
        })
      }
    }
  }

  return entries
})
