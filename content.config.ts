import { defineCollection, defineContentConfig } from '@nuxt/content'
import type { ZodObject, ZodRawShape } from 'zod'
import { landingSchema, legalSchema, pageSchema } from './content/schemas'

const locales = ['it', 'en'] as const

function defineLocaleCollections<T extends ZodRawShape>(
  name: string,
  sourcePath: string,
  schema: ZodObject<T>,
  type: 'page' | 'data' = 'page',
) {
  return Object.fromEntries(
    locales.map((locale) => [
      `${name}_${locale}`,
      defineCollection({
        type,
        source: {
          include: `${locale}/${sourcePath}/**`,
          prefix: '',
        },
        schema,
      }),
    ]),
  )
}

export default defineContentConfig({
  collections: {
    ...defineLocaleCollections('pages', 'pages', pageSchema),
    ...defineLocaleCollections('legal', 'legal', legalSchema),
    ...defineLocaleCollections('landing', 'landing', landingSchema),
  },
})
