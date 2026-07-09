<script setup lang="ts">
import type { HeroSection, HeroSlide } from '~/types/sections'
import { IMAGE_SIZES } from '~/utils/imageSizes'

type NormalizedSlide = {
  image: string
  title: string
  subtitle?: string
}

const props = withDefaults(defineProps<HeroSection & { priority?: boolean }>(), {
  priority: false,
})

const localePath = useLocalePath()
const { t } = useI18n()

// IPX doesn't optimize SVGs — render placeholder SVGs directly, optimize raster photos.
const isSvg = computed(() => props.image?.toLowerCase().endsWith('.svg') ?? false)

const isFull = computed(() => props.layout === 'full')

function normalizeSlide(slide: HeroSlide): NormalizedSlide {
  return {
    image: slide.image,
    title: slide.title ?? props.title,
    subtitle: slide.subtitle ?? props.subtitle,
  }
}

// --- Full-bleed carousel ----------------------------------------------------
const slides = computed<NormalizedSlide[]>(() => {
  if (props.slides?.length) return props.slides.map(normalizeSlide)
  if (props.images?.length) {
    return props.images.map((image) => ({
      image,
      title: props.title,
      subtitle: props.subtitle,
    }))
  }
  if (props.image) {
    return [{ image: props.image, title: props.title, subtitle: props.subtitle }]
  }
  return []
})

const active = ref(0)
const paused = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

const activeSlide = computed(() => slides.value[active.value] ?? slides.value[0])

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
        :key="slide.image"
        :src="slide.image"
        alt=""
        :loading="index === 0 && priority ? 'eager' : 'lazy'"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none"
        :class="index === active ? 'opacity-100' : 'opacity-0'"
      />
      <div
        class="absolute inset-0 bg-gradient-to-bl from-primary-950/85 via-primary-950/50 to-primary-950/20"
      />
    </div>

    <UiContainer class="relative z-10 w-full pb-24 pt-20 md:pb-32 md:pt-24">
      <div class="ms-auto max-w-2xl text-end">
        <p
          v-if="props.eyebrow"
          class="mb-6 text-sm font-medium uppercase tracking-[0.25em] text-primary-200"
        >
          {{ props.eyebrow }}
        </p>
        <div class="relative min-h-[10.5rem] md:min-h-[13rem] lg:min-h-[15rem]" aria-live="polite">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-700 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-500 ease-in motion-reduce:transition-none"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div v-if="activeSlide" :key="active" class="space-y-6">
              <h1
                id="hero-title"
                class="font-display text-4xl leading-[1.08] text-[#F7F3EC] md:text-6xl lg:text-7xl"
              >
                {{ activeSlide.title }}
              </h1>
              <p
                v-if="activeSlide.subtitle"
                class="ms-auto max-w-xl text-lg leading-relaxed text-[#EDE6D9]"
              >
                {{ activeSlide.subtitle }}
              </p>
            </div>
          </Transition>
        </div>
        <div v-if="props.cta" class="flex justify-end pt-2">
          <UiButton
            :to="localePath(props.cta.to)"
            class="!bg-[#F2EAE0] !px-6 !py-3 !text-foreground hover:!bg-white"
          >
            {{ props.cta.label }}
          </UiButton>
        </div>
      </div>
    </UiContainer>

    <!-- Controls -->
    <div
      v-if="slides.length > 1"
      class="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-3"
    >
      <button
        v-for="(slide, index) in slides"
        :key="slide.image"
        type="button"
        class="h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
        :class="index === active ? 'w-8 bg-[#F2EAE0]' : 'w-2.5 bg-white/40 hover:bg-white/70'"
        :aria-label="t('gallery.counter', { current: index + 1, total: slides.length })"
        :aria-current="index === active ? 'true' : undefined"
        @click="go(index)"
      />
    </div>
    <button
      v-if="slides.length > 1"
      type="button"
      class="absolute start-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[#F2EAE0] backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:inline-flex"
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
        class="size-6"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
    <button
      v-if="slides.length > 1"
      type="button"
      class="absolute end-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-[#F2EAE0] backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:inline-flex"
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
        class="size-6"
        aria-hidden="true"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
  </section>

  <!-- Split hero (default) -->
  <section v-else class="py-16 md:py-24" aria-labelledby="hero-title">
    <UiContainer>
      <div class="grid items-center gap-10 md:grid-cols-2">
        <div class="space-y-6">
          <p
            v-if="props.eyebrow"
            class="text-sm font-medium uppercase tracking-[0.2em] text-accent"
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
          class="overflow-hidden rounded-xl border border-primary-200 bg-muted p-2"
        >
          <img
            v-if="isSvg"
            :src="props.image"
            :alt="props.title"
            width="640"
            height="480"
            :loading="props.priority ? 'eager' : 'lazy'"
            decoding="async"
            class="aspect-[4/3] w-full rounded-lg object-cover"
          />
          <NuxtPicture
            v-else
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
            class="aspect-[4/3] w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </UiContainer>
  </section>
</template>
