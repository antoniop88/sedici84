<script setup lang="ts">
import { getLocalizedValue } from '../../../config/collections'
import { collectionComponents } from '~/components/collections/registry'

defineI18nRoute({
  paths: {
    it: '/[collection]/[slug]',
    en: '/[collection]/[slug]',
  },
})

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()

const { collectionKey, config } = useResolvedCollection()

if (!collectionKey.value || !config.value) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const key = collectionKey.value
const collectionConfig = config.value
const slug = computed(() => String(route.params.slug))

const detailComponent = collectionConfig.detailComponent
  ? (collectionComponents[collectionConfig.detailComponent] ?? null)
  : null

const { data: item, error } = await useCollectionItem(key, slug)

if (error.value) {
  throw createError({
    statusCode: (error.value as { statusCode?: number }).statusCode ?? 502,
    statusMessage: t('errors.generic'),
    fatal: true,
  })
}

if (!item.value) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const resolvedItem = computed(() => item.value!)

useCollectionI18nParams(key, resolvedItem)

useCollectionSeo({
  key,
  config: collectionConfig,
  mode: 'detail',
  item: resolvedItem.value,
  breadcrumbs: computed(() => [
    { name: t('nav.home'), item: '/' },
    {
      name: t(collectionConfig.i18n.listTitleKey),
      item: `/${route.params.collection}`,
    },
    {
      name: getLocalizedValue(resolvedItem.value.title, locale.value as 'it' | 'en'),
      item: `/${route.params.collection}/${slug.value}`,
    },
  ]),
})
</script>

<template>
  <UiContainer v-if="resolvedItem" class="py-12">
    <nav class="mb-6">
      <UiLink :to="localePath(`/${route.params.collection}`)">
        {{ $t(collectionConfig.i18n.backToListKey) }}
      </UiLink>
    </nav>

    <component :is="detailComponent" v-if="detailComponent" :item="resolvedItem" :locale="locale" />
  </UiContainer>
</template>
