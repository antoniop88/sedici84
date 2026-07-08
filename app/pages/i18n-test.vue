<script setup lang="ts">
definePageMeta({
  robots: false,
})

useRobotsRule({ noindex: true, nofollow: true })

const localePath = useLocalePath()
</script>

<template>
  <UiContainer class="py-12">
    <div class="space-y-6">
      <h1 class="font-display text-3xl leading-tight text-foreground">
        {{ $t('common.i18nTest.title') }}
      </h1>
      <p class="max-w-prose text-base leading-relaxed text-muted-foreground">
        {{ $t('common.i18nTest.lead') }}
      </p>

      <p class="text-sm text-muted-foreground">
        {{ $t('nav.home') }} · {{ $t('nav.about') }} · {{ $t('nav.contact') }}
      </p>

      <UiLink :to="localePath('/')">{{ $t('common.i18nTest.backToHome') }}</UiLink>
    </div>
  </UiContainer>
</template>
