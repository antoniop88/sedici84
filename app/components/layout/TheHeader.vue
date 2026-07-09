<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()
const { brand } = useAppConfig()

const isMenuOpen = ref(false)
const hasLogo = ref(true)
const menuButtonRef = ref<HTMLButtonElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)

function openMenu() {
  isMenuOpen.value = true
}

function closeMenu() {
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

watch(
  () => route.fullPath,
  () => {
    if (isMenuOpen.value) closeMenu()
  },
)
</script>

<template>
  <header class="border-b border-neutral-200 bg-background">
    <UiContainer class="flex items-center justify-between gap-4 py-3 md:py-4">
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :aria-label="$t('header.logoLabel', { name: brand.name })"
      >
        <img
          v-show="hasLogo"
          :src="brand.logo"
          :alt="brand.name"
          class="h-24 w-auto sm:h-28 md:h-32 lg:h-36"
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
        class="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors motion-reduce:transition-none hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
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
      <div v-if="isMenuOpen" class="fixed inset-0 z-40 md:hidden" role="presentation">
        <div class="absolute inset-0 bg-neutral-900/50" aria-hidden="true" @click="closeMenu" />
        <div
          id="mobile-menu"
          ref="mobileMenuRef"
          role="dialog"
          :aria-label="$t('header.mobileNavigation')"
          class="absolute end-0 top-0 flex h-full w-full max-w-xs flex-col gap-6 bg-background p-6 shadow-lg"
        >
          <div class="flex items-center justify-between">
            <img v-if="hasLogo" :src="brand.logo" :alt="brand.name" class="h-20 w-auto" />
            <span v-else class="font-display text-lg font-semibold tracking-wide text-foreground">
              {{ brand.name }}
            </span>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-2 text-foreground transition-colors motion-reduce:transition-none hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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

          <LayoutTheNavigation orientation="vertical" />
          <LayoutLanguageSwitcher />
        </div>
      </div>
    </Teleport>
  </header>
</template>
