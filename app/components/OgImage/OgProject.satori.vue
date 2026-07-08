<script setup lang="ts">
import { site } from '../../../config/site'

withDefaults(
  defineProps<{
    title?: string
    cover?: string
    siteName?: string
  }>(),
  {
    title: '',
    cover: '',
    siteName: site.name,
  },
)
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
          rgba(15, 23, 42, 0.88) 0%,
          rgba(15, 23, 42, 0.35) 55%,
          rgba(15, 23, 42, 0.2) 100%
        );
      "
    />
    <div style="position: relative; z-index: 1; padding: 64px">
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
