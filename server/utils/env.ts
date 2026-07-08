import { z } from 'zod'
import { site } from '../../config/site'

const localeCodes = site.locales.map((locale) => locale.code) as [string, ...string[]]

const envSchema = z.object({
  NUXT_PUBLIC_SITE_URL: z.string().url({
    message: 'Must be a valid URL (e.g. http://localhost:3000)',
  }),
  NUXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production'], {
    message: 'Must be one of: development, staging, production',
  }),
  NUXT_PUBLIC_SITE_NAME: z.string().min(1).default(site.name),
  NUXT_PUBLIC_DEFAULT_LOCALE: z.enum(localeCodes).default(site.defaultLocale),
  NUXT_PUBLIC_UMAMI_HOST: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .or(z.literal(''))
    .optional()
    .default(''),
  NUXT_PUBLIC_UMAMI_WEBSITE_ID: z.string().optional().default(''),
})

export type Env = z.infer<typeof envSchema>

function formatZodError(error: z.ZodError): string {
  const lines = error.issues.map((issue) => {
    const path = issue.path.join('.') || '(unknown)'
    return `  • ${path}: ${issue.message}`
  })

  return [
    'Invalid environment variables:',
    ...lines,
    '',
    'Copy .env.example to .env and set the required values.',
  ].join('\n')
}

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    throw new Error(formatZodError(result.error))
  }

  return result.data
}
