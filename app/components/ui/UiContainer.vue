<script setup lang="ts">
import type { Component } from 'vue'

type ContainerTag = 'section' | 'div' | 'main' | 'article'

const props = withDefaults(
  defineProps<{
    as?: ContainerTag
  }>(),
  {
    as: 'section',
  },
)

const tag = computed(() => props.as as ContainerTag | Component)
</script>

<template>
  <component
    :is="tag"
    class="mx-auto w-full max-w-(--spacing-container-max) px-(--spacing-container-x)"
  >
    <slot />
  </component>
</template>
