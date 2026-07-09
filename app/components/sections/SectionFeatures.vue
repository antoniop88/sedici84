<script setup lang="ts">
import type { FeaturesSection } from '~/types/sections'

const props = defineProps<FeaturesSection>()
const titleId = useId()
</script>

<template>
  <section class="bg-white py-16 md:py-24" :aria-labelledby="props.title ? titleId : undefined">
    <UiContainer>
      <div v-if="props.title" class="mb-12 text-center">
        <h2 :id="titleId" class="font-display text-2xl leading-tight text-foreground md:text-3xl">
          {{ props.title }}
        </h2>
        <div class="mx-auto mt-4 h-px w-16 bg-accent" aria-hidden="true" />
      </div>
      <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" role="list">
        <li
          v-for="(item, index) in props.items"
          :key="index"
          class="group relative rounded-lg border border-neutral-200 bg-background p-6 transition-colors motion-reduce:transition-none hover:border-accent"
        >
          <span
            class="mb-4 block h-px w-8 bg-accent transition-all duration-300 group-hover:w-12 motion-reduce:transition-none"
            aria-hidden="true"
          />
          <h3 class="mb-2 font-display text-lg font-semibold text-foreground">
            {{ item.title }}
          </h3>
          <p class="text-base leading-relaxed text-muted-foreground">
            {{ item.description }}
          </p>
        </li>
      </ul>
    </UiContainer>
  </section>
</template>
