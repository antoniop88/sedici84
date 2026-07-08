<script setup lang="ts">
import type { Section } from '~/types/sections'

defineProps<{
  sections: Section[]
}>()
</script>

<template>
  <div>
    <template v-for="(section, index) in sections" :key="index">
      <SectionsSectionHero
        v-if="section.type === 'hero'"
        v-bind="section"
        :priority="index === 0 && !!section.image"
      />
      <SectionsSectionFeatures v-else-if="section.type === 'features'" v-bind="section" />
      <SectionsSectionCta v-else-if="section.type === 'cta'" v-bind="section" />
      <SectionsSectionFaq v-else-if="section.type === 'faq'" v-bind="section" />
      <SectionsSectionTestimonials v-else-if="section.type === 'testimonials'" v-bind="section" />
    </template>
  </div>
</template>
