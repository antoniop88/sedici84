<script setup lang="ts">
// Two photos side by side inside long-form Markdown: ::photo-pair{a="..." b="..."}
const props = defineProps<{
  a: string
  b: string
  altA?: string
  altB?: string
}>()
</script>

<template>
  <div class="not-prose my-10 grid grid-cols-2 gap-4 md:gap-6">
    <NuxtImg
      :src="props.a"
      :alt="props.altA ?? ''"
      width="480"
      height="600"
      sizes="50vw md:420px"
      loading="lazy"
      decoding="async"
      class="aspect-[4/5] w-full rounded-lg object-cover"
    />
    <NuxtImg
      :src="props.b"
      :alt="props.altB ?? ''"
      width="480"
      height="600"
      sizes="50vw md:420px"
      loading="lazy"
      decoding="async"
      class="aspect-[4/5] w-full rounded-lg object-cover"
    />
  </div>
</template>
