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

const statItemSchema = z.object({
  value: z.string(),
  label: z.string(),
})

const heroSlideSchema = z.object({
  image: z.string(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
})

export const heroSectionSchema = z.object({
  type: z.literal('hero'),
  layout: z.enum(['split', 'full']).optional(),
  imageVariant: z.enum(['photo', 'logo']).optional(),
  eyebrow: z.string().optional(),
  title: z.string(),
  subtitle: z.string().optional(),
  cta: ctaSchema.optional(),
  image: z.string().optional(),
  images: z.array(z.string()).optional(),
  slides: z.array(heroSlideSchema).optional(),
})

export const statsSectionSchema = z.object({
  type: z.literal('stats'),
  title: z.string().optional(),
  items: z.array(statItemSchema).min(1),
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
  statsSectionSchema,
  ctaSectionSchema,
  faqSectionSchema,
  testimonialsSectionSchema,
])

export type Section = z.infer<typeof sectionSchema>
