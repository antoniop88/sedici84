<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const { navigation } = useAppConfig()

const statusCode = computed(() => props.error.statusCode ?? 500)
const isNotFound = computed(() => statusCode.value === 404)

if (isNotFound.value) {
  useRobotsRule({ noindex: true, nofollow: true })
  useSeoMeta({ robots: 'noindex, nofollow' })
}

useSeoMeta({
  title: () => (isNotFound.value ? t('errors.page404.title') : t('errors.page500.title')),
})

function goHome() {
  clearError({ redirect: localePath('/') })
}
</script>

<template>
  <NuxtLayout name="default">
    <UiContainer class="py-16 md:py-24">
      <div class="mx-auto max-w-lg space-y-8 text-center">
        <p class="font-display text-6xl font-semibold text-muted-foreground/40" aria-hidden="true">
          {{ statusCode }}
        </p>

        <header class="space-y-3">
          <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
            {{ isNotFound ? $t('errors.page404.title') : $t('errors.page500.title') }}
          </h1>
          <p class="text-lg leading-relaxed text-muted-foreground">
            {{ isNotFound ? $t('errors.page404.lead') : $t('errors.page500.lead') }}
          </p>
        </header>

        <UiButton variant="primary" @click="goHome">
          {{ isNotFound ? $t('errors.page404.homeCta') : $t('errors.page500.homeCta') }}
        </UiButton>

        <nav
          v-if="isNotFound"
          aria-labelledby="error-nav-title"
          class="border-t border-neutral-200 pt-8"
        >
          <h2 id="error-nav-title" class="mb-4 text-sm font-semibold text-foreground">
            {{ $t('errors.page404.helpTitle') }}
          </h2>
          <ul class="flex flex-col gap-2">
            <li v-for="item in navigation" :key="item.to">
              <NuxtLink
                :to="localePath(item.to)"
                class="rounded-sm text-sm text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </UiContainer>
  </NuxtLayout>
</template>
