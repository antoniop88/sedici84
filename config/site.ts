import type { CollectionKey } from './collections/keys'

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
  collectionKey?: CollectionKey
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

export const site = {
  name: 'Acme Studio',
  shortName: 'Acme',
  description: 'Studio creativo per brand, web e digital product.',
  themeColor: '#4a5fc1',
  backgroundColor: '#f8f9fc',
  organization: {
    legalName: 'Acme Studio S.r.l.',
    email: 'hello@example.com',
    phone: '+39 02 1234 5678',
    address: {
      street: 'Via Example 1',
      city: 'Milano',
      postalCode: '20100',
      country: 'IT',
    },
  },
  social: [
    {
      platform: 'linkedin',
      url: 'https://linkedin.com/company/example',
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/example',
    },
  ],
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
    { labelKey: 'nav.works', to: '/lavori' },
    { labelKey: 'nav.properties', to: '/immobili', collectionKey: 'immobili' },
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
