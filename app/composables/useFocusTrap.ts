import type { Ref } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null,
  )
}

export function useFocusTrap(
  containerRef: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape?: () => void,
) {
  let previousActiveElement: HTMLElement | null = null

  function handleKeyDown(event: KeyboardEvent) {
    const container = containerRef.value
    if (!container || !active.value) return

    if (event.key === 'Escape') {
      event.preventDefault()
      onEscape?.()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = getFocusableElements(container)
    if (focusable.length === 0) return

    const first = focusable[0]!
    const last = focusable[focusable.length - 1]!
    const activeElement = document.activeElement as HTMLElement | null

    if (event.shiftKey) {
      if (activeElement === first || !container.contains(activeElement)) {
        event.preventDefault()
        last.focus()
      }
    } else if (activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  watch(active, (isActive) => {
    if (isActive) {
      previousActiveElement = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        const focusable = containerRef.value ? getFocusableElements(containerRef.value) : []
        focusable[0]?.focus()
      })
    } else {
      document.body.style.overflow = ''
      previousActiveElement?.focus()
      previousActiveElement = null
    }
  })

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  })
}
