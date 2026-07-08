<script setup lang="ts">
import { getFeaturedProjects } from '~/types/content'
import { IMAGE_SIZES } from '~/utils/imageSizes'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const { queryByStem, queryFirst } = useContentLocale()

const { data: pageResult } = await useAsyncData(
  () => `page-home-${locale.value}`,
  () => queryByStem('pages', 'home'),
  { watch: [locale] },
)

const { data: featuredProjects } = await useAsyncData(
  () => `home-featured-${locale.value}`,
  async () => {
    const { data } = await queryFirst('projects', async (collection) => {
      return queryCollection(collection).all() as Promise<
        import('~/types/content').ProjectDocument[]
      >
    })
    return getFeaturedProjects(data ?? [])
  },
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

    <section
      v-if="featuredProjects?.length"
      class="py-16 md:py-20"
      aria-labelledby="featured-works-title"
    >
      <UiContainer>
        <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2
            id="featured-works-title"
            class="font-display text-2xl leading-tight text-foreground md:text-3xl"
          >
            {{ $t('works.featuredTitle') }}
          </h2>
          <UiLink :to="localePath('/lavori')">{{ $t('works.viewAll') }}</UiLink>
        </div>
        <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
          <li v-for="project in featuredProjects" :key="project.stem">
            <article class="overflow-hidden rounded-lg border border-neutral-200">
              <NuxtLink :to="localePath(`/lavori/${project.stem}`)" class="group block">
                <NuxtImg
                  :src="project.cover"
                  :alt="project.title"
                  :sizes="IMAGE_SIZES.gridCard"
                  width="400"
                  height="300"
                  format="avif,webp"
                  loading="lazy"
                  decoding="async"
                  class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
                <div class="p-5">
                  <h3 class="font-display text-lg font-semibold text-foreground">
                    {{ project.title }}
                  </h3>
                  <p class="mt-1 text-sm text-muted-foreground">{{ project.description }}</p>
                </div>
              </NuxtLink>
            </article>
          </li>
        </ul>
      </UiContainer>
    </section>

    <UiContainer v-if="page.body" class="pb-16">
      <div class="prose prose-neutral mx-auto max-w-prose">
        <ContentRenderer :value="page" />
      </div>
    </UiContainer>
  </div>
</template>
