<script setup lang="ts">
import type { HeroSection } from '~/types/sections'

defineProps<HeroSection>()
</script>

<template>
  <SectionsSectionHero v-bind="$props" />
</template>
