<script setup lang="ts">
import type { SiteNavItem } from '../../../config/site'

const localePath = useLocalePath()
const route = useRoute()
const { brand, navigation } = useAppConfig()

const isMenuOpen = ref(false)
const hasLogo = ref(true)
const menuButtonRef = ref<HTMLButtonElement | null>(null)
const mobileMenuRef = ref<HTMLElement | null>(null)
let previousOverflow = ''

// Desktop: the logo already links home and Contatti is the button on the right.
const desktopItems = computed(() =>
  navigation.filter((item) => item.to !== '/' && item.to !== '/contatti'),
)

function isActive(item: SiteNavItem): boolean {
  const path = localePath(item.to)
  return route.path === path || route.path.startsWith(`${path}/`)
}

// --- Dropdown panel (one word opens a flat full-width panel) ---------------
const openPanel = ref<string | null>(null)
const panelButtonRefs = ref<Record<string, HTMLButtonElement | null>>({})
let hoverTimer: ReturnType<typeof setTimeout> | undefined

const activePanelItem = computed(() =>
  desktopItems.value.find((item) => item.labelKey === openPanel.value),
)

function showPanel(key: string, delay = 0) {
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    openPanel.value = key
  }, delay)
}

function hidePanel(delay = 0) {
  clearTimeout(hoverTimer)
  hoverTimer = setTimeout(() => {
    openPanel.value = null
  }, delay)
}

function togglePanel(key: string) {
  clearTimeout(hoverTimer)
  openPanel.value = openPanel.value === key ? null : key
}

function closePanelAndFocus() {
  const key = openPanel.value
  if (!key) return
  openPanel.value = null
  nextTick(() => panelButtonRefs.value[key]?.focus())
}

function handleHeaderFocusOut(event: FocusEvent) {
  const header = event.currentTarget as HTMLElement
  if (!header.contains(event.relatedTarget as Node | null)) openPanel.value = null
}

// --- Mobile sheet ------------------------------------------------------------
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
  if (isMenuOpen.value) closeMenu()
  else openMenu()
}

useFocusTrap(mobileMenuRef, isMenuOpen, closeMenu)

onUnmounted(() => {
  clearTimeout(hoverTimer)
  document.documentElement.style.overflow = previousOverflow
})

watch(
  () => route.fullPath,
  () => {
    openPanel.value = null
    if (isMenuOpen.value) closeMenu()
  },
)

const desktopLinkClass =
  'relative inline-flex min-h-11 items-center gap-1.5 rounded-sm px-3 text-sm uppercase tracking-[0.14em] transition-colors motion-reduce:transition-none after:absolute after:inset-x-3 after:bottom-1.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 motion-reduce:after:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-neutral-200 bg-background"
    @keydown.esc="closePanelAndFocus"
    @focusout="handleHeaderFocusOut"
    @mouseleave="hidePanel(200)"
  >
    <UiContainer
      class="flex items-center justify-between gap-4 py-3 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:py-4"
    >
      <!-- Words on the left (desktop) -->
      <nav class="hidden lg:block" :aria-label="$t('header.mainNavigation')">
        <ul class="-ms-3 flex items-center gap-1">
          <li v-for="item in desktopItems" :key="item.to">
            <button
              v-if="item.children?.length"
              :ref="(el) => (panelButtonRefs[item.labelKey] = el as HTMLButtonElement | null)"
              type="button"
              :class="[
                desktopLinkClass,
                isActive(item) || openPanel === item.labelKey
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              :aria-expanded="openPanel === item.labelKey"
              :aria-controls="`nav-panel-${item.labelKey}`"
              @mouseenter="showPanel(item.labelKey, 150)"
              @click="togglePanel(item.labelKey)"
            >
              {{ $t(item.labelKey) }}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="size-3.5 transition-transform duration-200 motion-reduce:transition-none"
                :class="openPanel === item.labelKey ? 'rotate-180' : ''"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <NuxtLink
              v-else
              :to="localePath(item.to)"
              :aria-current="isActive(item) ? 'page' : undefined"
              :class="[
                desktopLinkClass,
                isActive(item)
                  ? 'text-foreground after:scale-x-100'
                  : 'text-muted-foreground hover:text-foreground',
              ]"
              @mouseenter="hidePanel(150)"
            >
              {{ $t(item.labelKey) }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Logo in the centre (left on smaller screens) -->
      <NuxtLink
        :to="localePath('/')"
        class="inline-flex items-center justify-self-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :aria-label="$t('header.logoLabel', { name: brand.name })"
      >
        <img
          v-show="hasLogo"
          :src="brand.logo"
          :alt="brand.name"
          width="112"
          height="112"
          class="h-20 w-auto sm:h-24 lg:h-28"
          @error="hasLogo = false"
        />
        <span v-if="!hasLogo" class="font-display text-2xl text-foreground">
          {{ brand.name }}
        </span>
      </NuxtLink>

      <!-- Language and main action on the right -->
      <div class="flex items-center justify-end gap-3">
        <LayoutLanguageSwitcher class="hidden lg:flex" />
        <UiButton :to="localePath('/contatti')" variant="primary" class="hidden sm:inline-flex">
          {{ $t('header.cta') }}
        </UiButton>
        <button
          ref="menuButtonRef"
          type="button"
          class="inline-flex size-11 items-center justify-center rounded-md border border-neutral-300 text-foreground transition-colors hover:border-accent hover:bg-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none lg:hidden"
          :aria-expanded="isMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMenuOpen ? $t('header.closeMenu') : $t('header.openMenu')"
          @click="toggleMenu"
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
            <line x1="4" x2="20" y1="7" y2="7" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="17" y2="17" />
          </svg>
        </button>
      </div>
    </UiContainer>

    <!-- Dropdown panel: flat ground and a hairline, no shadow -->
    <div
      v-if="activePanelItem"
      :id="`nav-panel-${activePanelItem.labelKey}`"
      class="absolute inset-x-0 top-full hidden border-b border-neutral-200 bg-background lg:block"
      @mouseenter="showPanel(activePanelItem.labelKey)"
    >
      <UiContainer class="grid grid-cols-[1fr_2fr] gap-10 py-8">
        <div class="flex flex-col justify-between gap-6">
          <p class="font-display text-4xl leading-tight text-foreground">
            {{ $t(activePanelItem.labelKey) }}
          </p>
          <UiLink :to="localePath(activePanelItem.to)">{{ $t('nav.allCollections') }}</UiLink>
        </div>
        <ul class="grid grid-cols-2 gap-6">
          <li v-for="child in activePanelItem.children" :key="child.labelKey">
            <NuxtLink
              :to="localePath({ path: child.to, query: child.query })"
              class="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div class="overflow-hidden rounded-lg">
                <NuxtImg
                  v-if="child.image"
                  :src="child.image"
                  alt=""
                  width="480"
                  height="300"
                  sizes="400px"
                  class="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                />
              </div>
              <span
                class="mt-3 flex items-center justify-between font-display text-2xl text-foreground"
              >
                {{ $t(child.labelKey) }}
                <span
                  class="text-base text-accent-ink transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                  >→</span
                >
              </span>
            </NuxtLink>
          </li>
        </ul>
      </UiContainer>
    </div>

    <!-- Mobile: full-screen sheet -->
    <Teleport to="body">
      <div
        v-if="isMenuOpen"
        id="mobile-menu"
        ref="mobileMenuRef"
        role="dialog"
        aria-modal="true"
        :aria-label="$t('header.mobileNavigation')"
        class="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-primary-950 px-6 py-5 text-primary-foreground lg:hidden"
      >
        <div class="flex items-center justify-between border-b border-white/10 pb-5">
          <div class="rounded-md bg-background p-1.5">
            <img v-if="hasLogo" :src="brand.logo" :alt="brand.name" class="h-14 w-auto" />
          </div>
          <span v-if="!hasLogo" class="font-display text-2xl">{{ brand.name }}</span>
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-md border border-white/20 text-primary-100 transition-colors hover:border-accent hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none"
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

        <div class="flex-1 py-6">
          <LayoutTheNavigation orientation="vertical" tone="dark" />
        </div>

        <div class="space-y-5 border-t border-white/10 pt-5">
          <UiButton
            :to="localePath('/contatti')"
            variant="secondary"
            class="w-full justify-center !bg-background !text-foreground"
          >
            {{ $t('header.cta') }}
          </UiButton>
          <LayoutLanguageSwitcher tone="dark" />
        </div>
      </div>
    </Teleport>
  </header>
</template>
