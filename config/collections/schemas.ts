import { z } from 'zod'
import type { ApiPropertyItem } from './openapi-types'

export const localizedStringSchema = z.object({
  it: z.string(),
  en: z.string().optional(),
})

export const propertyItemSchema = z.object({
  id: z.string(),
  slugs: z.object({
    it: z.string(),
    en: z.string().optional(),
  }),
  updatedAt: z.string(),
  title: localizedStringSchema,
  description: localizedStringSchema,
  images: z.array(z.string()).min(1),
  price: z.number(),
  currency: z.string(),
  address: z.object({
    city: localizedStringSchema,
    street: localizedStringSchema.optional(),
    postalCode: z.string().optional(),
    country: z.string(),
  }),
  rooms: z.number().optional(),
  bathrooms: z.number().optional(),
  sqm: z.number().optional(),
  propertyType: localizedStringSchema,
  features: z.array(localizedStringSchema).optional(),
}) satisfies z.ZodType<ApiPropertyItem>

export type PropertyItem = ApiPropertyItem

// Esempio estensione blog — decommentare insieme alla voce nel registry
// export const blogItemSchema = z.object({
//   id: z.string(),
//   slugs: z.object({
//     it: z.string(),
//     en: z.string().optional(),
//   }),
//   updatedAt: z.string(),
//   title: localizedStringSchema,
//   description: localizedStringSchema,
//   body: localizedStringSchema,
//   images: z.array(z.string()).optional(),
//   author: localizedStringSchema,
//   publishedAt: z.string(),
// })
// export type BlogItem = z.infer<typeof blogItemSchema>
