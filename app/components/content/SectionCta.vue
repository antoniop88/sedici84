<script setup lang="ts">
import type { CtaSection } from '~/types/sections'

defineProps<CtaSection>()
</script>

<template>
  <SectionsSectionCta v-bind="$props" />
</template>
