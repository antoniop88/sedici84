/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { assertProductionSecrets, validateEnv } from '../../../server/utils/env'

const baseEnv = {
  NUXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NUXT_PUBLIC_ENV: 'development',
  NUXT_PUBLIC_SITE_NAME: 'Acme Studio',
  NUXT_PUBLIC_DEFAULT_LOCALE: 'it',
}

describe('validateEnv', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv, ...baseEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('accepts valid environment input', () => {
    const env = validateEnv()
    expect(env.NUXT_PUBLIC_SITE_URL).toBe('http://localhost:3000')
    expect(env.NUXT_PUBLIC_ENV).toBe('development')
    expect(env.NUXT_USE_FASTILY_MOCK).toBe('true')
  })

  it('rejects invalid site URL', () => {
    process.env.NUXT_PUBLIC_SITE_URL = 'not-a-url'
    expect(() => validateEnv()).toThrow(/Invalid environment variables/)
  })

  it('rejects invalid public env value', () => {
    process.env.NUXT_PUBLIC_ENV = 'invalid'
    expect(() => validateEnv()).toThrow(/Invalid environment variables/)
  })

  it('rejects invalid API base URL when provided', () => {
    process.env.NUXT_API_BASE_URL = 'not-a-valid-url'
    expect(() => validateEnv()).toThrow(/Invalid environment variables/)
  })

  it('accepts empty optional API base URL', () => {
    process.env.NUXT_API_BASE_URL = ''
    const env = validateEnv()
    expect(env.NUXT_API_BASE_URL).toBe('')
  })
})

describe('assertProductionSecrets', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    process.env = { ...originalEnv, ...baseEnv }
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('is a no-op outside production even with the dev default secret', () => {
    const env = validateEnv()
    expect(env.NUXT_PUBLIC_ENV).toBe('development')
    expect(() => assertProductionSecrets(env)).not.toThrow()
  })

  it('throws in production when the revalidate secret is the dev default', () => {
    process.env.NUXT_PUBLIC_ENV = 'production'
    process.env.NUXT_PUBLIC_SITE_URL = 'https://example.com'
    delete process.env.NUXT_REVALIDATE_SECRET
    const env = validateEnv()
    expect(() => assertProductionSecrets(env)).toThrow(/Insecure production configuration/)
  })

  it('passes in production with a strong non-default secret', () => {
    process.env.NUXT_PUBLIC_ENV = 'production'
    process.env.NUXT_PUBLIC_SITE_URL = 'https://example.com'
    process.env.NUXT_REVALIDATE_SECRET = 'b3a1f2c4d5e6a7b8c9d0e1f2a3b4c5d6'
    const env = validateEnv()
    expect(() => assertProductionSecrets(env)).not.toThrow()
  })
})
