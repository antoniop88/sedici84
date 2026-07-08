import type {
  CollectionListResponse,
  CollectionSlugIndex,
} from '../../../config/collections/contract'
import type { PropertyItem } from '../../../config/collections/schemas'
import type { CollectionMockAdapter } from './adapter'

const now = new Date().toISOString()

export const mockImmobiliItems: PropertyItem[] = [
  {
    id: 'prop-001',
    slugs: { it: 'attico-brera', en: 'brera-penthouse' },
    updatedAt: '2025-06-15T10:00:00.000Z',
    title: {
      it: 'Attico di design a Brera',
      en: 'Design penthouse in Brera',
    },
    description: {
      it: 'Luminoso attico con terrazzo panoramico nel cuore del quartiere artistico.',
      en: 'Bright penthouse with panoramic terrace in the heart of the artistic district.',
    },
    images: [
      'https://picsum.photos/seed/brera-1/1200/800',
      'https://picsum.photos/seed/brera-2/1200/800',
      'https://picsum.photos/seed/brera-3/1200/800',
    ],
    price: 1_250_000,
    currency: 'EUR',
    address: {
      city: { it: 'Milano', en: 'Milan' },
      street: { it: 'Via Fiori Chiari 12', en: 'Via Fiori Chiari 12' },
      postalCode: '20121',
      country: 'IT',
    },
    rooms: 4,
    bathrooms: 2,
    sqm: 145,
    propertyType: { it: 'Attico', en: 'Penthouse' },
    features: [
      { it: 'Terrazzo', en: 'Terrace' },
      { it: 'Ascensore', en: 'Elevator' },
      { it: 'Aria condizionata', en: 'Air conditioning' },
    ],
  },
  {
    id: 'prop-002',
    slugs: { it: 'loft-navigli', en: 'navigli-loft' },
    updatedAt: '2025-06-10T14:30:00.000Z',
    title: {
      it: 'Loft industriale ai Navigli',
      en: 'Industrial loft in Navigli',
    },
    description: {
      it: 'Open space con soffitti alti e finiture contemporanee, a pochi passi dal canale.',
      en: 'Open-plan space with high ceilings and contemporary finishes, steps from the canal.',
    },
    images: [
      'https://picsum.photos/seed/navigli-1/1200/800',
      'https://picsum.photos/seed/navigli-2/1200/800',
    ],
    price: 680_000,
    currency: 'EUR',
    address: {
      city: { it: 'Milano', en: 'Milan' },
      street: { it: 'Alzaia Naviglio Grande 45', en: 'Alzaia Naviglio Grande 45' },
      postalCode: '20144',
      country: 'IT',
    },
    rooms: 2,
    bathrooms: 1,
    sqm: 95,
    propertyType: { it: 'Loft', en: 'Loft' },
    features: [
      { it: 'Doppia esposizione', en: 'Dual aspect' },
      { it: 'Cantina', en: 'Cellar' },
    ],
  },
  {
    id: 'prop-003',
    slugs: { it: 'villa-como', en: 'como-villa' },
    updatedAt: '2025-05-28T09:00:00.000Z',
    title: {
      it: 'Villa con vista lago a Como',
      en: 'Lake-view villa in Como',
    },
    description: {
      it: 'Elegante villa con giardino terrazzato e vista sul lago di Como.',
      en: 'Elegant villa with terraced garden and Lake Como views.',
    },
    images: [
      'https://picsum.photos/seed/como-1/1200/800',
      'https://picsum.photos/seed/como-2/1200/800',
    ],
    price: 2_400_000,
    currency: 'EUR',
    address: {
      city: { it: 'Como', en: 'Como' },
      street: { it: 'Via delle Torri 8', en: 'Via delle Torri 8' },
      postalCode: '22100',
      country: 'IT',
    },
    rooms: 6,
    bathrooms: 4,
    sqm: 320,
    propertyType: { it: 'Villa', en: 'Villa' },
    features: [
      { it: 'Giardino', en: 'Garden' },
      { it: 'Vista lago', en: 'Lake view' },
      { it: 'Garage', en: 'Garage' },
    ],
  },
  {
    id: 'prop-004',
    slugs: { it: 'monolocale-porta-romana' },
    updatedAt: now,
    title: {
      it: 'Monolocale ristrutturato a Porta Romana',
    },
    description: {
      it: 'Compatta soluzione abitativa ideale per investimento, completamente ristrutturata.',
    },
    images: ['https://picsum.photos/seed/porta-romana/1200/800'],
    price: 245_000,
    currency: 'EUR',
    address: {
      city: { it: 'Milano' },
      street: { it: 'Corso Lodi 78' },
      postalCode: '20135',
      country: 'IT',
    },
    rooms: 1,
    bathrooms: 1,
    sqm: 38,
    propertyType: { it: 'Monolocale' },
    features: [{ it: 'Ristrutturato' }, { it: 'Balcone' }],
  },
]

export function getMockImmobiliSlugs(): CollectionSlugIndex[] {
  return mockImmobiliItems.map((item) => ({
    id: item.id,
    slugs: item.slugs,
    updatedAt: item.updatedAt,
    primaryImage: item.images[0],
  }))
}

export function filterMockByLocale(items: PropertyItem[], locale: string): PropertyItem[] {
  if (locale !== 'en') return items
  return items.filter((item) => Boolean(item.slugs.en))
}

export function filterMockImmobili(
  items: PropertyItem[],
  filters: Record<string, string | number | boolean | undefined>,
): PropertyItem[] {
  let result = [...items]

  if (filters.city) {
    const city = String(filters.city).toLowerCase()
    result = result.filter((item) =>
      Object.values(item.address.city).some((c: string) => c.toLowerCase().includes(city)),
    )
  }

  if (filters.type) {
    const type = String(filters.type).toLowerCase()
    result = result.filter((item) =>
      Object.values(item.propertyType).some((t: string) => t.toLowerCase().includes(type)),
    )
  }

  if (filters.minPrice !== undefined) {
    const min = Number(filters.minPrice)
    result = result.filter((item) => item.price >= min)
  }

  if (filters.maxPrice !== undefined) {
    const max = Number(filters.maxPrice)
    result = result.filter((item) => item.price <= max)
  }

  return result
}

export function paginateMockList<T>(
  items: T[],
  page: number,
  pageSize: number,
): CollectionListResponse<T> {
  const total = items.length
  const start = (page - 1) * pageSize
  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
  }
}

export function findMockImmobiliBySlug(slug: string, locale: string): PropertyItem | null {
  return (
    mockImmobiliItems.find((item) => {
      if (locale === 'en') {
        return item.slugs.en === slug
      }
      return item.slugs.it === slug
    }) ?? null
  )
}

export const immobiliMockAdapter = {
  list: (filters?: Record<string, string | number | boolean | undefined>, locale = 'it') => {
    const localized = filterMockByLocale(mockImmobiliItems, locale)
    return filters ? filterMockImmobili(localized, filters) : localized
  },
  findBySlug: (slug: string, locale: string) => findMockImmobiliBySlug(slug, locale),
  slugs: () => getMockImmobiliSlugs(),
} satisfies CollectionMockAdapter
