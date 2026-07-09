<script setup lang="ts">
defineI18nRoute({
  paths: {
    it: '/chi-siamo',
    en: '/about',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-chi-siamo-${locale.value}`,
  () => queryByStem('pages', 'chi-siamo'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

usePageSeo({
  title: computed(() => page.value?.title ?? ''),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <div v-if="page">
    <ContentFallbackNotice :show="isFallback" />

    <SectionsSectionRenderer v-if="page.sections?.length" :sections="page.sections" />

    <UiContainer v-if="page.body" class="story pb-20 md:pb-28">
      <div class="prose prose-lg mx-auto max-w-4xl">
        <ContentRenderer :value="page" />
      </div>
    </UiContainer>
  </div>
</template>
