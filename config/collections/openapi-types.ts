import type { components, paths } from '../../types/openapi.generated'

export type ApiLocalizedString = components['schemas']['LocalizedString']
export type ApiPropertyItem = components['schemas']['PropertyItem']
export type ApiCollectionSlugIndex = components['schemas']['CollectionSlugIndex']
export type ApiCollectionListResponse = components['schemas']['CollectionListResponse']

export type ApiLocaleCode = NonNullable<
  NonNullable<paths['/v1/collections/{key}']['get']['parameters']['query']>['locale']
>

export type ApiCollectionListResponseOf<T> = Omit<ApiCollectionListResponse, 'items'> & {
  items: T[]
}
