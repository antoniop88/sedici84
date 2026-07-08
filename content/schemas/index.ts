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

export const pageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.literal('page').default('page'),
  sections: z.array(sectionSchema).optional(),
  ...seoFields,
})

export const projectSchema = z.object({
  title: z.string(),
  description: z.string(),
  cover: z.string(),
  date: z.coerce.date(),
  client: z.string().optional(),
  tags: z.array(z.string()).default([]),
  order: z.number().default(0),
  featured: z.boolean().optional(),
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
