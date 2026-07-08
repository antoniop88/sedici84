<script setup lang="ts">
useAppLocaleHead()
useSiteSchemaOrg()
</script>

<template>
  <NuxtRouteAnnouncer />
  <a
    href="#main-content"
    class="sr-only fixed start-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
  >
    {{ $t('common.skipToContent') }}
  </a>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LayoutTheCookieConsent />
</template>
