<script setup lang="ts">
import type { FaqSection } from '~/types/sections'

const props = defineProps<FaqSection>()
const titleId = useId()
</script>

<template>
  <section class="py-16 md:py-20" :aria-labelledby="props.title ? titleId : undefined">
    <UiContainer>
      <h2
        v-if="props.title"
        :id="titleId"
        class="mb-8 font-display text-2xl leading-tight text-foreground md:text-3xl"
      >
        {{ props.title }}
      </h2>
      <div
        class="mx-auto max-w-3xl divide-y divide-neutral-200 rounded-lg border border-neutral-200"
      >
        <details v-for="(item, index) in props.items" :key="index" class="group px-6 py-4">
          <summary
            class="cursor-pointer list-none font-medium text-foreground marker:content-none [&::-webkit-details-marker]:hidden"
          >
            <span class="flex items-center justify-between gap-4">
              {{ item.question }}
              <span
                class="shrink-0 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
                aria-hidden="true"
              >
                ▾
              </span>
            </span>
          </summary>
          <p class="mt-3 text-base leading-relaxed text-muted-foreground">
            {{ item.answer }}
          </p>
        </details>
      </div>
    </UiContainer>
  </section>
</template>
