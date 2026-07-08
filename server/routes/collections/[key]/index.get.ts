import { isCollectionKey } from '../../../../config/collections'
import { paginateMockList } from '../../../mocks/collections/immobili'
import { mockRegistry } from '../../../mocks/collections/registry'
import {
  assertFastilyMockEnabled,
  parseListQuery,
  simulateFastilyLatency,
} from '../../../utils/fastily-mock'

export default defineEventHandler(async (event) => {
  assertFastilyMockEnabled(event)
  await simulateFastilyLatency()

  const key = getRouterParam(event, 'key')
  if (!key || !isCollectionKey(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  const adapter = mockRegistry[key]
  if (!adapter) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  const { locale, page, pageSize, filters } = parseListQuery(event)

  return paginateMockList(adapter.list(filters, locale), page, pageSize)
})
