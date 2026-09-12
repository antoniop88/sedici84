<script setup lang="ts">
defineI18nRoute({
  paths: {
    it: '/servizi',
    en: '/services',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-servizi-${locale.value}`,
  () => queryByStem('pages', 'servizi'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

const heroSections = computed(() => page.value?.sections?.filter((s) => s.type === 'hero') ?? [])
const otherSections = computed(() => page.value?.sections?.filter((s) => s.type !== 'hero') ?? [])

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

    <UiContainer v-if="page.body" class="story py-16 md:py-24">
      <div class="prose prose-lg mx-auto max-w-4xl">
        <ContentRenderer :value="page" />
      </div>
    </UiContainer>

    <SectionsSectionRenderer v-if="otherSections.length" :sections="otherSections" />
  </div>
</template>
