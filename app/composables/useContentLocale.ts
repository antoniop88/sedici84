import type { Collections } from '@nuxt/content'
import type {
  CollectionDocumentMap,
  ContentCollectionType,
  LocalizedQueryResult,
} from '~/types/content'

export function useContentLocale() {
  const { locale } = useI18n()
  const { defaultLocale } = useAppConfig()
  const defaultLocaleCode = defaultLocale as string

  function collectionName(type: ContentCollectionType, loc?: string): keyof Collections {
    const code = loc ?? locale.value
    return `${type}_${code}` as keyof Collections
  }

  async function queryFirst<T>(
    type: ContentCollectionType,
    queryFn: (collection: keyof Collections) => Promise<T | null | undefined>,
  ): Promise<LocalizedQueryResult<T>> {
    const primary = collectionName(type)
    let data = (await queryFn(primary)) ?? null
    let isFallback = false

    if (!data && locale.value !== defaultLocaleCode) {
      data = (await queryFn(collectionName(type, defaultLocaleCode))) ?? null
      isFallback = data !== null
    }

    return { data, isFallback }
  }

  async function queryByStem<T extends ContentCollectionType>(
    type: T,
    stem: string,
  ): Promise<LocalizedQueryResult<CollectionDocumentMap[T]>> {
    return queryFirst(type, async (collection) => {
      return queryCollection(collection).where('stem', '=', stem).first() as Promise<
        CollectionDocumentMap[T] | null
      >
    })
  }

  return {
    locale,
    defaultLocaleCode,
    collectionName,
    queryFirst,
    queryByStem,
  }
}
