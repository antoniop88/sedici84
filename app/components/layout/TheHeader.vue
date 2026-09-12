<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const { brand } = useAppConfig()

const isMenuOpen = ref(false)
const hasLogo = ref(true)
const isScrolled = ref(false)
const menuButtonRef = ref<HTMLButtonElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)
let previousOverflow = ''

function handleScroll() {
  isScrolled.value = window.scrollY > 24
}

function openMenu() {
  previousOverflow = document.documentElement.style.overflow
  document.documentElement.style.overflow = 'hidden'
  isMenuOpen.value = true
}

function closeMenu() {
  document.documentElement.style.overflow = previousOverflow
  isMenuOpen.value = false
  nextTick(() => menuButtonRef.value?.focus())
}

function toggleMenu() {
  if (isMenuOpen.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

useFocusTrap(mobileMenuRef, isMenuOpen, closeMenu)

onMounted(() => {
  handleScroll()
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.documentElement.style.overflow = previousOverflow
})

watch(
  () => route.fullPath,
  () => {
    if (isMenuOpen.value) closeMenu()
  },
)
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-[background-color,box-shadow,border-color] duration-300 motion-reduce:transition-none"
    :class="
      isScrolled
        ? 'border-white/50 bg-background/85 shadow-[0_8px_30px_rgba(42,36,32,0.08)] backdrop-blur-xl'
        : 'border-neutral-200 bg-background'
    "
  >
    <UiContainer
      class="flex items-center justify-between gap-4 transition-[padding] duration-300 motion-reduce:transition-none"
      :class="isScrolled ? 'py-2' : 'py-3 md:py-4'"
    >
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :aria-label="$t('header.logoLabel', { name: brand.name })"
      >
        <img
          v-show="hasLogo"
          :src="brand.logo"
          :alt="brand.name"
          class="h-20 w-auto transition-[height] duration-300 motion-reduce:transition-none sm:h-24 md:h-28"
          :class="isScrolled ? '!h-16 md:!h-20' : ''"
          @error="hasLogo = false"
        />
        <span
          v-if="!hasLogo"
          class="font-display text-lg font-semibold tracking-wide text-foreground"
        >
          {{ brand.name }}
        </span>
      </NuxtLink>

      <div class="hidden items-center gap-6 md:flex">
        <LayoutTheNavigation />
        <LayoutLanguageSwitcher />
      </div>

      <button
        ref="menuButtonRef"
        type="button"
        class="inline-flex size-11 items-center justify-center rounded-full border border-primary-900/15 bg-white/35 text-foreground transition-colors motion-reduce:transition-none hover:border-accent hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="isMenuOpen ? $t('header.closeMenu') : $t('header.openMenu')"
        @click="toggleMenu"
      >
        <span class="sr-only">
          {{ isMenuOpen ? $t('header.closeMenu') : $t('header.openMenu') }}
        </span>
        <svg
          v-if="!isMenuOpen"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-6"
          aria-hidden="true"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-6"
          aria-hidden="true"
        >
          <line x1="18" x2="6" y1="6" y2="18" />
          <line x1="6" x2="18" y1="6" y2="18" />
        </svg>
      </button>
    </UiContainer>

    <Teleport to="body">
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 md:hidden" role="presentation">
        <div
          class="absolute inset-0 bg-primary-950/60 backdrop-blur-sm"
          aria-hidden="true"
          @click="closeMenu"
        />
        <div
          id="mobile-menu"
          ref="mobileMenuRef"
          role="dialog"
          :aria-label="$t('header.mobileNavigation')"
          class="absolute end-0 top-0 flex h-full w-[88%] max-w-sm flex-col overflow-y-auto border-s border-white/10 bg-primary-950 px-6 py-5 text-primary-foreground shadow-2xl"
        >
          <div class="flex items-center justify-between border-b border-white/10 pb-5">
            <div class="rounded-md border border-accent/30 bg-background p-1.5">
              <img v-if="hasLogo" :src="brand.logo" :alt="brand.name" class="h-16 w-auto" />
            </div>
            <span v-if="!hasLogo" class="font-display text-lg font-semibold tracking-wide">
              {{ brand.name }}
            </span>
            <button
              type="button"
              class="inline-flex size-11 items-center justify-center rounded-full border border-white/15 text-primary-100 transition-colors motion-reduce:transition-none hover:border-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
              :aria-label="$t('header.closeMenu')"
              @click="closeMenu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-6"
                aria-hidden="true"
              >
                <line x1="18" x2="6" y1="6" y2="18" />
                <line x1="6" x2="18" y1="6" y2="18" />
              </svg>
            </button>
          </div>

          <div class="flex flex-1 flex-col justify-center py-8">
            <LayoutTheNavigation orientation="vertical" tone="dark" />
          </div>

          <div class="border-t border-white/10 pt-5">
            <p class="mb-4 text-xs uppercase tracking-[0.22em] text-accent">
              {{ $t('common.languageSwitcher.label') }}
            </p>
            <LayoutLanguageSwitcher tone="dark" />
          </div>
        </div>
      </div>
    </Teleport>
  </header>
</template>
