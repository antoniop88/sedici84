import { defineComponent } from 'vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import {
  CONSENT_POLICY_VERSION,
  CONSENT_STORAGE_KEY,
  resetConsentStateForTesting,
  useCookieConsent,
} from '../../../app/composables/useCookieConsent'

const ConsentProbe = defineComponent({
  setup() {
    const { hasDecided, analyticsConsented, showBanner, acceptAll, rejectAll, savePreferences } =
      useCookieConsent()

    return {
      hasDecided,
      analyticsConsented,
      showBanner,
      acceptAll,
      rejectAll,
      savePreferences,
    }
  },
  template: '<div />',
})

describe('useCookieConsent', () => {
  beforeEach(() => {
    localStorage.clear()
    resetConsentStateForTesting()
  })

  afterEach(() => {
    localStorage.clear()
    resetConsentStateForTesting()
  })

  it('shows banner by default after hydration', async () => {
    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.vm.hasDecided).toBe(false)
    expect(wrapper.vm.showBanner).toBe(true)
  })

  it('accepts all and persists analytics consent', async () => {
    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    wrapper.vm.acceptAll()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.hasDecided).toBe(true)
    expect(wrapper.vm.analyticsConsented).toBe(true)
    expect(wrapper.vm.showBanner).toBe(false)

    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')
    expect(stored.preferences.analytics).toBe(true)
    expect(stored.version).toBe(CONSENT_POLICY_VERSION)
  })

  it('rejects all and persists analytics denial', async () => {
    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    wrapper.vm.rejectAll()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.analyticsConsented).toBe(false)
    const stored = JSON.parse(localStorage.getItem(CONSENT_STORAGE_KEY) ?? '{}')
    expect(stored.preferences.analytics).toBe(false)
  })

  it('saves custom preferences', async () => {
    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    wrapper.vm.savePreferences({ analytics: true })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.analyticsConsented).toBe(true)
    expect(wrapper.vm.showBanner).toBe(false)
  })

  it('restores persisted consent on reload', async () => {
    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))
    wrapper.vm.acceptAll()

    const wrapper2 = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper2.vm.hasDecided).toBe(true)
    expect(wrapper2.vm.showBanner).toBe(false)
  })

  it('treats expired records as undecided', async () => {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_POLICY_VERSION,
        preferences: { necessary: true, analytics: true },
        decidedAt: Date.now() - 10_000,
        expiresAt: Date.now() - 1_000,
      }),
    )

    const wrapper = await mountSuspended(ConsentProbe)
    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(wrapper.vm.hasDecided).toBe(false)
    expect(wrapper.vm.showBanner).toBe(true)
  })
})
