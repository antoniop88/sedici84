import { z } from 'zod'

const ctaSchema = z.object({
  label: z.string(),
  to: z.string(),
})

const featureItemSchema = z.object({
  title: z.string(),
  description: z.string(),
})

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
})

const testimonialItemSchema = z.object({
  quote: z.string(),
  author: z.string(),
  role: z.string().optional(),
})

export const heroSectionSchema = z.object({
  type: z.literal('hero'),
  title: z.string(),
  subtitle: z.string().optional(),
  cta: ctaSchema.optional(),
  image: z.string().optional(),
})

export const featuresSectionSchema = z.object({
  type: z.literal('features'),
  title: z.string().optional(),
  items: z.array(featureItemSchema).min(1),
})

export const ctaSectionSchema = z.object({
  type: z.literal('cta'),
  title: z.string(),
  description: z.string().optional(),
  button: ctaSchema,
})

export const faqSectionSchema = z.object({
  type: z.literal('faq'),
  title: z.string().optional(),
  items: z.array(faqItemSchema).min(1),
})

export const testimonialsSectionSchema = z.object({
  type: z.literal('testimonials'),
  title: z.string().optional(),
  items: z.array(testimonialItemSchema).min(1),
})

export const sectionSchema = z.discriminatedUnion('type', [
  heroSectionSchema,
  featuresSectionSchema,
  ctaSectionSchema,
  faqSectionSchema,
  testimonialsSectionSchema,
])

export type Section = z.infer<typeof sectionSchema>
