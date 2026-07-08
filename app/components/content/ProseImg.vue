<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { IMAGE_SIZES } from '~/utils/imageSizes'

const props = defineProps<{
  src?: string
  alt?: string
}>()

const attrs = useAttrs()

const altText = computed(() => props.alt ?? '')
</script>

<template>
  <NuxtImg
    v-if="props.src"
    :src="props.src"
    :alt="altText"
    :sizes="IMAGE_SIZES.prose"
    width="672"
    height="378"
    loading="lazy"
    decoding="async"
    v-bind="attrs"
    class="my-6 max-w-full rounded-lg"
  />
</template>
