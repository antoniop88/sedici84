export type CtaLink = {
  label: string
  to: string
}

export type FeatureItem = {
  title: string
  description: string
}

export type FaqItem = {
  question: string
  answer: string
}

export type TestimonialItem = {
  quote: string
  author: string
  role?: string
}

export type HeroSlide = {
  image: string
  title?: string
  subtitle?: string
}

export type HeroSection = {
  type: 'hero'
  layout?: 'split' | 'full'
  eyebrow?: string
  title: string
  subtitle?: string
  cta?: CtaLink
  image?: string
  images?: string[]
  slides?: HeroSlide[]
}

export type StatItem = {
  value: string
  label: string
}

export type StatsSection = {
  type: 'stats'
  title?: string
  items: StatItem[]
}

export type FeaturesSection = {
  type: 'features'
  title?: string
  items: FeatureItem[]
}

export type CtaSection = {
  type: 'cta'
  title: string
  description?: string
  button: CtaLink
}

export type FaqSection = {
  type: 'faq'
  title?: string
  items: FaqItem[]
}

export type TestimonialsSection = {
  type: 'testimonials'
  title?: string
  items: TestimonialItem[]
}

export type Section =
  HeroSection | FeaturesSection | StatsSection | CtaSection | FaqSection | TestimonialsSection
