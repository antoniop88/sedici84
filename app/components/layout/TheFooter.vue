<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'full' | 'minimal'
  }>(),
  {
    variant: 'full',
  },
)

const localePath = useLocalePath()
const { brand, navigation, legalLinks, organization } = useAppConfig()
const currentYear = new Date().getFullYear()

const linkClass =
  'rounded-sm text-sm text-muted-foreground transition-colors motion-reduce:transition-none hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

const minimalLegalLinks = computed(() =>
  legalLinks.filter((item) => item.to === '/privacy-policy' || item.to === '/cookie-policy'),
)
</script>

<template>
  <footer class="border-t border-neutral-200 bg-background">
    <UiContainer class="py-10">
      <template v-if="variant === 'full'">
        <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-12">
          <div class="flex flex-col items-center sm:items-start">
            <NuxtLink :to="localePath('/')" class="inline-flex rounded-sm">
              <img :src="brand.logo" :alt="brand.name" class="h-24 w-auto" />
            </NuxtLink>
            <address class="mt-4 space-y-1 text-sm not-italic text-muted-foreground">
              <p>{{ organization.address.street }}</p>
              <p>{{ organization.address.postalCode }} {{ organization.address.city }}</p>
              <p>
                <a
                  :href="`mailto:${organization.email}`"
                  class="transition-colors hover:text-foreground"
                >
                  {{ organization.email }}
                </a>
              </p>
              <p>
                <a
                  :href="`tel:${organization.phone.replace(/\s+/g, '')}`"
                  class="transition-colors hover:text-foreground"
                >
                  {{ organization.phone }}
                </a>
              </p>
            </address>
          </div>

          <div class="flex flex-col items-center sm:items-center">
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

          <div class="flex flex-col items-center sm:items-end">
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
        </div>

        <div
          class="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-3 border-t border-neutral-200 pt-6 text-center sm:flex-row sm:justify-center sm:gap-8"
        >
          <p class="text-sm text-muted-foreground">
            {{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}
          </p>
          <p
            class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
          >
            <span class="flex h-3 w-6 overflow-hidden rounded-sm" aria-hidden="true">
              <span class="flex-1 bg-[#009246]" />
              <span class="flex-1 bg-white" />
              <span class="flex-1 bg-[#ce2b37]" />
            </span>
            Made in Italy
          </p>
        </div>
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
