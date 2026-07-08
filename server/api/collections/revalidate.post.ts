import { createHash, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { isCollectionKey } from '../../../config/collections'
import { invalidateCollection } from '../../utils/collections'

const bodySchema = z.object({
  collection: z.string(),
  slug: z.string().optional(),
})

/** Constant-time comparison; hashing first normalizes length so timingSafeEqual never throws. */
function secretsMatch(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const authHeader = getHeader(event, 'authorization')
  const secretHeader = getHeader(event, 'x-revalidate-secret')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : secretHeader

  const secret = config.revalidateSecret
  if (!secret || !token || !secretsMatch(token, secret)) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request body' })
  }

  const { collection, slug } = parsed.data

  if (!isCollectionKey(collection)) {
    throw createError({ statusCode: 400, statusMessage: 'Unknown collection' })
  }

  await invalidateCollection(collection, slug)

  return { revalidated: true, collection, slug: slug ?? null }
})
