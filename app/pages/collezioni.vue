<script setup lang="ts">
import type { GalleryCategory, GalleryImage } from '~/types/content'

defineI18nRoute({
  paths: {
    it: '/collezioni',
    en: '/collections',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-collezioni-${locale.value}`,
  () => queryByStem('pages', 'collezioni'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

const gallery = computed<GalleryImage[]>(
  () => (page.value?.gallery as GalleryImage[] | undefined) ?? [],
)
const categories = computed<GalleryCategory[]>(
  () => (page.value?.categories as GalleryCategory[] | undefined) ?? [],
)

usePageSeo({
  title: computed(() => page.value?.title ?? t('collections.metaTitle')),
  description: computed(() => page.value?.description ?? t('collections.metaDescription')),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <UiContainer v-if="page" class="py-12 md:py-16">
    <ContentFallbackNotice :show="isFallback" />

    <header class="mb-10 max-w-prose space-y-4">
      <p class="text-sm font-medium uppercase tracking-[0.2em] text-accent">
        {{ $t('nav.collections') }}
      </p>
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl lg:text-5xl">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="text-lg leading-relaxed text-muted-foreground">
        {{ page.description }}
      </p>
    </header>

    <GalleryGrid :images="gallery" :categories="categories" />

    <div v-if="page.body" class="prose prose-neutral mt-12 max-w-prose">
      <ContentRenderer :value="page" />
    </div>
  </UiContainer>
</template>
