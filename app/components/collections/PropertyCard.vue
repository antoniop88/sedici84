<script setup lang="ts">
import { getLocalizedValue, type PropertyItem } from '../../../config/collections'
import { IMAGE_SIZES } from '~/utils/imageSizes'

const props = defineProps<{
  item: PropertyItem
  locale: string
  to: string
}>()

const title = computed(() => getLocalizedValue(props.item.title, props.locale as 'it' | 'en'))
const city = computed(() => getLocalizedValue(props.item.address.city, props.locale as 'it' | 'en'))
const propertyType = computed(() =>
  getLocalizedValue(props.item.propertyType, props.locale as 'it' | 'en'),
)

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <article
    class="overflow-hidden rounded-lg border border-neutral-200 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring has-[a:focus-visible]:ring-offset-2 has-[a:focus-visible]:ring-offset-background"
  >
    <NuxtLink :to="to" class="group block focus-visible:outline-none">
      <NuxtImg
        :src="item.images[0]"
        :alt="title"
        :sizes="IMAGE_SIZES.gridCard"
        width="400"
        height="300"
        format="avif,webp"
        loading="lazy"
        decoding="async"
        class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div class="p-5">
        <p class="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {{ propertyType }} · {{ city }}
        </p>
        <h2 class="mt-1 font-display text-lg font-semibold text-foreground">{{ title }}</h2>
        <p class="mt-2 text-sm font-semibold text-foreground">
          {{ formatPrice(item.price, item.currency) }}
        </p>
        <p v-if="item.sqm" class="mt-1 text-xs text-muted-foreground">
          {{ item.sqm }} m²
          <span v-if="item.rooms"> · {{ item.rooms }} {{ $t('properties.rooms') }}</span>
        </p>
      </div>
    </NuxtLink>
  </article>
</template>
