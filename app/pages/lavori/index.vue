<script setup lang="ts">
import { sortProjectsByOrder, type ProjectDocument } from '~/types/content'
import { IMAGE_SIZES } from '~/utils/imageSizes'

defineI18nRoute({
  paths: {
    it: '/lavori',
    en: '/works',
  },
})

const { locale } = useI18n()
const localePath = useLocalePath()
const { queryFirst } = useContentLocale()

const { data: projectsResult } = await useAsyncData(
  () => `projects-list-${locale.value}`,
  () =>
    queryFirst('projects', async (collection) => {
      const items = (await queryCollection(collection).all()) as ProjectDocument[]
      return sortProjectsByOrder(items)
    }),
  { watch: [locale] },
)

const projects = computed(() => projectsResult.value?.data ?? [])
const isFallback = computed(() => projectsResult.value?.isFallback ?? false)

const { t } = useI18n()

usePageSeo({
  title: computed(() => t('works.metaTitle')),
  description: computed(() => t('works.metaDescription')),
})
</script>

<template>
  <UiContainer class="py-12">
    <ContentFallbackNotice :show="isFallback" />

    <header class="mb-10 space-y-3">
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ $t('works.title') }}
      </h1>
      <p class="max-w-prose text-lg text-muted-foreground">
        {{ $t('works.lead') }}
      </p>
    </header>

    <ul v-if="projects.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <li v-for="project in projects" :key="project.stem">
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
              <h2 class="font-display text-lg font-semibold text-foreground">
                {{ project.title }}
              </h2>
              <p class="mt-1 text-sm text-muted-foreground">{{ project.description }}</p>
              <p v-if="project.client" class="mt-2 text-xs text-muted-foreground">
                {{ project.client }}
              </p>
            </div>
          </NuxtLink>
        </article>
      </li>
    </ul>
  </UiContainer>
</template>
