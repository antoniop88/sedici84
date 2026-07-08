import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import {
  getCollectionConfig,
  getCollectionSegment,
  getPathForLocale,
  resolveCollectionKey,
  type CollectionItem,
  type CollectionKey,
  type LocaleCode,
} from '../../config/collections'

export function useResolvedCollection() {
  const route = useRoute()
  const { locale, t } = useI18n()

  const segment = computed(() => String(route.params.collection ?? ''))

  const collectionKey = computed(() =>
    resolveCollectionKey(segment.value, locale.value as LocaleCode),
  )

  const config = computed(() =>
    collectionKey.value ? getCollectionConfig(collectionKey.value) : null,
  )

  if (import.meta.server && segment.value && !collectionKey.value) {
    throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
  }

  return {
    segment,
    collectionKey: collectionKey as ComputedRef<CollectionKey | null>,
    config,
  }
}

function buildCollectionI18nParams<K extends CollectionKey>(
  key: K,
  item?: CollectionItem<K>,
): Record<string, Record<string, string>> {
  const params: Record<string, Record<string, string>> = {}

  for (const loc of ['it', 'en'] as const) {
    const collectionSegment = getCollectionSegment(key, loc)
    if (item) {
      const slug = item.slugs[loc]
      if (slug) params[loc] = { collection: collectionSegment, slug }
    } else {
      params[loc] = { collection: collectionSegment }
    }
  }

  return params
}

export function useCollectionListI18nParams(key: CollectionKey) {
  const setI18nParams = useSetI18nParams()
  setI18nParams(buildCollectionI18nParams(key))
}

export function useCollectionI18nParams<K extends CollectionKey>(
  key: K,
  item: MaybeRefOrGetter<CollectionItem<K>>,
) {
  const setI18nParams = useSetI18nParams()
  const resolved = toValue(item)

  if (resolved) {
    setI18nParams(buildCollectionI18nParams(key, resolved))
  }

  watch(
    () => toValue(item),
    (next) => {
      if (next) setI18nParams(buildCollectionI18nParams(key, next))
    },
  )
}

export function useCollectionDetailPath(
  key: CollectionKey,
  slug: string,
  targetLocale: LocaleCode = 'it',
) {
  const localePath = useLocalePath()
  const path = getPathForLocale(getCollectionConfig(key).paths, targetLocale)
  return localePath(`${path}/${slug}`)
}

export function useCollectionListPath(key: CollectionKey, targetLocale: LocaleCode = 'it') {
  const localePath = useLocalePath()
  const path = getPathForLocale(getCollectionConfig(key).paths, targetLocale)
  return localePath(path)
}
