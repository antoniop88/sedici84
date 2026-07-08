<script setup lang="ts">
import type { TestimonialsSection } from '~/types/sections'

defineProps<TestimonialsSection>()
</script>

<template>
  <SectionsSectionTestimonials v-bind="$props" />
</template>
