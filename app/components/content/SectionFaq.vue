<script setup lang="ts">
import type { FaqSection } from '~/types/sections'

defineProps<FaqSection>()
</script>

<template>
  <SectionsSectionFaq v-bind="$props" />
</template>
