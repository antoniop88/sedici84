<script setup lang="ts">
import type { GalleryCategory, GalleryImage } from '~/types/content'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-home-${locale.value}`,
  () => queryByStem('pages', 'home'),
  { watch: [locale] },
)

const { data: collezioniResult } = await useAsyncData(
  () => `home-collezioni-${locale.value}`,
  () => queryByStem('pages', 'collezioni'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

// Render the hero first, then the editorial intro (page body), then the rest.
const heroSections = computed(() => page.value?.sections?.filter((s) => s.type === 'hero') ?? [])
const otherSections = computed(() => page.value?.sections?.filter((s) => s.type !== 'hero') ?? [])

// One representative card per collection category, linking to the gallery.
const collectionPreviews = computed(() => {
  const doc = collezioniResult.value?.data
  const categories = (doc?.categories as GalleryCategory[] | undefined) ?? []
  const gallery = (doc?.gallery as GalleryImage[] | undefined) ?? []
  return categories
    .filter((category) => category.key !== 'all' && category.key !== 'sartoria')
    .map((category) => ({
      ...category,
      image: gallery.find((image) => image.category === category.key)?.src,
    }))
    .filter((preview) => Boolean(preview.image))
})

usePageSeo({
  title: computed(() => page.value?.title ?? ''),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <div v-if="page">
    <ContentFallbackNotice :show="isFallback" />

    <SectionsSectionRenderer v-if="heroSections.length" :sections="heroSections" />

    <section v-if="page.body" class="py-20 md:py-28">
      <UiContainer>
        <div class="mx-auto max-w-3xl text-center">
          <p class="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-accent">
            {{ $t('home.introEyebrow') }}
          </p>
          <div
            class="[&_p]:font-display [&_p]:text-2xl [&_p]:leading-relaxed [&_p]:text-foreground md:[&_p]:text-[1.7rem]"
          >
            <ContentRenderer :value="page" />
          </div>
        </div>
      </UiContainer>
    </section>

    <SectionsSectionRenderer v-if="otherSections.length" :sections="otherSections" />

    <section
      v-if="collectionPreviews.length"
      class="border-y border-neutral-200 bg-white py-16 md:py-20"
      aria-labelledby="featured-collections-title"
    >
      <UiContainer>
        <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div class="space-y-3">
            <p class="text-sm font-medium uppercase tracking-[0.2em] text-accent">
              {{ $t('nav.collections') }}
            </p>
            <h2
              id="featured-collections-title"
              class="font-display text-2xl leading-tight text-foreground md:text-3xl"
            >
              {{ $t('collections.featuredTitle') }}
            </h2>
          </div>
          <UiLink :to="localePath('/collezioni')">{{ $t('collections.viewAll') }}</UiLink>
        </div>
        <ul class="grid gap-8 sm:grid-cols-2" role="list">
          <li v-for="preview in collectionPreviews" :key="preview.key">
            <NuxtLink
              :to="localePath('/collezioni')"
              class="group block overflow-hidden rounded-lg border border-neutral-200 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                :src="preview.image"
                :alt="preview.label"
                loading="lazy"
                decoding="async"
                class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <div class="flex items-center justify-between p-5">
                <h3 class="font-display text-lg font-semibold text-foreground">
                  {{ preview.label }}
                </h3>
                <span
                  class="text-accent transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>
      </UiContainer>
    </section>
  </div>
</template>
