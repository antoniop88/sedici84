<script setup lang="ts">
import type { TestimonialsSection } from '~/types/sections'

const props = defineProps<TestimonialsSection>()
const titleId = useId()
</script>

<template>
  <section class="py-16 md:py-20" :aria-labelledby="props.title ? titleId : undefined">
    <UiContainer>
      <h2
        v-if="props.title"
        :id="titleId"
        class="mb-10 font-display text-2xl leading-tight text-foreground md:text-3xl"
      >
        {{ props.title }}
      </h2>
      <ul class="grid gap-8 md:grid-cols-2" role="list">
        <li
          v-for="(item, index) in props.items"
          :key="index"
          class="rounded-lg border border-neutral-200 bg-muted p-6"
        >
          <figure>
            <blockquote class="text-base leading-relaxed text-foreground">
              <p>“{{ item.quote }}”</p>
            </blockquote>
            <figcaption class="mt-4 text-sm text-muted-foreground">
              <cite class="not-italic font-medium text-foreground">{{ item.author }}</cite>
              <span v-if="item.role"> — {{ item.role }}</span>
            </figcaption>
          </figure>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
