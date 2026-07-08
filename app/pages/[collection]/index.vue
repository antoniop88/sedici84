<script setup lang="ts">
import type { CollectionItem } from '../../../config/collections'
import { collectionComponents } from '~/components/collections/registry'

defineI18nRoute({
  paths: {
    it: '/[collection]',
    en: '/[collection]',
  },
})

const { locale, t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const { collectionKey, config } = useResolvedCollection()

if (!collectionKey.value || !config.value) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const key = collectionKey.value
const collectionConfig = config.value

const listComponent = collectionConfig.listComponent
  ? (collectionComponents[collectionConfig.listComponent] ?? null)
  : null

useCollectionListI18nParams(key)

const page = computed(() => Math.max(1, Number(route.query.page ?? 1) || 1))
const filters = computed<Record<string, string | undefined>>(() => {
  const result: Record<string, string | undefined> = {}
  for (const filter of collectionConfig.filters) {
    const value = route.query[filter.name]
    result[filter.name] = value ? String(value) : undefined
  }
  return result
})

const { data: listResult, error } = await useCollectionList(key, {
  page,
  filters,
})

if (error.value) {
  // Upstream failure: emit a retryable 5xx instead of a soft-404 (empty grid with HTTP 200).
  throw createError({
    statusCode: (error.value as { statusCode?: number }).statusCode ?? 502,
    statusMessage: t('errors.generic'),
    fatal: true,
  })
}

const items = computed(() => {
  const allItems = listResult.value?.items ?? []
  const currentLocale = locale.value as 'it' | 'en'
  if (currentLocale === 'en') {
    return allItems.filter((item) => Boolean(item.slugs.en))
  }
  return allItems
})
const total = computed(() => listResult.value?.total ?? 0)
const pageSize = computed(() => listResult.value?.pageSize ?? 12)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

useCollectionSeo({
  key,
  config: collectionConfig,
  mode: 'list',
})

function itemPath(item: CollectionItem<typeof key>): string {
  const currentLocale = locale.value as 'it' | 'en'
  const slug = item.slugs[currentLocale] ?? ''
  return localePath(`/${route.params.collection}/${slug}`)
}
</script>

<template>
  <UiContainer class="py-12">
    <header class="mb-10 space-y-3">
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ $t(collectionConfig.i18n.listTitleKey) }}
      </h1>
      <p class="max-w-prose text-lg text-muted-foreground">
        {{ $t(collectionConfig.i18n.listDescriptionKey) }}
      </p>
    </header>

    <form
      v-if="collectionConfig.filters.length"
      class="mb-8 flex flex-wrap gap-3 rounded-lg border border-neutral-200 p-4"
      method="get"
    >
      <label
        v-for="filter in collectionConfig.filters"
        :key="filter.name"
        class="flex flex-col gap-1 text-sm"
      >
        <span class="font-medium">{{ $t(filter.labelKey) }}</span>
        <input
          :name="filter.name"
          :type="filter.type"
          :value="route.query[filter.name]"
          class="rounded-md border border-neutral-500 px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>
      <div class="flex items-end">
        <UiButton type="submit">{{ $t(collectionConfig.i18n.applyKey) }}</UiButton>
      </div>
    </form>

    <ul v-if="items.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
      <li v-for="item in items" :key="item.id">
        <component
          :is="listComponent"
          v-if="listComponent"
          :item="item"
          :locale="locale"
          :to="itemPath(item)"
        />
      </li>
    </ul>

    <p v-else class="text-muted-foreground">{{ $t(collectionConfig.i18n.emptyKey) }}</p>

    <nav
      v-if="totalPages > 1"
      class="mt-10 flex items-center justify-center gap-4"
      :aria-label="$t(collectionConfig.i18n.paginationKey)"
    >
      <NuxtLink
        v-if="page > 1"
        :to="{ path: route.path, query: { ...route.query, page: String(page - 1) } }"
        class="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {{ $t(collectionConfig.i18n.prevPageKey) }}
      </NuxtLink>
      <span class="text-sm text-muted-foreground">
        {{ $t(collectionConfig.i18n.pageOfKey, { page, total: totalPages }) }}
      </span>
      <NuxtLink
        v-if="page < totalPages"
        :to="{ path: route.path, query: { ...route.query, page: String(page + 1) } }"
        class="rounded-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {{ $t(collectionConfig.i18n.nextPageKey) }}
      </NuxtLink>
    </nav>
  </UiContainer>
</template>
