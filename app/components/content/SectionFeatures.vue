<script setup lang="ts">
import type { FeaturesSection } from '~/types/sections'

defineProps<FeaturesSection>()
</script>

<template>
  <SectionsSectionFeatures v-bind="$props" />
</template>
