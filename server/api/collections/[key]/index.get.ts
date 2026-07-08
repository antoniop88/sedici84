import {
  type LocaleCode,
  defaultLocaleCode,
  isCollectionKey,
  isLocaleCode,
} from '../../../../config/collections'
import { fetchList, parseAllowedFilters } from '../../../utils/collections'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key || !isCollectionKey(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  const query = getQuery(event)
  const rawLocale = String(query.locale ?? defaultLocaleCode)
  const locale: LocaleCode = isLocaleCode(rawLocale) ? rawLocale : defaultLocaleCode
  const page = Math.max(1, Number(query.page ?? 1) || 1)
  const pageSize = Math.min(50, Math.max(1, Number(query.pageSize ?? 12) || 12))
  const filters = parseAllowedFilters(key, query)

  return fetchList(key, { locale, page, pageSize, filters }, event)
})
