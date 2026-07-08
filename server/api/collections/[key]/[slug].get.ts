import {
  type LocaleCode,
  defaultLocaleCode,
  isCollectionKey,
  isLocaleCode,
} from '../../../../config/collections'
import { fetchItem } from '../../../utils/collections'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  const slug = getRouterParam(event, 'slug')

  if (!key || !slug || !isCollectionKey(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const query = getQuery(event)
  const rawLocale = String(query.locale ?? defaultLocaleCode)
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : defaultLocaleCode

  const item = await fetchItem(key, slug, locale, event)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  return item
})
