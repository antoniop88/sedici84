<script setup lang="ts">
import type { HeroSection } from '~/types/sections'
import { IMAGE_SIZES } from '~/utils/imageSizes'

const props = withDefaults(defineProps<HeroSection & { priority?: boolean }>(), {
  priority: false,
})

const localePath = useLocalePath()
const { t } = useI18n()

// IPX doesn't optimize SVGs — render placeholder SVGs directly, optimize raster photos.
const isSvg = computed(() => props.image?.toLowerCase().endsWith('.svg') ?? false)

const isFull = computed(() => props.layout === 'full')
const isLogoImage = computed(() => props.imageVariant === 'logo')

// --- Full-bleed carousel: only the photos rotate, the copy stays fixed -----
const slides = computed<string[]>(() => {
  if (props.images?.length) return props.images
  if (props.image) return [props.image]
  return []
})

const active = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function go(index: number) {
  const count = slides.value.length
  if (!count) return
  active.value = (index + count) % count
}
function next() {
  go(active.value + 1)
}
function prev() {
  go(active.value - 1)
}

onMounted(() => {
  if (!isFull.value || slides.value.length <= 1) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    if (!paused.value) next()
  }, 6000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <!-- Full-bleed carousel hero -->
  <section
    v-if="isFull"
    data-no-reveal
    class="relative flex min-h-[78vh] items-end overflow-hidden bg-primary-950"
    aria-labelledby="hero-title"
    aria-roledescription="carousel"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
  >
    <div class="absolute inset-0" aria-hidden="true">
      <img
        v-for="(slide, index) in slides"
        :key="slide"
        :src="slide"
        alt=""
        :loading="index === 0 && priority ? 'eager' : 'lazy'"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
        :class="index === active ? 'opacity-100' : 'opacity-0'"
      />
      <div
        class="absolute inset-0 bg-gradient-to-t from-primary-950/90 via-primary-950/70 to-primary-950/35 md:bg-gradient-to-l md:from-primary-950/90 md:via-primary-950/70 md:to-primary-950/25"
      />
    </div>

    <UiContainer class="relative z-10 w-full pb-12 pt-16 md:pb-16 md:pt-24">
      <div class="ms-auto max-w-2xl text-end">
        <p
          v-if="props.eyebrow"
          class="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-primary-200"
        >
          {{ props.eyebrow }}
        </p>
        <div class="space-y-6">
          <h1
            id="hero-title"
            class="font-display text-[2.75rem] leading-[1.04] text-[#F7F3EC] md:text-6xl lg:text-7xl"
          >
            {{ props.title }}
          </h1>
          <p v-if="props.subtitle" class="ms-auto max-w-xl text-lg leading-relaxed text-[#EDE6D9]">
            {{ props.subtitle }}
          </p>
        </div>
        <div v-if="props.cta" class="flex justify-end pt-8">
          <UiButton
            :to="localePath(props.cta.to)"
            class="!bg-[#F2EAE0] !px-6 !py-3 !text-foreground hover:!bg-white"
          >
            {{ props.cta.label }}
          </UiButton>
        </div>
        <div
          v-if="slides.length > 1"
          class="mt-8 flex items-center justify-end gap-1 text-[#F2EAE0]"
          role="group"
          :aria-label="t('gallery.controls')"
        >
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
            :aria-label="t('gallery.prev')"
            @click="prev"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            v-for="(slide, index) in slides"
            :key="slide"
            type="button"
            class="group inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :aria-label="t('gallery.counter', { current: index + 1, total: slides.length })"
            :aria-current="index === active ? 'true' : undefined"
            @click="go(index)"
          >
            <span
              class="block h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
              :class="
                index === active ? 'w-8 bg-[#F2EAE0]' : 'w-2.5 bg-white/40 group-hover:bg-white/70'
              "
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            class="inline-flex size-11 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
            :aria-label="t('gallery.next')"
            @click="next"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </UiContainer>
  </section>

  <!-- Split hero (default) -->
  <section v-else data-no-reveal class="py-16 md:py-24" aria-labelledby="hero-title">
    <UiContainer>
      <div class="grid items-start gap-10 md:grid-cols-2">
        <div class="space-y-6">
          <p
            v-if="props.eyebrow"
            class="text-sm font-medium uppercase tracking-[0.2em] text-accent-ink"
          >
            {{ props.eyebrow }}
          </p>
          <h1
            id="hero-title"
            class="font-display text-4xl leading-[1.1] text-foreground md:text-5xl lg:text-6xl"
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
        <div
          v-if="props.image"
          :class="isLogoImage ? 'flex items-center justify-center' : 'overflow-hidden rounded-lg'"
        >
          <img
            v-if="isSvg || isLogoImage"
            :src="props.image"
            :alt="props.title"
            width="640"
            height="480"
            :loading="props.priority ? 'eager' : 'lazy'"
            decoding="async"
            :class="
              isLogoImage
                ? 'mx-auto h-auto w-full max-w-xs object-contain sm:max-w-sm md:max-w-md'
                : 'aspect-[4/5] w-full rounded-lg object-cover'
            "
          />
          <NuxtPicture
            v-else
            :src="props.image"
            :alt="props.title"
            :sizes="IMAGE_SIZES.hero"
            format="avif,webp"
            width="640"
            height="800"
            :priority="props.priority"
            :preload="props.priority"
            :loading="props.priority ? 'eager' : 'lazy'"
            decoding="async"
            class="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </UiContainer>
  </section>
</template>
