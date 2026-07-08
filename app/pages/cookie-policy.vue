<script setup lang="ts">
defineI18nRoute({
  paths: {
    it: '/cookie-policy',
    en: '/cookie-policy',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-cookie-${locale.value}`,
  () => queryByStem('legal', 'cookie-policy'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

// Unreviewed legal drafts must not be indexed.
if (page.value?.legalDraft) {
  useRobotsRule({ noindex: true, nofollow: true })
  useSeoMeta({ robots: 'noindex, nofollow' })
}

usePageSeo({
  title: computed(() => page.value?.title ?? ''),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <UiContainer v-if="page" class="py-12">
    <ContentFallbackNotice :show="isFallback" />

    <header class="mb-8">
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ page.title }}
      </h1>
    </header>

    <div class="prose prose-neutral max-w-prose">
      <ContentRenderer :value="page" />
    </div>
  </UiContainer>
</template>
