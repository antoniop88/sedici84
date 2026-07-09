<script setup lang="ts">
import type { StatsSection } from '~/types/sections'

const props = defineProps<StatsSection>()
const titleId = useId()
</script>

<template>
  <section class="py-16 md:py-24" :aria-labelledby="props.title ? titleId : undefined">
    <UiContainer>
      <div v-if="props.title" class="mb-12 text-center">
        <h2 :id="titleId" class="font-display text-2xl leading-tight text-foreground md:text-3xl">
          {{ props.title }}
        </h2>
        <div class="mx-auto mt-4 h-px w-16 bg-accent" aria-hidden="true" />
      </div>
      <dl class="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
        <div
          v-for="(item, index) in props.items"
          :key="index"
          class="relative text-center lg:not-last:after:absolute lg:not-last:after:end-0 lg:not-last:after:top-1/2 lg:not-last:after:h-16 lg:not-last:after:w-px lg:not-last:after:-translate-y-1/2 lg:not-last:after:bg-neutral-200"
        >
          <dt class="font-display text-4xl leading-none text-primary-700 md:text-5xl">
            {{ item.value }}
          </dt>
          <dd
            class="mx-auto mt-3 max-w-[16ch] text-sm uppercase tracking-[0.12em] text-muted-foreground"
          >
            {{ item.label }}
          </dd>
        </div>
      </dl>
    </UiContainer>
  </section>
</template>
