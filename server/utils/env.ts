import { z } from 'zod'
import { site } from '../../config/site'

const localeCodes = site.locales.map((locale) => locale.code) as [string, ...string[]]

/** Dev-only fallback secret. Boot fails in production if the revalidate secret is left at this value. */
export const INSECURE_REVALIDATE_SECRET = 'dev-revalidate-secret'

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
  NUXT_API_BASE_URL: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .or(z.literal(''))
    .optional()
    .default(''),
  NUXT_API_KEY: z.string().optional().default(''),
  NUXT_REVALIDATE_SECRET: z.string().optional().default(INSECURE_REVALIDATE_SECRET),
  NUXT_USE_FASTILY_MOCK: z.enum(['true', 'false']).optional().default('true'),
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

/**
 * Runtime-only guard for secrets that must never keep their dev defaults in production.
 * Kept separate from validateEnv() (which also runs at build time, where these secrets are
 * legitimately absent) so it can hard-fail server boot without breaking the build.
 */
export function assertProductionSecrets(env: Env): void {
  if (env.NUXT_PUBLIC_ENV !== 'production') return

  const errors: string[] = []

  if (!env.NUXT_REVALIDATE_SECRET || env.NUXT_REVALIDATE_SECRET === INSECURE_REVALIDATE_SECRET) {
    errors.push(
      '  • NUXT_REVALIDATE_SECRET: must be set to a strong, non-default value in production',
    )
  }

  if (errors.length > 0) {
    throw new Error(
      [
        'Insecure production configuration:',
        ...errors,
        '',
        'Generate a strong secret (e.g. `openssl rand -hex 32`) and set it before deploying.',
      ].join('\n'),
    )
  }
}
