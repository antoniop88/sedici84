<script setup lang="ts">
import { site, siteImages } from '../../../config/site'

const props = withDefaults(
  defineProps<{
    title?: string
    siteName?: string
  }>(),
  {
    title: '',
    siteName: site.name,
  },
)

const siteConfig = useSiteConfig()
const requestUrl = useRequestURL()

const logoSrc = computed(() => {
  const base = (siteConfig.url || requestUrl.origin).replace(/\/$/, '')
  return `${base}${siteImages.logo}`
})
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 1200px;
      height: 630px;
      padding: 56px 80px;
      background: #f2eae0;
      color: #3b332b;
      font-family: Inter, ui-sans-serif, system-ui, sans-serif;
      text-align: center;
    "
  >
    <img
      :src="logoSrc"
      width="300"
      height="300"
      :alt="props.siteName"
      style="width: 300px; height: 300px; object-fit: contain; margin-bottom: 36px"
    />
    <div style="width: 64px; height: 2px; background: #b7a48a; margin-bottom: 28px" />
    <h1
      style="
        margin: 0;
        max-width: 920px;
        font-size: 48px;
        font-weight: 600;
        line-height: 1.2;
        font-family: Fraunces, Georgia, serif;
        letter-spacing: -0.01em;
      "
    >
      {{ props.title }}
    </h1>
  </div>
</template>
