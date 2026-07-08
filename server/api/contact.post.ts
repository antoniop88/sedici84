import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = contactSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid contact submission' })
  }

  // TODO (before go-live): deliver the message to a real destination — transactional email
  // (Resend/Postmark/SES), a CRM, or a ticketing webhook. Intentionally does not send anything
  // yet, so the form has a real endpoint to exercise its success/error handling against.
  // Rate limiting is already applied to /api/** via routeRules in nuxt.config.ts.

  return { ok: true }
})
