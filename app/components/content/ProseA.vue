<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { isExternalUrl } from '~/utils/isExternalUrl'

const props = defineProps<{
  href?: string
}>()

const attrs = useAttrs()

const isExternal = computed(() => (props.href ? isExternalUrl(props.href) : false))
</script>

<template>
  <a
    :href="props.href"
    v-bind="attrs"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <slot />
    <span v-if="isExternal" class="sr-only">{{ $t('content.externalLink') }}</span>
  </a>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
