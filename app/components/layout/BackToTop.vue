<script setup lang="ts">
const { t } = useI18n()
const { showBanner } = useCookieConsent()

const visible = ref(false)
const reduceMotion = ref(false)

const SCROLL_THRESHOLD = 400

function onScroll() {
  visible.value = window.scrollY > SCROLL_THRESHOLD
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: reduceMotion.value ? 'auto' : 'smooth',
  })
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 motion-reduce:transition-none"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 motion-reduce:transition-none"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <button
        v-if="visible"
        type="button"
        class="fixed end-6 z-40 inline-flex size-11 items-center justify-center rounded-full border border-neutral-200 bg-background text-foreground shadow-md transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        :class="showBanner ? 'bottom-28 sm:bottom-32' : 'bottom-6'"
        :aria-label="t('common.backToTop')"
        @click="scrollToTop"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-5"
          aria-hidden="true"
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </Transition>
  </Teleport>
</template>
