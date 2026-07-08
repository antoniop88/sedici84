<script setup lang="ts">
import { site } from '../../../config/site'

withDefaults(
  defineProps<{
    title?: string
    siteName?: string
  }>(),
  {
    title: '',
    siteName: site.name,
  },
)
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 1200px;
      height: 630px;
      padding: 64px;
      background: linear-gradient(135deg, #4a5fc1 0%, #3548a0 100%);
      color: #ffffff;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    "
  >
    <div
      style="
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        opacity: 0.9;
      "
    >
      {{ siteName }}
    </div>
    <h1
      style="
        margin: 0;
        max-width: 960px;
        font-size: 72px;
        font-weight: 800;
        line-height: 1.05;
        font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      "
    >
      {{ title }}
    </h1>
  </div>
</template>
