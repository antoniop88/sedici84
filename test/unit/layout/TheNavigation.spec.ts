import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import TheNavigation from '../../../app/components/layout/TheNavigation.vue'

describe('TheNavigation', () => {
  it('renders navigation items from app config', async () => {
    const wrapper = await mountSuspended(TheNavigation, { route: '/' })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThanOrEqual(5)
    expect(wrapper.text()).toMatch(/Home|Contatti|Immobili/i)
  })

  it('marks home as active on root route', async () => {
    const wrapper = await mountSuspended(TheNavigation, { route: '/' })

    const activeLink = wrapper.find('a[aria-current="page"]')
    expect(activeLink.exists()).toBe(true)
    expect(activeLink.attributes('href')).toBe('/')
  })

  it('resolves collection nav path for immobili on IT locale', async () => {
    const wrapper = await mountSuspended(TheNavigation, { route: '/immobili' })

    const propertiesLink = wrapper
      .findAll('a')
      .find((link) => link.attributes('href')?.includes('/immobili'))
    expect(propertiesLink).toBeDefined()
    expect(propertiesLink?.attributes('aria-current')).toBe('page')
  })

  it('resolves collection nav path for properties on EN locale', async () => {
    const wrapper = await mountSuspended(TheNavigation, { route: '/en/properties' })

    const propertiesLink = wrapper
      .findAll('a')
      .find((link) => link.attributes('href')?.includes('/en/properties'))
    expect(propertiesLink).toBeDefined()
    expect(propertiesLink?.attributes('aria-current')).toBe('page')
  })

  it('localizes static routes', async () => {
    const wrapper = await mountSuspended(TheNavigation, { route: '/en/about' })

    const aboutLink = wrapper
      .findAll('a')
      .find((link) => link.attributes('href')?.includes('/en/about'))
    expect(aboutLink).toBeDefined()
    expect(aboutLink?.attributes('aria-current')).toBe('page')
  })
})
