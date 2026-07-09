export type SiteLocale = {
  code: string
  language: string
  name: string
  dir: 'ltr' | 'rtl'
}

export type SiteSocialPlatform = 'github' | 'linkedin' | 'instagram' | 'x' | 'facebook'

export type SiteSocial = {
  platform: SiteSocialPlatform
  url: string
}

export type SiteOrganization = {
  legalName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
}

export type SiteNavItem = {
  labelKey: string
  to: string
  external?: boolean
}

export type SiteConfig = {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  organization: SiteOrganization
  social: SiteSocial[]
  locales: SiteLocale[]
  defaultLocale: 'it'
  navigation: SiteNavItem[]
  legalLinks: SiteNavItem[]
}

export const defaultLocale = 'it' as const

export const siteImages = {
  logo: '/images/logo/logo.png',
} as const

export const site = {
  name: 'Sedici 84',
  shortName: 'Sedici 84',
  description:
    'Abbigliamento premium e sartoria Made in Italy. Capi unici, materiali pregiati, eleganza senza tempo.',
  themeColor: '#3B332B',
  backgroundColor: '#F2EAE0',
  organization: {
    legalName: 'Sedici 84',
    email: 'info@sedici84.it',
    phone: '+39 327 236 8763',
    address: {
      street: 'Viale delle Tamerici SNC',
      city: 'Carovigno (Br)',
      postalCode: '72012',
      country: 'IT',
    },
  },
  social: [] as SiteSocial[],
  locales: [
    {
      code: 'it',
      language: 'it-IT',
      name: 'Italiano',
      dir: 'ltr',
    },
    {
      code: 'en',
      language: 'en-US',
      name: 'English',
      dir: 'ltr',
    },
  ],
  defaultLocale,
  navigation: [
    { labelKey: 'nav.home', to: '/' },
    { labelKey: 'nav.about', to: '/chi-siamo' },
    { labelKey: 'nav.collections', to: '/collezioni' },
    { labelKey: 'nav.contact', to: '/contatti' },
  ],
  legalLinks: [
    { labelKey: 'footer.privacy', to: '/privacy-policy' },
    { labelKey: 'footer.cookies', to: '/cookie-policy' },
  ],
} satisfies SiteConfig

/**
 * Site URL is environment-dependent — resolve from runtimeConfig.public.siteUrl.
 */
export function getSiteUrl(config: { public: { siteUrl: string } }): string {
  return config.public.siteUrl
}
