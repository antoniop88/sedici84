import type { Ref } from 'vue'

export function useRouteMainFocus(mainRef: Ref<HTMLElement | null>) {
  const route = useRoute()

  watch(
    () => route.fullPath,
    () => {
      if (route.hash) return

      const mobileMenu = document.getElementById('mobile-menu')
      if (mobileMenu?.contains(document.activeElement)) return

      nextTick(() => {
        mainRef.value?.focus({ preventScroll: true })
      })
    },
  )
}
