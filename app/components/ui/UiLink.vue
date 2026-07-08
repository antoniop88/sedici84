<script setup lang="ts">
import { isExternalUrl } from '~/utils/isExternalUrl'

const props = defineProps<{
  to: string
  forceExternal?: boolean
}>()

const isExternal = computed(() => {
  if (props.forceExternal) return true
  return isExternalUrl(props.to)
})

const linkClass =
  'rounded-sm text-primary underline-offset-4 transition-colors motion-reduce:transition-none hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
</script>

<template>
  <a v-if="isExternal" :href="to" target="_blank" rel="noopener noreferrer" :class="linkClass">
    <slot />
  </a>
  <NuxtLink v-else :to="to" :class="linkClass">
    <slot />
  </NuxtLink>
</template>
