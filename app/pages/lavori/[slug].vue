<script setup lang="ts">
import { IMAGE_SIZES } from '~/utils/imageSizes'

defineI18nRoute({
  paths: {
    it: '/lavori/[slug]',
    en: '/works/[slug]',
  },
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const { queryByStem } = useContentLocale()

const slug = computed(() => String(route.params.slug))

const { data: pageResult } = await useAsyncData(
  () => `project-${slug.value}-${locale.value}`,
  () => queryByStem('projects', slug.value),
  { watch: [locale, slug] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

usePageSeo({
  title: computed(() => page.value!.title),
  description: computed(() => page.value!.description),
  ogImage: 'project',
  projectCover: computed(() => page.value!.cover),
  schemaType: 'CreativeWork',
  datePublished: computed(() => page.value!.date),
  image: computed(() => page.value!.cover),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
  breadcrumbs: computed(() => [
    { name: t('nav.home'), item: localePath('/') },
    { name: t('works.title'), item: localePath('/lavori') },
    { name: page.value!.title, item: localePath(`/lavori/${slug.value}`) },
  ]),
})
</script>

<template>
  <UiContainer v-if="page" class="py-12">
    <ContentFallbackNotice :show="isFallback" />

    <nav class="mb-6">
      <UiLink :to="localePath('/lavori')">{{ $t('works.backToList') }}</UiLink>
    </nav>

    <header class="mb-8 space-y-4">
      <NuxtPicture
        :src="page.cover"
        :alt="page.title"
        :sizes="IMAGE_SIZES.coverDetail"
        format="avif,webp"
        width="896"
        height="504"
        priority
        preload
        loading="eager"
        decoding="async"
        class="aspect-[16/9] w-full max-w-4xl rounded-xl object-cover"
      />
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ page.title }}
      </h1>
      <p class="max-w-prose text-lg text-muted-foreground">{{ page.description }}</p>
      <dl class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div v-if="page.client">
          <dt class="inline font-medium text-foreground">{{ $t('works.client') }}:</dt>
          <dd class="inline ml-1">{{ page.client }}</dd>
        </div>
        <div v-if="page.date">
          <dt class="inline font-medium text-foreground">{{ $t('works.date') }}:</dt>
          <dd class="inline ml-1">
            <time :datetime="String(page.date)">{{
              new Date(page.date).toLocaleDateString(locale)
            }}</time>
          </dd>
        </div>
      </dl>
      <ul v-if="page.tags?.length" class="flex flex-wrap gap-2" role="list">
        <li
          v-for="tag in page.tags"
          :key="tag"
          class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {{ tag }}
        </li>
      </ul>
    </header>

    <div class="prose prose-neutral max-w-prose">
      <ContentRenderer :value="page" />
    </div>
  </UiContainer>
</template>
