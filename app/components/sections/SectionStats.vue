<script setup lang="ts">
import type { StatsSection } from '~/types/sections'

const props = defineProps<StatsSection>()
const titleId = useId()

// Only real figures are set large; worded values read as plain lines.
const isFigure = (value: string) => /^\d/.test(value)
const figures = computed(() => props.items.filter((item) => isFigure(item.value)))
const facts = computed(() => props.items.filter((item) => !isFigure(item.value)))
</script>

<template>
  <section
    class="bg-primary-950 py-12 text-primary-foreground md:py-16"
    :aria-labelledby="props.title ? titleId : undefined"
  >
    <UiContainer>
      <div :class="props.image ? 'grid items-start gap-10 md:grid-cols-[7fr_5fr] md:gap-14' : ''">
        <NuxtImg
          v-if="props.image"
          :src="props.image"
          alt=""
          width="600"
          height="750"
          sizes="100vw md:40vw"
          loading="lazy"
          decoding="async"
          class="order-last aspect-[4/5] w-full rounded-lg object-cover"
        />
        <div>
          <h2
            v-if="props.title"
            :id="titleId"
            class="font-display text-3xl leading-tight text-primary-foreground md:text-5xl"
          >
            {{ props.title }}
          </h2>
          <div class="mt-4 h-px w-16 bg-accent" aria-hidden="true" />

          <dl v-if="figures.length" class="mt-10 grid grid-cols-2 gap-8">
            <div v-for="item in figures" :key="item.value" class="flex flex-col-reverse">
              <dt class="mt-3 text-sm uppercase tracking-[0.12em] text-primary-200">
                {{ item.label }}
              </dt>
              <dd class="font-display text-3xl leading-none text-accent md:text-5xl">
                {{ item.value }}
              </dd>
            </div>
          </dl>

          <dl v-if="facts.length" class="mt-10 grid gap-6 sm:grid-cols-2">
            <div v-for="item in facts" :key="item.value" class="border-t border-white/15 pt-5">
              <dt class="font-display text-2xl text-primary-foreground">{{ item.value }}</dt>
              <dd class="mt-1 text-base text-primary-200">{{ item.label }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
