import { site } from '../../config/site'

export function useAppLocaleHead() {
  const i18nHead = useLocaleHead({ seo: true })
  const appConfig = useAppConfig()
  const siteName = appConfig.brand?.name ?? site.name

  useHead(() => ({
    htmlAttrs: {
      lang: i18nHead.value.htmlAttrs?.lang,
      dir: i18nHead.value.htmlAttrs?.dir as 'ltr' | 'rtl' | 'auto' | undefined,
    },
    titleTemplate: (titleChunk) => (titleChunk ? `${titleChunk} · ${siteName}` : siteName),
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      ...(i18nHead.value.link ?? []),
    ],
    meta: [{ name: 'theme-color', content: site.themeColor }, ...(i18nHead.value.meta ?? [])],
  }))
}

export function useSiteSchemaOrg() {
  const siteConfig = useSiteConfig()
  const appConfig = useAppConfig()
  const organization = appConfig.organization

  useSchemaOrg([
    defineLocalBusiness({
      '@type': ['Organization', 'LocalBusiness'],
      name: organization.legalName,
      url: siteConfig.url,
      email: organization.email,
      telephone: organization.phone,
      address: {
        streetAddress: organization.address.street,
        addressLocality: organization.address.city,
        postalCode: organization.address.postalCode,
        addressCountry: organization.address.country,
      },
      sameAs: appConfig.social?.map((entry) => entry.url) ?? [],
    }),
  ])
}
