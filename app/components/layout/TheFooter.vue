<script setup lang="ts">
import type { SiteSocialPlatform } from '../../../config/site'

withDefaults(
  defineProps<{
    variant?: 'full' | 'minimal'
  }>(),
  {
    variant: 'full',
  },
)

const localePath = useLocalePath()
const { t } = useI18n()
const { brand, navigation, legalLinks, social } = useAppConfig()
const currentYear = new Date().getFullYear()

const linkClass =
  'rounded-sm text-sm text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const minimalLegalLinks = computed(() =>
  legalLinks.filter((item) => item.to === '/privacy-policy' || item.to === '/cookie-policy'),
)

function socialLabel(platform: SiteSocialPlatform): string {
  return t(`footer.social.${platform}`)
}
</script>

<template>
  <footer class="border-t border-neutral-200 bg-neutral-50">
    <UiContainer class="py-10">
      <template v-if="variant === 'full'">
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h2 class="mb-4 text-sm font-semibold text-foreground">
              {{ $t('footer.sections.navigation') }}
            </h2>
            <ul class="flex flex-col gap-2">
              <li v-for="item in navigation" :key="item.to">
                <NuxtLink :to="localePath(item.to)" :class="linkClass">
                  {{ $t(item.labelKey) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div>
            <h2 class="mb-4 text-sm font-semibold text-foreground">
              {{ $t('footer.sections.legal') }}
            </h2>
            <ul class="flex flex-col gap-2">
              <li v-for="item in legalLinks" :key="item.to">
                <NuxtLink :to="localePath(item.to)" :class="linkClass">
                  {{ $t(item.labelKey) }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div v-if="social.length > 0">
            <h2 class="mb-4 text-sm font-semibold text-foreground">
              {{ $t('footer.sections.social') }}
            </h2>
            <ul class="flex flex-wrap gap-3">
              <li v-for="item in social" :key="item.platform">
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  :class="linkClass"
                  :aria-label="socialLabel(item.platform)"
                >
                  {{ socialLabel(item.platform) }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p class="mt-8 text-sm text-muted-foreground">
          {{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}
        </p>
      </template>

      <template v-else>
        <div
          class="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-start"
        >
          <ul class="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
            <li v-for="item in minimalLegalLinks" :key="item.to">
              <NuxtLink :to="localePath(item.to)" :class="linkClass">
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>

          <LayoutLanguageSwitcher />
        </div>

        <p class="mt-4 text-center text-sm text-muted-foreground sm:text-start">
          {{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}
        </p>
      </template>
    </UiContainer>
  </footer>
</template>
