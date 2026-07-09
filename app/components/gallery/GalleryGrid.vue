<script setup lang="ts">
import type { GalleryCategory, GalleryImage } from '~/types/content'

const props = defineProps<{
  images: GalleryImage[]
  categories?: GalleryCategory[]
}>()

const { t } = useI18n()

const activeCategory = ref('all')

const categories = computed<GalleryCategory[]>(() => {
  if (props.categories?.length) return props.categories
  return [{ key: 'all', label: t('collections.title') }]
})

const filtered = computed<GalleryImage[]>(() => {
  if (activeCategory.value === 'all') return props.images
  return props.images.filter((image) => image.category === activeCategory.value)
})

// Reset the open image whenever the filter changes to avoid dangling indices.
watch(activeCategory, () => {
  lightboxIndex.value = null
})

// --- Lightbox ---------------------------------------------------------------
const lightboxIndex = ref<number | null>(null)
const dialogRef = ref<HTMLElement | null>(null)
const isOpen = computed(() => lightboxIndex.value !== null)

const currentImage = computed<GalleryImage | null>(() =>
  lightboxIndex.value === null ? null : (filtered.value[lightboxIndex.value] ?? null),
)

function open(index: number) {
  lightboxIndex.value = index
}

function close() {
  lightboxIndex.value = null
}

function prev() {
  if (lightboxIndex.value === null) return
  const count = filtered.value.length
  lightboxIndex.value = (lightboxIndex.value - 1 + count) % count
}

function next() {
  if (lightboxIndex.value === null) return
  const count = filtered.value.length
  lightboxIndex.value = (lightboxIndex.value + 1) % count
}

// Escape + focus trap handled by the composable; arrows handled here.
useFocusTrap(dialogRef, isOpen, close)

function onArrowKeys(event: KeyboardEvent) {
  if (!isOpen.value) return
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  }
}

onMounted(() => window.addEventListener('keydown', onArrowKeys))
onUnmounted(() => window.removeEventListener('keydown', onArrowKeys))
</script>

<template>
  <div>
    <div
      v-if="categories.length > 1"
      class="mb-10 flex flex-wrap gap-2"
      role="group"
      :aria-label="t('collections.title')"
    >
      <button
        v-for="category in categories"
        :key="category.key"
        type="button"
        class="rounded-full border px-4 py-1.5 text-sm tracking-wide transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        :class="
          activeCategory === category.key
            ? 'border-primary bg-primary text-primary-foreground'
            : 'border-neutral-300 text-muted-foreground hover:border-primary hover:text-foreground'
        "
        :aria-pressed="activeCategory === category.key"
        @click="activeCategory = category.key"
      >
        {{ category.label }}
      </button>
    </div>

    <p v-if="!filtered.length" class="py-16 text-center text-muted-foreground">
      {{ t('gallery.empty') }}
    </p>

    <ul v-else class="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5" role="list">
      <li v-for="(image, index) in filtered" :key="image.src" class="break-inside-avoid">
        <button
          type="button"
          class="group block w-full overflow-hidden rounded-lg border border-neutral-200 bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          :aria-label="`${t('gallery.open')} — ${image.alt}`"
          @click="open(index)"
        >
          <img
            :src="image.src"
            :alt="image.alt"
            loading="lazy"
            decoding="async"
            class="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </button>
      </li>
    </ul>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="dialogRef"
        role="dialog"
        aria-modal="true"
        :aria-label="currentImage?.alt"
        class="fixed inset-0 z-50 flex flex-col bg-primary-950/90 p-4 backdrop-blur-sm sm:p-8"
      >
        <div class="flex items-center justify-between text-primary-100">
          <span class="text-sm tracking-wide">
            {{
              t('gallery.counter', { current: (lightboxIndex ?? 0) + 1, total: filtered.length })
            }}
          </span>
          <button
            type="button"
            class="inline-flex size-10 items-center justify-center rounded-full text-primary-100 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :aria-label="t('gallery.close')"
            @click="close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              class="size-6"
              aria-hidden="true"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          </button>
        </div>

        <div class="relative flex flex-1 items-center justify-center overflow-hidden">
          <button
            v-if="filtered.length > 1"
            type="button"
            class="absolute start-0 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-primary-100 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :aria-label="t('gallery.prev')"
            @click="prev"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-6"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <img
            v-if="currentImage"
            :key="currentImage.src"
            :src="currentImage.src"
            :alt="currentImage.alt"
            class="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />

          <button
            v-if="filtered.length > 1"
            type="button"
            class="absolute end-0 z-10 inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-primary-100 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            :aria-label="t('gallery.next')"
            @click="next"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-6"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <p v-if="currentImage" class="mt-4 text-center text-sm text-primary-100">
          {{ currentImage.alt }}
        </p>
      </div>
    </Teleport>
  </div>
</template>
