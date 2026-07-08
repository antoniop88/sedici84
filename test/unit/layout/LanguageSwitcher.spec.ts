import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LanguageSwitcher from '../../../app/components/layout/LanguageSwitcher.vue'

describe('LanguageSwitcher', () => {
  it('switches between IT and EN prefixes on home', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher, { route: '/' })

    const links = wrapper.findAll('a')
    const hrefs = links.map((link) => link.attributes('href'))

    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/en')
    expect(wrapper.find('a[aria-current="true"]').attributes('href')).toBe('/')
  })

  it('shows EN prefix link from Italian home', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher, { route: '/' })

    const enLink = wrapper.findAll('a').find((link) => link.attributes('href') === '/en')
    expect(enLink).toBeDefined()
  })
})
