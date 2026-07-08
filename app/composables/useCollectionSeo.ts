import { site } from '../../config/site'
import { OG_LOCALE_MAP, toAbsoluteUrl, toOgLocale } from '~/utils/seoUrl'
import {
  getCollectionPath,
  getLocalizedValue,
  type CollectionConfig,
  type CollectionItem,
  type CollectionKey,
  type collectionsRegistry,
  type LocaleCode,
} from '../../config/collections'

export type CollectionSeoBreadcrumb = {
  name: string
  item: string
}

export type CollectionSeoOptions<K extends CollectionKey> = {
  key: K
  config: (typeof collectionsRegistry)[K]
  mode: 'list' | 'detail'
  item?: CollectionItem<K>
  title?: MaybeRefOrGetter<string>
  description?: MaybeRefOrGetter<string>
  breadcrumbs?: MaybeRefOrGetter<CollectionSeoBreadcrumb[] | undefined>
}

export function useCollectionSeo<K extends CollectionKey>(options: CollectionSeoOptions<K>) {
  const { locale, locales, t } = useI18n()
  const siteConfig = useSiteConfig()
  const requestUrl = useRequestURL()
  const appConfig = useAppConfig()
  const localePath = useLocalePath()

  const currentLocale = computed(() => locale.value as LocaleCode)

  const resolvedTitle = computed(() => {
    if (options.title) return toValue(options.title)
    if (options.mode === 'list') return t(options.config.i18n.listMetaTitleKey)
    if (options.item) return getLocalizedValue(options.item.title, currentLocale.value)
    return site.name
  })

  const resolvedDescription = computed(() => {
    if (options.description) return toValue(options.description)
    if (options.mode === 'list') return t(options.config.i18n.listMetaDescriptionKey)
    if (options.item) return getLocalizedValue(options.item.description, currentLocale.value)
    return site.description
  })

  const resolvedCover = computed(() => {
    if (!options.item || !('images' in options.item)) return undefined
    const images = options.item.images as string[] | undefined
    const cover = images?.[0]
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
    const collectionPath = getCollectionPath(options.key, currentLocale.value)

    if (options.mode === 'detail' && options.item) {
      const slug =
        (options.item.slugs as Record<LocaleCode, string | undefined>)[currentLocale.value] ??
        options.item.slugs.it ??
        ''
      return `${base}${localePath(`${collectionPath}/${slug}`)}`
    }

    return `${base}${localePath(collectionPath)}`
  })

  // Registry-driven OG image: the component name comes from config.ogImage, and any bespoke props
  // come from config.ogImageProps(item, ...) — mirroring how schemaOrg.map is registry-driven — so
  // no per-collection branch or item cast is needed here.
  const ogImageComponent = options.config.ogImage || 'OgDefault'
  const ogImagePropsFn = (options.config as CollectionConfig).ogImageProps
  const extraOgProps =
    options.item && ogImagePropsFn
      ? ogImagePropsFn(options.item, currentLocale.value, { cover: resolvedCover.value ?? '' })
      : {}

  defineOgImage(ogImageComponent as Parameters<typeof defineOgImage>[0], {
    title: () => resolvedTitle.value,
    siteName: () => appConfig.brand?.name ?? site.name,
    ...extraOgProps,
  })

  useSeoMeta({
    title: () => resolvedTitle.value,
    description: () => resolvedDescription.value,
    ogTitle: () => resolvedTitle.value,
    ogDescription: () => resolvedDescription.value,
    ogType: () => (options.mode === 'detail' ? 'article' : 'website'),
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
    if (options.mode === 'list') {
      return [
        defineWebPage({
          name: resolvedTitle.value,
          description: resolvedDescription.value,
          url: pageUrl.value,
          inLanguage: ogLocale.value,
        }),
      ]
    }

    if (!options.item) return []

    const schemaData = options.config.schemaOrg.map(
      options.item,
      currentLocale.value,
      pageUrl.value,
    )

    return [
      {
        ...schemaData,
        inLanguage: ogLocale.value,
      },
    ]
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
