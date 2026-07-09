import { queryCollection } from '@nuxt/content/server'

type SitemapEntry = {
  loc: string
  alternatives: Array<{ hreflang: string; href: string }>
}

function landingAlternatives(stem: string, hasEn: boolean) {
  const alternatives = [
    { hreflang: 'x-default', href: `/landing/${stem}` },
    { hreflang: 'it-IT', href: `/landing/${stem}` },
  ]
  if (hasEn) {
    alternatives.push({ hreflang: 'en-US', href: `/en/landing/${stem}` })
  }
  return alternatives
}

export default defineSitemapEventHandler(async (event) => {
  const entries: SitemapEntry[] = []

  // Query both locales so the en-US alternate is only advertised when an EN document actually
  // exists. Otherwise an untranslated doc would point an en-US hreflang at a URL that only
  // renders IT content via fallback.
  const [landingIt, landingEn] = await Promise.all([
    queryCollection(event, 'landing_it').all(),
    queryCollection(event, 'landing_en').all(),
  ])

  const landingEnStems = new Set(landingEn.map((landing) => landing.stem))

  for (const landing of landingIt) {
    entries.push({
      loc: `/landing/${landing.stem}`,
      alternatives: landingAlternatives(landing.stem, landingEnStems.has(landing.stem)),
    })
  }

  return entries
})
