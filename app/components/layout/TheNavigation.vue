<script setup lang="ts">
import type { SiteNavItem } from '../../../config/site'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    ariaLabel?: string
    tone?: 'light' | 'dark'
  }>(),
  {
    orientation: 'horizontal',
    ariaLabel: undefined,
    tone: 'light',
  },
)

const route = useRoute()
const localePath = useLocalePath()
const { navigation } = useAppConfig()

const horizontalLinkClass =
  'relative rounded-sm px-3 py-2 text-sm uppercase tracking-[0.12em] transition-colors motion-reduce:transition-none after:absolute after:inset-x-3 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100 motion-reduce:after:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const verticalLinkClass =
  'group flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-2xl transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

function resolveNavPath(item: SiteNavItem): string {
  return item.to
}

function isActive(item: SiteNavItem): boolean {
  const localizedPath = localePath(resolveNavPath(item))
  if (resolveNavPath(item) === '/' || item.to === '/') {
    return route.path === localizedPath
  }
  return route.path === localizedPath || route.path.startsWith(`${localizedPath}/`)
}

function handleKeydown(event: KeyboardEvent, index: number) {
  const items = navigation
  const isHorizontal = props.orientation === 'horizontal'
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'

  if (event.key !== prevKey && event.key !== nextKey) return

  event.preventDefault()
  const direction = event.key === nextKey ? 1 : -1
  const nextIndex = (index + direction + items.length) % items.length
  const links = (event.currentTarget as HTMLElement)
    .closest('ul')
    ?.querySelectorAll<HTMLAnchorElement>('a[href]')
  links?.[nextIndex]?.focus()
}
</script>

<template>
  <nav :aria-label="ariaLabel ?? $t('header.mainNavigation')">
    <ul
      :class="
        orientation === 'horizontal' ? 'flex flex-wrap items-center gap-1' : 'flex flex-col gap-1'
      "
    >
      <li v-for="(item, index) in navigation" :key="item.to">
        <NuxtLink
          :to="localePath(resolveNavPath(item))"
          :aria-current="isActive(item) ? 'page' : undefined"
          :class="[
            orientation === 'horizontal' ? horizontalLinkClass : verticalLinkClass,
            tone === 'dark'
              ? isActive(item)
                ? 'text-primary-foreground'
                : 'text-primary-200 hover:text-primary-foreground'
              : isActive(item)
                ? 'text-foreground after:scale-x-100'
                : 'text-muted-foreground hover:text-foreground',
          ]"
          @keydown="handleKeydown($event, index)"
        >
          <span
            v-if="orientation === 'vertical'"
            class="font-sans text-xs tracking-[0.2em] text-accent"
            aria-hidden="true"
          >
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span>{{ $t(item.labelKey) }}</span>
        </NuxtLink>
        <ul
          v-if="orientation === 'vertical' && item.children?.length"
          class="flex flex-col border-b border-white/10 py-2 ps-9"
        >
          <li v-for="child in item.children" :key="child.labelKey">
            <NuxtLink
              :to="localePath({ path: child.to, query: child.query })"
              class="flex min-h-11 items-center text-lg text-primary-200 transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent motion-reduce:transition-none"
            >
              {{ $t(child.labelKey) }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>
