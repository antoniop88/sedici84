import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import type {
  CollectionItem,
  CollectionKey,
  CollectionListResponse,
  LocaleCode,
} from '../../config/collections'

export type CollectionListOptions = {
  page?: MaybeRefOrGetter<number>
  pageSize?: MaybeRefOrGetter<number>
  filters?: MaybeRefOrGetter<Record<string, string | undefined>>
}

export type CollectionItemOptions = Record<string, never>

function buildListQuery(
  locale: LocaleCode,
  page: number,
  pageSize: number,
  filters: Record<string, string | undefined>,
) {
  const query: Record<string, string | number> = {
    locale,
    page,
    pageSize,
  }

  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== '') {
      query[key] = value
    }
  }

  return query
}

export function useCollectionList<K extends CollectionKey>(
  key: K,
  options: CollectionListOptions = {},
) {
  const { locale } = useI18n()
  const route = useRoute()

  const page = computed(() => Number(toValue(options.page) ?? route.query.page ?? 1) || 1)
  const pageSize = computed(() => toValue(options.pageSize) ?? 12)
  const filters = computed(() => toValue(options.filters) ?? {})

  const asyncKey = computed(
    () => `collection:${key}:list:${locale.value}:${page.value}:${JSON.stringify(filters.value)}`,
  )

  return useAsyncData(
    asyncKey,
    () =>
      $fetch<CollectionListResponse<CollectionItem<K>>>(`/api/collections/${key}`, {
        query: buildListQuery(
          locale.value as LocaleCode,
          page.value,
          pageSize.value,
          filters.value,
        ),
      }),
    { watch: [locale, page, pageSize, filters] },
  )
}

export function useCollectionItem<K extends CollectionKey>(
  key: K,
  slug: MaybeRefOrGetter<string>,
  _options: CollectionItemOptions = {},
) {
  const { locale } = useI18n()
  const resolvedSlug = computed(() => toValue(slug))

  const asyncKey = computed(() => `collection:${key}:item:${locale.value}:${resolvedSlug.value}`)

  return useAsyncData(
    asyncKey,
    async () => {
      const slugValue = resolvedSlug.value
      if (!slugValue) return null

      try {
        return await $fetch<CollectionItem<K>>(`/api/collections/${key}/${slugValue}`, {
          query: { locale: locale.value },
        })
      } catch (error: unknown) {
        // A 404 means "no such item" → null (page renders its 404).
        // Anything else (502 from an upstream failure, etc.) must NOT be masked as 404:
        // rethrow so useAsyncData surfaces the real status and the page can emit a 5xx.
        if ((error as { statusCode?: number }).statusCode === 404) return null
        throw error
      }
    },
    { watch: [locale, resolvedSlug] },
  )
}
