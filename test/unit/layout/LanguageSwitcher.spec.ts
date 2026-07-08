import { defineComponent } from 'vue'
import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import LanguageSwitcher from '../../../app/components/layout/LanguageSwitcher.vue'
import { useCollectionI18nParams } from '../../../app/composables/useCollectionRoute'
import { mockImmobiliItems } from '../../../server/mocks/collections/immobili'

const PropertyDetailLanguageSwitcher = defineComponent({
  components: { LanguageSwitcher },
  setup() {
    const item = mockImmobiliItems.find((entry) => entry.slugs.it === 'attico-brera')
    if (item) {
      useCollectionI18nParams('immobili', item)
    }
  },
  template: '<LanguageSwitcher />',
})

const UntranslatedDetailLanguageSwitcher = defineComponent({
  components: { LanguageSwitcher },
  setup() {
    const item = mockImmobiliItems.find((entry) => entry.slugs.it === 'monolocale-porta-romana')
    if (item) {
      useCollectionI18nParams('immobili', item)
    }
  },
  template: '<LanguageSwitcher />',
})

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

  it('uses translated collection slug when switching from property detail', async () => {
    const wrapper = await mountSuspended(PropertyDetailLanguageSwitcher, {
      route: '/immobili/attico-brera',
    })

    const enLink = wrapper
      .findAll('a')
      .find((link) => link.attributes('href')?.includes('/en/properties/brera-penthouse'))
    expect(enLink).toBeDefined()
  })

  it('marks current locale as aria-current on EN property detail', async () => {
    const wrapper = await mountSuspended(PropertyDetailLanguageSwitcher, {
      route: '/en/properties/brera-penthouse',
    })

    const current = wrapper.find('a[aria-current="true"]')
    expect(current.attributes('href')).toContain('/en/properties/brera-penthouse')
  })

  it('falls back to the localized list when the item has no translation', async () => {
    const wrapper = await mountSuspended(UntranslatedDetailLanguageSwitcher, {
      route: '/immobili/monolocale-porta-romana',
    })

    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))
    // The EN switch must point at the EN collection list, never a non-existent detail URL.
    expect(hrefs).toContain('/en/properties')
    expect(hrefs.some((href) => href?.includes('/en/immobili/monolocale-porta-romana'))).toBe(false)
  })
})
