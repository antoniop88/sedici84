<script setup lang="ts">
import type { HeroSection } from '~/types/sections'
import { IMAGE_SIZES } from '~/utils/imageSizes'

const props = withDefaults(defineProps<HeroSection & { priority?: boolean }>(), {
  priority: false,
})

const localePath = useLocalePath()
</script>

<template>
  <section class="py-16 md:py-24" aria-labelledby="hero-title">
    <UiContainer>
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div class="space-y-6">
          <h1
            id="hero-title"
            class="font-display text-3xl leading-tight text-foreground md:text-4xl lg:text-5xl"
          >
            {{ props.title }}
          </h1>
          <p
            v-if="props.subtitle"
            class="max-w-prose text-lg leading-relaxed text-muted-foreground"
          >
            {{ props.subtitle }}
          </p>
          <div v-if="props.cta">
            <UiButton :to="localePath(props.cta.to)" variant="primary">
              {{ props.cta.label }}
            </UiButton>
          </div>
        </div>
        <div v-if="props.image" class="overflow-hidden rounded-xl">
          <NuxtPicture
            :src="props.image"
            :alt="props.title"
            :sizes="IMAGE_SIZES.hero"
            format="avif,webp"
            width="640"
            height="480"
            :priority="props.priority"
            :preload="props.priority"
            :loading="props.priority ? 'eager' : 'lazy'"
            decoding="async"
            class="aspect-[4/3] w-full object-cover"
          />
        </div>
      </div>
    </UiContainer>
  </section>
</template>
