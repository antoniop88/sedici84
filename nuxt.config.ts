import tailwindcss from '@tailwindcss/vite'
import { legacyRedirects } from './config/redirects'
import { site } from './config/site'
import { validateEnv } from './server/utils/env'

validateEnv()

const publicEnv = process.env.NUXT_PUBLIC_ENV ?? 'development'
const isProduction = publicEnv === 'production'

const umamiHost = process.env.NUXT_PUBLIC_UMAMI_HOST ?? ''
const umamiOrigin = umamiHost ? new URL(umamiHost).origin : null

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-07-01',
  nitro: {
    preset: process.env.NITRO_PRESET || 'node-server',
  },
  ssr: true,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/i18n',
    '@nuxt/content',
    'nuxt-security',
    '@nuxt/scripts',
  ],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL,
    name: process.env.NUXT_PUBLIC_SITE_NAME ?? site.name,
    description: site.description,
    defaultLocale: site.defaultLocale,
    trailingSlash: false,
    env: publicEnv,
  },
  seo: {
    redirectToCanonicalSiteUrl: isProduction,
  },
  image: {
    quality: 80,
    format: ['webp'],
    densities: [1, 2],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    domains: ['picsum.photos'],
  },
  robots: {
    disallow: ['/i18n-test', '/ui-preview', '/api/**'],
  },
  sitemap: {
    sources: ['/api/__sitemap__/content'],
    exclude: ['/i18n-test', '/ui-preview'],
  },
  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
    },
    fonts: ['Inter:400', 'Inter:600', 'Fraunces:600'],
  },
  i18n: {
    defaultLocale: site.defaultLocale,
    strategy: 'prefix_except_default',
    langDir: 'locales',
    locales: site.locales.map((locale) => ({
      code: locale.code,
      language: locale.language,
      name: locale.name,
      dir: locale.dir,
      file: `${locale.code}.json`,
    })),
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      preload: false,
    },
    families: [
      { name: 'Fraunces', provider: 'google', preload: true },
      { name: 'Inter', provider: 'google' },
    ],
  },
  security: {
    nonce: true,
    headers: {
      referrerPolicy: 'strict-origin-when-cross-origin',
      xContentTypeOptions: 'nosniff',
      xFrameOptions: 'SAMEORIGIN',
      strictTransportSecurity: isProduction
        ? { maxAge: 63_072_000, includeSubdomains: true }
        : false,
      permissionsPolicy: {
        camera: [],
        microphone: [],
        geolocation: [],
        payment: [],
        usb: [],
        bluetooth: [],
        magnetometer: [],
        gyroscope: [],
        accelerometer: [],
        'display-capture': [],
        fullscreen: [],
        'browsing-topics': [],
      },
      contentSecurityPolicy: {
        'base-uri': ["'none'"],
        'font-src': ["'self'", 'data:'],
        'form-action': ["'self'"],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:', 'https://picsum.photos', 'https://fastly.picsum.photos'],
        'object-src': ["'none'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'script-src': [
          "'self'",
          "'strict-dynamic'",
          "'nonce-{{nonce}}'",
          "'wasm-unsafe-eval'",
          ...(umamiOrigin ? [umamiOrigin] : []),
        ],
        'connect-src': ["'self'", ...(umamiOrigin ? [umamiOrigin] : [])],
        'upgrade-insecure-requests': isProduction,
      },
    },
    rateLimiter: {
      tokensPerInterval: 150,
      interval: 300_000,
      headers: false,
      throwError: true,
    },
  },
  routeRules: {
    ...legacyRedirects,
    '/_nuxt/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/_ipx/**': {
      headers: { 'cache-control': 'public, max-age=31536000, immutable' },
    },
    '/favicon.ico': {
      headers: { 'cache-control': 'public, max-age=604800' },
    },
    '/api/**': {
      headers: { 'cache-control': 'private, no-cache' },
      security: {
        rateLimiter: {
          tokensPerInterval: 60,
          interval: 60_000,
        },
      },
    },
    '/**': {
      headers: { 'cache-control': 'private, no-cache' },
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? '',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME ?? site.name,
      env: publicEnv,
      defaultLocale: site.defaultLocale,
      umamiHost: process.env.NUXT_PUBLIC_UMAMI_HOST ?? '',
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID ?? '',
      i18n: {
        baseUrl: process.env.NUXT_PUBLIC_SITE_URL ?? '',
      },
    },
  },
})
