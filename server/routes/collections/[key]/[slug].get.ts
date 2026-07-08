import { isCollectionKey } from '../../../../config/collections'
import { mockRegistry } from '../../../mocks/collections/registry'
import { assertFastilyMockEnabled, simulateFastilyLatency } from '../../../utils/fastily-mock'

export default defineEventHandler(async (event) => {
  assertFastilyMockEnabled(event)
  await simulateFastilyLatency()

  const key = getRouterParam(event, 'key')
  const slug = getRouterParam(event, 'slug')

  if (!key || !slug || !isCollectionKey(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const query = getQuery(event)
  const locale = String(query.locale ?? 'it')

  const item = mockRegistry[key]?.findBySlug(slug, locale)
  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Item not found' })
  }

  return item
})
