const REVEAL_SELECTOR = [
  'h1',
  'h2',
  'h3',
  'h4',
  'p',
  'li',
  'blockquote',
  'figure',
  'picture',
  'img',
  'details',
  'header',
  '[data-reveal]',
].join(',')

const STAGGER_MS = 70
const MAX_STAGGER_MS = 280

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function shouldSkip(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return true
  if (el.dataset.revealReady === 'true') return true
  if (el.closest('[data-no-reveal]')) return true
  if (el.getAttribute('aria-hidden') === 'true') return true
  // Decorative / layout-only images (hero layers, icons).
  if (el.tagName === 'IMG' && el.closest('[aria-hidden="true"]')) return true
  return false
}

function collectTargets(root: ParentNode): HTMLElement[] {
  const candidates = [...root.querySelectorAll(REVEAL_SELECTOR)].filter(
    (el): el is HTMLElement => !shouldSkip(el),
  )

  // Prefer outer blocks so nested text/images don't double-animate.
  return candidates.filter((el) => !candidates.some((other) => other !== el && other.contains(el)))
}

export function usePageReveal() {
  const route = useRoute()
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null
  let scanTimer: ReturnType<typeof setTimeout> | undefined

  function revealNow(el: HTMLElement) {
    el.classList.add('is-revealed')
    el.style.removeProperty('will-change')
  }

  function observe(el: HTMLElement, delayMs: number) {
    el.dataset.revealReady = 'true'
    el.classList.add('reveal')
    el.style.setProperty('--reveal-delay', `${delayMs}ms`)

    if (prefersReducedMotion()) {
      revealNow(el)
      return
    }

    observer?.observe(el)
  }

  function scan(root: HTMLElement) {
    if (!observer && !prefersReducedMotion()) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const el = entry.target as HTMLElement
            revealNow(el)
            observer?.unobserve(el)
          }
        },
        { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      )
    }

    const targets = collectTargets(root)
    const groups = new Map<HTMLElement | null, HTMLElement[]>()

    for (const el of targets) {
      const parent = el.parentElement
      const group = groups.get(parent) ?? []
      group.push(el)
      groups.set(parent, group)
    }

    for (const group of groups.values()) {
      group.forEach((el, index) => {
        const delay = Math.min(index * STAGGER_MS, MAX_STAGGER_MS)
        observe(el, delay)
      })
    }
  }

  function scheduleScan() {
    const root = document.getElementById('main-content')
    if (!root) return

    clearTimeout(scanTimer)
    // Wait for page enter transition + Vue DOM commit.
    scanTimer = setTimeout(() => {
      scan(root)
    }, 40)
  }

  function bindMutations() {
    const root = document.getElementById('main-content')
    if (!root || mutationObserver) return

    mutationObserver = new MutationObserver(() => {
      scheduleScan()
    })
    mutationObserver.observe(root, { childList: true, subtree: true })
  }

  function cleanup() {
    clearTimeout(scanTimer)
    observer?.disconnect()
    observer = null
    mutationObserver?.disconnect()
    mutationObserver = null
  }

  onMounted(() => {
    bindMutations()
    scheduleScan()
  })

  watch(
    () => route.fullPath,
    () => {
      nextTick(() => {
        scheduleScan()
      })
    },
  )

  onBeforeUnmount(cleanup)
}
