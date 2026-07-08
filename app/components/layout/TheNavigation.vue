<script setup lang="ts">
import type { SiteNavItem } from '../../../config/site'

const props = withDefaults(
  defineProps<{
    orientation?: 'horizontal' | 'vertical'
    ariaLabel?: string
  }>(),
  {
    orientation: 'horizontal',
    ariaLabel: undefined,
  },
)

const route = useRoute()
const localePath = useLocalePath()
const { navigation } = useAppConfig()

const linkClass =
  'rounded-sm px-3 py-2 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

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
            linkClass,
            isActive(item)
              ? 'font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
          @keydown="handleKeydown($event, index)"
        >
          {{ $t(item.labelKey) }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
