<script setup lang="ts">
const mainRef = ref<HTMLElement | null>(null)

useRouteMainFocus(mainRef)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <LayoutTheHeader />
    <main id="main-content" ref="mainRef" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </main>
    <LayoutTheFooter />
  </div>
</template>
