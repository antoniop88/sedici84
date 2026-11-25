<script setup lang="ts">
import type { CtaSection } from '~/types/sections'

const props = defineProps<CtaSection>()
const localePath = useLocalePath()
const titleId = useId()
</script>

<template>
  <section
    class="bg-primary-950 py-12 text-center text-primary-foreground md:py-16"
    :aria-labelledby="titleId"
  >
    <UiContainer>
      <div>
        <div class="mx-auto mb-6 h-px w-16 bg-accent" aria-hidden="true" />
        <h2 :id="titleId" class="font-display text-3xl leading-tight md:text-5xl">
          {{ props.title }}
        </h2>
        <p
          v-if="props.description"
          class="mx-auto mt-4 max-w-prose text-base leading-relaxed opacity-90"
        >
          {{ props.description }}
        </p>
        <div class="mt-8">
          <UiButton
            :to="localePath(props.button.to)"
            variant="secondary"
            class="!bg-background !text-foreground hover:!bg-neutral-100"
          >
            {{ props.button.label }}
          </UiButton>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
