import { z } from 'zod'
import {
  defineOgImageSchema,
  defineRobotsSchema,
  defineSchemaOrgSchema,
  defineSitemapSchema,
} from '@nuxtjs/seo/content'
import { sectionSchema } from './sections'

const seoFields = {
  robots: defineRobotsSchema(),
  ogImage: defineOgImageSchema(),
  schemaOrg: defineSchemaOrgSchema(),
  sitemap: defineSitemapSchema(),
}

const galleryCategorySchema = z.object({
  key: z.string(),
  label: z.string(),
})

const galleryImageSchema = z.object({
  src: z.string(),
  alt: z.string(),
  category: z.string().optional(),
})

export const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.literal('page').default('page'),
  sections: z.array(sectionSchema).optional(),
  categories: z.array(galleryCategorySchema).optional(),
  gallery: z.array(galleryImageSchema).optional(),
  ...seoFields,
})

export const legalSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  legalDraft: z.boolean().default(true),
  ...seoFields,
})

export const landingSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  sections: z.array(sectionSchema).min(1),
  ...seoFields,
})
