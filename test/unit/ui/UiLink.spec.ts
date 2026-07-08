import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiLink from '../../../app/components/ui/UiLink.vue'

describe('UiLink', () => {
  it('renders internal route as NuxtLink', async () => {
    const wrapper = await mountSuspended(UiLink, {
      props: { to: '/contatti' },
      slots: { default: 'Contact' },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toContain('/contatti')
    expect(link.attributes('target')).toBeUndefined()
  })

  it('renders external URL as anchor with target blank', async () => {
    const wrapper = await mountSuspended(UiLink, {
      props: { to: 'https://example.com' },
      slots: { default: 'External' },
    })

    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('treats internal path as external when forceExternal is set', async () => {
    const wrapper = await mountSuspended(UiLink, {
      props: { to: '/contatti', forceExternal: true },
      slots: { default: 'Forced' },
    })

    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('href')).toBe('/contatti')
  })
})
