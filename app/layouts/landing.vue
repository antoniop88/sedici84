<script setup lang="ts">
const localePath = useLocalePath()
const { brand } = useAppConfig()
const mainRef = ref<HTMLElement | null>(null)

useRouteMainFocus(mainRef)
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <header class="border-b border-neutral-200 bg-background">
      <UiContainer class="flex items-center justify-between gap-4 py-4">
        <NuxtLink
          :to="localePath('/')"
          class="font-display text-lg font-semibold text-foreground transition-colors motion-reduce:transition-none hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          :aria-label="$t('header.logoLabel', { name: brand.name })"
        >
          {{ brand.name }}
        </NuxtLink>

        <UiButton :to="localePath('/contatti')" variant="primary">
          {{ $t('cta.contactUs') }}
        </UiButton>
      </UiContainer>
    </header>

    <main id="main-content" ref="mainRef" tabindex="-1" class="flex-1 outline-none">
      <slot />
    </main>

    <LayoutTheFooter variant="minimal" />
  </div>
</template>
