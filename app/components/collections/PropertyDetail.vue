<script setup lang="ts">
import { getLocalizedValue, type PropertyItem } from '../../../config/collections'

const props = defineProps<{
  item: PropertyItem
  locale: string
}>()

const title = computed(() => getLocalizedValue(props.item.title, props.locale as 'it' | 'en'))
const description = computed(() =>
  getLocalizedValue(props.item.description, props.locale as 'it' | 'en'),
)
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
  <div class="space-y-8">
    <CollectionsPropertyGallery :images="item.images" :alt="title" />

    <header class="space-y-4">
      <p class="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {{ propertyType }} · {{ city }}
      </p>
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ title }}
      </h1>
      <p class="max-w-prose text-lg text-muted-foreground">{{ description }}</p>

      <dl class="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div>
          <dt class="inline font-medium text-foreground">{{ $t('properties.price') }}:</dt>
          <dd class="inline ml-1 font-semibold text-foreground">
            {{ formatPrice(item.price, item.currency) }}
          </dd>
        </div>
        <div v-if="item.sqm">
          <dt class="inline font-medium text-foreground">{{ $t('properties.sqm') }}:</dt>
          <dd class="inline ml-1">{{ item.sqm }} m²</dd>
        </div>
        <div v-if="item.rooms">
          <dt class="inline font-medium text-foreground">{{ $t('properties.rooms') }}:</dt>
          <dd class="inline ml-1">{{ item.rooms }}</dd>
        </div>
        <div v-if="item.bathrooms">
          <dt class="inline font-medium text-foreground">{{ $t('properties.bathrooms') }}:</dt>
          <dd class="inline ml-1">{{ item.bathrooms }}</dd>
        </div>
      </dl>

      <ul v-if="item.features?.length" class="flex flex-wrap gap-2" role="list">
        <li
          v-for="(feature, index) in item.features"
          :key="index"
          class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
        >
          {{ getLocalizedValue(feature, locale as 'it' | 'en') }}
        </li>
      </ul>
    </header>
  </div>
</template>
