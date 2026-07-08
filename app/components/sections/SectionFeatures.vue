<script setup lang="ts">
import type { FeaturesSection } from '~/types/sections'

const props = defineProps<FeaturesSection>()
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
      <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list">
        <li
          v-for="(item, index) in props.items"
          :key="index"
          class="rounded-lg border border-neutral-200 bg-background p-6"
        >
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
