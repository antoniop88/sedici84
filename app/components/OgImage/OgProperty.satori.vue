<script setup lang="ts">
import { site } from '../../../config/site'

withDefaults(
  defineProps<{
    title?: string
    cover?: string
    price?: number
    currency?: string
    propertyType?: string
    siteName?: string
  }>(),
  {
    title: '',
    cover: '',
    price: 0,
    currency: 'EUR',
    propertyType: '',
    siteName: site.name,
  },
)

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}
</script>

<template>
  <div
    style="
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      width: 1200px;
      height: 630px;
      overflow: hidden;
      color: #ffffff;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    "
  >
    <img
      v-if="cover"
      :src="cover"
      width="1200"
      height="630"
      style="position: absolute; inset: 0; width: 1200px; height: 630px; object-fit: cover"
    />
    <div
      style="
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to top,
          rgba(15, 23, 42, 0.9) 0%,
          rgba(15, 23, 42, 0.4) 55%,
          rgba(15, 23, 42, 0.25) 100%
        );
      "
    />
    <div style="position: relative; z-index: 1; padding: 64px">
      <div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap">
        <div
          v-if="propertyType"
          style="
            padding: 8px 16px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.15);
            font-size: 20px;
            font-weight: 600;
          "
        >
          {{ propertyType }}
        </div>
        <div
          v-if="price"
          style="
            padding: 8px 16px;
            border-radius: 999px;
            background: rgba(74, 95, 193, 0.9);
            font-size: 20px;
            font-weight: 700;
          "
        >
          {{ formatPrice(price, currency) }}
        </div>
      </div>
      <div
        style="
          margin-bottom: 24px;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.92;
        "
      >
        {{ siteName }}
      </div>
      <h1
        style="
          margin: 0;
          max-width: 960px;
          font-size: 64px;
          font-weight: 800;
          line-height: 1.08;
          font-family: Inter, ui-sans-serif, system-ui, sans-serif;
        "
      >
        {{ title }}
      </h1>
    </div>
  </div>
</template>
