import type {
  ApiCollectionListResponseOf,
  ApiCollectionSlugIndex,
  ApiLocalizedString,
  ApiPropertyItem,
} from '../config/collections/openapi-types'
import type { PropertyItem } from '../config/collections/schemas'

type LocalizedStringManual = {
  it: string
  en?: string
}

type CollectionSlugIndexManual = {
  id: string
  slugs: Partial<Record<'it' | 'en', string>>
  updatedAt: string
  primaryImage?: string
}

type CollectionListResponseManual<T> = {
  items: T[]
  page: number
  pageSize: number
  total: number
}

type AssertOptionalEn = LocalizedStringManual extends ApiLocalizedString ? true : never
type AssertManualFromApi = ApiLocalizedString extends LocalizedStringManual ? true : never
type AssertEnNotRequired = 'en' extends keyof ApiLocalizedString ? true : never
type AssertEnOptional = ApiLocalizedString extends { it: string; en?: string } ? true : never

type AssertPropertyItemToApi = PropertyItem extends ApiPropertyItem ? true : never
type AssertPropertyItemFromApi = ApiPropertyItem extends PropertyItem ? true : never

type AssertSlugIndexToApi = CollectionSlugIndexManual extends ApiCollectionSlugIndex ? true : never
type AssertSlugIndexFromApi = ApiCollectionSlugIndex extends CollectionSlugIndexManual
  ? true
  : never

type AssertListResponseShape =
  CollectionListResponseManual<PropertyItem> extends ApiCollectionListResponseOf<PropertyItem>
    ? ApiCollectionListResponseOf<PropertyItem> extends CollectionListResponseManual<PropertyItem>
      ? true
      : never
    : never

const _optionalEn: AssertOptionalEn = true
const _manualFromApi: AssertManualFromApi = true
const _enKey: AssertEnNotRequired = true
const _enOptional: AssertEnOptional = true
const _propertyToApi: AssertPropertyItemToApi = true
const _propertyFromApi: AssertPropertyItemFromApi = true
const _slugToApi: AssertSlugIndexToApi = true
const _slugFromApi: AssertSlugIndexFromApi = true
const _listShape: AssertListResponseShape = true

void _optionalEn
void _manualFromApi
void _enKey
void _enOptional
void _propertyToApi
void _propertyFromApi
void _slugToApi
void _slugFromApi
void _listShape

type EnProperty = ApiLocalizedString['en']
const _enType: EnProperty | undefined = undefined

void _enType
