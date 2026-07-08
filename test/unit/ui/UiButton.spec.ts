import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import UiButton from '../../../app/components/ui/UiButton.vue'

describe('UiButton', () => {
  it('renders primary variant as button', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { variant: 'primary' },
      slots: { default: 'Click me' },
    })

    expect(wrapper.find('button').exists()).toBe(true)
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.find('button').classes().join(' ')).toContain('bg-primary')
  })

  it('renders secondary and ghost variants', async () => {
    const secondary = await mountSuspended(UiButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Secondary' },
    })
    expect(secondary.find('button').classes().join(' ')).toContain('border')

    const ghost = await mountSuspended(UiButton, {
      props: { variant: 'ghost' },
      slots: { default: 'Ghost' },
    })
    expect(ghost.find('button').classes().join(' ')).toContain('bg-transparent')
  })

  it('renders internal link with NuxtLink', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { to: '/contatti' },
      slots: { default: 'Contact' },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toContain('/contatti')
    expect(link.attributes('target')).toBeUndefined()
  })

  it('renders external link with target blank', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { to: 'https://example.com' },
      slots: { default: 'External' },
    })

    const link = wrapper.find('a')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('disables link with aria-disabled and tabindex -1', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { to: '/contatti', disabled: true },
      slots: { default: 'Disabled' },
    })

    const link = wrapper.find('a')
    expect(link.attributes('aria-disabled')).toBe('true')
    expect(link.attributes('tabindex')).toBe('-1')
  })

  it('shows loading state on button', async () => {
    const wrapper = await mountSuspended(UiButton, {
      props: { loading: true },
      slots: { default: 'Loading' },
    })

    expect(wrapper.find('button').attributes('aria-busy')).toBe('true')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[aria-hidden="true"]').exists()).toBe(true)
  })
})
