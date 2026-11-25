<script setup lang="ts">
import type { FeaturesSection } from '~/types/sections'

const props = defineProps<FeaturesSection>()
const titleId = useId()
</script>

<template>
  <section
    class="border-y border-neutral-200 bg-white py-12 md:py-16"
    :aria-labelledby="props.title ? titleId : undefined"
  >
    <UiContainer>
      <div :class="props.image ? 'grid items-center gap-10 md:grid-cols-[5fr_7fr] md:gap-14' : ''">
        <NuxtImg
          v-if="props.image"
          :src="props.image"
          alt=""
          width="600"
          height="750"
          sizes="100vw md:40vw"
          loading="lazy"
          decoding="async"
          class="order-last aspect-[4/5] w-full rounded-lg object-cover md:order-first"
        />
        <div>
          <div v-if="props.title" :class="props.image ? 'mb-10' : 'mb-12 text-center'">
            <h2
              :id="titleId"
              class="font-display text-2xl leading-tight text-foreground md:text-3xl"
            >
              {{ props.title }}
            </h2>
            <div
              class="mt-4 h-px w-16 bg-accent"
              :class="props.image ? '' : 'mx-auto'"
              aria-hidden="true"
            />
          </div>
          <ul
            class="grid gap-x-8 gap-y-8 sm:grid-cols-2"
            :class="props.image ? '' : 'lg:grid-cols-4'"
            role="list"
          >
            <li
              v-for="(item, index) in props.items"
              :key="index"
              class="border-t border-neutral-200 pt-5 transition-colors motion-reduce:transition-none hover:border-accent"
            >
              <h3 class="mb-2 font-display text-lg font-semibold text-foreground">
                {{ item.title }}
              </h3>
              <p class="text-base leading-relaxed text-muted-foreground">
                {{ item.description }}
              </p>
            </li>
          </ul>
        </div>
      </div>
    </UiContainer>
  </section>
</template>
