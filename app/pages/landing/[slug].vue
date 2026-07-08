<script setup lang="ts">
definePageMeta({
  layout: 'landing',
})

defineI18nRoute({
  paths: {
    it: '/landing/[slug]',
    en: '/landing/[slug]',
  },
})

const route = useRoute()
const { locale, t } = useI18n()

const slug = computed(() => String(route.params.slug))
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `landing-${slug.value}-${locale.value}`,
  () => queryByStem('landing', slug.value),
  { watch: [locale, slug] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

usePageSeo({
  title: computed(() => page.value!.title),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <div v-if="page">
    <ContentFallbackNotice :show="isFallback" />

    <SectionsSectionRenderer v-if="page.sections?.length" :sections="page.sections" />

    <UiContainer v-if="page.body" class="py-12">
      <div class="prose prose-neutral mx-auto max-w-prose">
        <ContentRenderer :value="page" />
      </div>
    </UiContainer>
  </div>
</template>
