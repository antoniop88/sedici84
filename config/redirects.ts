import type { NitroRouteConfig } from 'nitropack/types'

/**
 * Redirect legacy — aggiungere qui per ogni nuovo cliente.
 *
 * Esempi:
 *   '/vecchia-pagina': { redirect: { to: '/nuova-pagina', statusCode: 301 } },
 *   '/en/about-us': { redirect: { to: '/en/about', statusCode: 301 } },
 */
export const legacyRedirects = {
  // '/about-us': { redirect: { to: '/chi-siamo', statusCode: 301 } },
  // '/en/about-us': { redirect: { to: '/en/about', statusCode: 301 } },
} satisfies Record<string, NitroRouteConfig>
