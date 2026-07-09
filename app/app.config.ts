import { site, siteImages } from '../config/site'

export default defineAppConfig({
  brand: {
    name: site.name,
    shortName: site.shortName,
    logo: siteImages.logo,
  },
  theme: {
    colors: {
      primary: 'var(--color-primary)',
      secondary: 'var(--color-secondary)',
      accent: 'var(--color-accent)',
      background: 'var(--color-background)',
      foreground: 'var(--color-foreground)',
    },
  },
  organization: site.organization,
  social: site.social,
  locales: site.locales,
  defaultLocale: site.defaultLocale,
  navigation: site.navigation,
  legalLinks: site.legalLinks,
})
