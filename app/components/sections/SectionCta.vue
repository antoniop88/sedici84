<script setup lang="ts">
import type { CtaSection } from '~/types/sections'

const props = defineProps<CtaSection>()
const localePath = useLocalePath()
const titleId = useId()
</script>

<template>
  <!-- Close: the head row and the main action beside a photograph not used above -->
  <section class="border-t border-neutral-200 py-12 md:py-16" :aria-labelledby="titleId">
    <UiContainer>
      <div
        class="grid items-center gap-10"
        :class="props.image ? 'md:grid-cols-[7fr_5fr] md:gap-14' : ''"
      >
        <div>
          <h2
            :id="titleId"
            class="font-display text-4xl leading-[1.05] text-foreground md:text-6xl"
          >
            {{ props.title }}
          </h2>
          <p
            v-if="props.description"
            class="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {{ props.description }}
          </p>
          <div class="mt-8">
            <UiButton :to="localePath(props.button.to)" variant="primary" class="px-6 py-3">
              {{ props.button.label }}
            </UiButton>
          </div>
        </div>
        <NuxtImg
          v-if="props.image"
          :src="props.image"
          alt=""
          width="600"
          height="600"
          sizes="100vw md:40vw"
          loading="lazy"
          decoding="async"
          class="aspect-square w-full rounded-lg object-cover"
        />
      </div>
    </UiContainer>
  </section>
</template>
