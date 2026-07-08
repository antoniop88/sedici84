<script setup lang="ts">
import { IMAGE_SIZES } from '~/utils/imageSizes'

defineProps<{
  images: string[]
  alt: string
}>()
</script>

<template>
  <div class="space-y-4">
    <NuxtPicture
      v-if="images[0]"
      :src="images[0]"
      :alt="alt"
      :sizes="IMAGE_SIZES.coverDetail"
      format="avif,webp"
      width="896"
      height="504"
      priority
      preload
      loading="eager"
      decoding="async"
      class="aspect-[16/9] w-full max-w-4xl rounded-xl object-cover"
    />
    <ul
      v-if="images.length > 1"
      class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      role="list"
    >
      <li v-for="(image, index) in images.slice(1)" :key="index">
        <NuxtImg
          :src="image"
          :alt="`${alt} — ${index + 2}`"
          :sizes="IMAGE_SIZES.gridCard"
          width="200"
          height="150"
          loading="lazy"
          decoding="async"
          class="aspect-[4/3] w-full rounded-lg object-cover"
        />
      </li>
    </ul>
  </div>
</template>
