/**
 * @vitest-environment node
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { validateEnv } from '../../../server/utils/env'

const baseEnv = {
  NUXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NUXT_PUBLIC_ENV: 'development',
  NUXT_PUBLIC_SITE_NAME: 'Sedici 84',
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
  })

  it('rejects invalid site URL', () => {
    process.env.NUXT_PUBLIC_SITE_URL = 'not-a-url'
    expect(() => validateEnv()).toThrow(/Invalid environment variables/)
  })

  it('rejects invalid public env value', () => {
    process.env.NUXT_PUBLIC_ENV = 'invalid'
    expect(() => validateEnv()).toThrow(/Invalid environment variables/)
  })
})
