<script setup lang="ts">
const {
  showBanner,
  showPreferences,
  acceptAll,
  rejectAll,
  savePreferences,
  openPreferences,
  closePreferences,
  consentRecord,
} = useCookieConsent()

const localePath = useLocalePath()
const { t } = useI18n()

const dialogRef = ref<HTMLElement | null>(null)
const analyticsEnabled = ref(false)

watch(showBanner, (visible) => {
  if (visible) {
    analyticsEnabled.value = consentRecord.value?.preferences.analytics ?? false
    nextTick(() => {
      dialogRef.value?.querySelector<HTMLElement>('button')?.focus()
    })
  }
})

watch(showPreferences, (open) => {
  if (open) {
    analyticsEnabled.value = consentRecord.value?.preferences.analytics ?? false
  }
})

function onSavePreferences() {
  savePreferences({ analytics: analyticsEnabled.value })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && showPreferences.value) {
    event.preventDefault()
    closePreferences()
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showBanner"
      ref="dialogRef"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-background p-4 shadow-lg motion-reduce:transition-none sm:p-6"
    >
      <UiContainer>
        <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div class="max-w-2xl space-y-2">
            <h2
              id="cookie-consent-title"
              class="font-display text-lg font-semibold text-foreground"
            >
              {{ t('consent.banner.title') }}
            </h2>
            <p
              id="cookie-consent-description"
              class="text-sm leading-relaxed text-muted-foreground"
            >
              {{ t('consent.banner.description') }}
              <UiLink :to="localePath('/cookie-policy')" class="text-sm">
                {{ t('consent.banner.cookiePolicyLink') }}
              </UiLink>
            </p>
          </div>

          <div v-if="!showPreferences" class="flex flex-wrap gap-2">
            <UiButton variant="primary" @click="acceptAll">
              {{ t('consent.banner.acceptAll') }}
            </UiButton>
            <UiButton variant="secondary" @click="rejectAll">
              {{ t('consent.banner.rejectAll') }}
            </UiButton>
            <UiButton variant="ghost" @click="openPreferences">
              {{ t('consent.banner.preferences') }}
            </UiButton>
          </div>
        </div>

        <div
          v-if="showPreferences"
          class="mt-6 space-y-4 border-t border-neutral-200 pt-6"
          role="region"
          :aria-label="t('consent.banner.preferences')"
        >
          <div class="space-y-4">
            <div
              class="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
            >
              <div class="space-y-1">
                <p class="text-sm font-medium text-foreground">
                  {{ t('consent.categories.necessary.title') }}
                </p>
                <p class="text-sm text-muted-foreground">
                  {{ t('consent.categories.necessary.description') }}
                </p>
              </div>
              <span
                class="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                aria-hidden="true"
              >
                {{ t('consent.categories.alwaysOn') }}
              </span>
              <span class="sr-only">{{ t('consent.categories.necessary.alwaysEnabled') }}</span>
            </div>

            <div
              class="flex items-start justify-between gap-4 rounded-lg border border-neutral-200 p-4"
            >
              <div class="space-y-1">
                <label for="consent-analytics" class="text-sm font-medium text-foreground">
                  {{ t('consent.categories.analytics.title') }}
                </label>
                <p id="consent-analytics-description" class="text-sm text-muted-foreground">
                  {{ t('consent.categories.analytics.description') }}
                </p>
              </div>
              <input
                id="consent-analytics"
                v-model="analyticsEnabled"
                type="checkbox"
                class="mt-1 size-4 shrink-0 rounded border-neutral-300 text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-describedby="consent-analytics-description"
              />
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <UiButton variant="primary" @click="onSavePreferences">
              {{ t('consent.banner.savePreferences') }}
            </UiButton>
            <UiButton variant="ghost" @click="closePreferences">
              {{ t('consent.banner.closePreferences') }}
            </UiButton>
          </div>
        </div>
      </UiContainer>
    </div>
  </Teleport>
</template>
