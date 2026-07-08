import { isCollectionKey } from '../../../../config/collections'
import { mockRegistry } from '../../../mocks/collections/registry'
import { assertFastilyMockEnabled, simulateFastilyLatency } from '../../../utils/fastily-mock'

export default defineEventHandler(async (event) => {
  assertFastilyMockEnabled(event)
  await simulateFastilyLatency()

  const key = getRouterParam(event, 'key')
  if (!key || !isCollectionKey(key)) {
    throw createError({ statusCode: 404, statusMessage: 'Collection not found' })
  }

  return mockRegistry[key]?.slugs() ?? []
})
