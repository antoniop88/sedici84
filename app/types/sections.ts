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

export type HeroSection = {
  type: 'hero'
  layout?: 'split' | 'full'
  imageVariant?: 'photo' | 'logo'
  eyebrow?: string
  title: string
  subtitle?: string
  cta?: CtaLink
  image?: string
  images?: string[]
}

export type StatItem = {
  value: string
  label: string
}

export type StatsSection = {
  type: 'stats'
  title?: string
  image?: string
  items: StatItem[]
}

export type FeaturesSection = {
  type: 'features'
  title?: string
  image?: string
  items: FeatureItem[]
}

export type CtaSection = {
  type: 'cta'
  title: string
  description?: string
  image?: string
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
