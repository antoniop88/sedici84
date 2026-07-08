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
  <UiContainer v-if="page" class="py-12">
    <ContentFallbackNotice :show="isFallback" />

    <header class="mb-8 space-y-3">
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="max-w-prose text-lg text-muted-foreground">
        {{ page.description }}
      </p>
    </header>

    <div class="prose prose-neutral max-w-prose">
      <ContentRenderer :value="page" />
    </div>
  </UiContainer>
</template>
