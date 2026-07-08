import { site } from '../../config/site'
import { OG_LOCALE_MAP, toAbsoluteUrl, toOgLocale } from '~/utils/seoUrl'

export type PageSeoBreadcrumb = {
  name: string
  item: string
}

export type PageSeoOptions = {
  title: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string | undefined>
  ogType?: 'website' | 'article'
  ogImage?: 'default' | 'project'
  projectCover?: MaybeRefOrGetter<string | undefined>
  breadcrumbs?: MaybeRefOrGetter<PageSeoBreadcrumb[] | undefined>
  schemaType?: 'WebPage' | 'CreativeWork' | 'Article'
  schemaExtra?: MaybeRefOrGetter<Record<string, unknown> | undefined>
  schemaOrgFrontmatter?: MaybeRefOrGetter<
    Record<string, unknown> | Record<string, unknown>[] | undefined
  >
  datePublished?: MaybeRefOrGetter<string | Date | undefined>
  image?: MaybeRefOrGetter<string | undefined>
}

function normalizeSchemaOrg(input: unknown): object[] {
  if (!input) return []
  return Array.isArray(input) ? (input as object[]) : [input as object]
}

export function usePageSeo(options: PageSeoOptions) {
  const { locale, locales } = useI18n()
  const siteConfig = useSiteConfig()
  const requestUrl = useRequestURL()
  const appConfig = useAppConfig()

  const resolvedTitle = computed(() => toValue(options.title))
  const resolvedDescription = computed(() => toValue(options.description) ?? site.description)
  const resolvedCover = computed(() => {
    const cover = toValue(options.projectCover)
    if (!cover) return undefined
    return toAbsoluteUrl(cover, siteConfig.url)
  })

  const ogLocale = computed(() => {
    const current = locales.value.find((entry) => entry.code === locale.value)
    return current?.language
      ? toOgLocale(current.language)
      : (OG_LOCALE_MAP[locale.value] ?? 'it_IT')
  })

  const ogLocaleAlternate = computed(() =>
    locales.value
      .filter((entry) => entry.code !== locale.value)
      .map((entry) => toOgLocale(entry.language ?? entry.code)),
  )

  const pageUrl = computed(() => {
    const base = siteConfig.url?.replace(/\/$/, '') ?? requestUrl.origin
    return `${base}${requestUrl.pathname}`
  })

  if (options.ogImage === 'project') {
    defineOgImage('OgProject', {
      title: () => resolvedTitle.value,
      cover: () => resolvedCover.value ?? '',
      siteName: () => appConfig.brand?.name ?? site.name,
    })
  } else {
    defineOgImage('OgDefault', {
      title: () => resolvedTitle.value,
      siteName: () => appConfig.brand?.name ?? site.name,
    })
  }

  useSeoMeta({
    title: () => resolvedTitle.value,
    description: () => resolvedDescription.value,
    ogTitle: () => resolvedTitle.value,
    ogDescription: () => resolvedDescription.value,
    ogType: () => options.ogType ?? 'website',
    ogUrl: () => pageUrl.value,
    ogLocale: () => ogLocale.value,
    ogLocaleAlternate: () => ogLocaleAlternate.value,
    ogSiteName: () => appConfig.brand?.name ?? site.name,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolvedTitle.value,
    twitterDescription: () => resolvedDescription.value,
  })

  const schemaNodes = computed(() => {
    const inLanguage = ogLocale.value
    const url = pageUrl.value
    const name = resolvedTitle.value
    const description = resolvedDescription.value
    const schemaType = options.schemaType ?? 'WebPage'
    const extra = toValue(options.schemaExtra) ?? {}
    const frontmatter = normalizeSchemaOrg(toValue(options.schemaOrgFrontmatter))

    const pageNode =
      schemaType === 'CreativeWork'
        ? {
            '@type': 'CreativeWork',
            '@id': `${url}#creativework`,
            name,
            description,
            url,
            inLanguage,
            image: toValue(options.image) ?? resolvedCover.value,
            datePublished: toValue(options.datePublished),
            ...extra,
          }
        : schemaType === 'Article'
          ? defineArticle({
              headline: name,
              description,
              url,
              inLanguage,
              image: toValue(options.image) ?? resolvedCover.value,
              datePublished: toValue(options.datePublished),
              ...extra,
            })
          : defineWebPage({
              name,
              description,
              url,
              inLanguage,
              ...extra,
            })

    return frontmatter.length ? [...frontmatter, pageNode] : [pageNode]
  })

  useSchemaOrg(schemaNodes)

  const breadcrumbItems = computed(() => toValue(options.breadcrumbs) ?? [])
  if (options.breadcrumbs) {
    useBreadcrumbItems({
      overrides: computed(() =>
        breadcrumbItems.value.map((crumb, index, items) => ({
          label: crumb.name,
          to: toAbsoluteUrl(crumb.item, siteConfig.url),
          current: index === items.length - 1,
        })),
      ),
    })
  }
}
