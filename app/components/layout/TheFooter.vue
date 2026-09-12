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

const studio = {
  name: 'Upstudio',
  url: 'https://upstudioit.it',
} as const

const linkClass =
  'rounded-sm text-sm text-primary-200 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const creditLinkClass =
  'rounded-sm text-primary-200 underline-offset-2 transition-colors motion-reduce:transition-none hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const minimalLegalLinks = computed(() =>
  legalLinks.filter((item) => item.to === '/privacy-policy' || item.to === '/cookie-policy'),
)
</script>

<template>
  <footer class="border-t-2 border-accent bg-primary-950 text-primary-foreground">
    <UiContainer class="py-12 md:py-16">
      <template v-if="variant === 'full'">
        <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-3 sm:gap-12">
          <div class="flex flex-col items-center text-center">
            <NuxtLink
              :to="localePath('/')"
              class="inline-flex justify-center rounded-lg border border-accent/40 bg-background p-3 shadow-[0_10px_30px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
            >
              <img :src="brand.logo" :alt="brand.name" class="h-28 w-auto md:h-32" />
            </NuxtLink>
            <address class="mt-6 space-y-1 text-sm not-italic text-primary-200">
              <p>{{ organization.address.street }}</p>
              <p>{{ organization.address.postalCode }} {{ organization.address.city }}</p>
              <p>
                <a
                  :href="`mailto:${organization.email}`"
                  class="transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {{ organization.email }}
                </a>
              </p>
              <p>
                <a
                  :href="`tel:${organization.phone.replace(/\s+/g, '')}`"
                  class="transition-colors hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  {{ organization.phone }}
                </a>
              </p>
            </address>
          </div>

          <div class="flex flex-col items-center">
            <h2 class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
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

          <div class="flex flex-col items-center">
            <h2 class="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-accent">
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
          class="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:justify-center sm:gap-8"
        >
          <p class="text-sm text-primary-300">
            {{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}
          </p>
          <i18n-t keypath="footer.credit" tag="p" class="text-sm text-primary-300">
            <template #studio>
              <a
                :href="studio.url"
                :class="creditLinkClass"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ studio.name }}
              </a>
            </template>
          </i18n-t>
          <p class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-300">
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

          <LayoutLanguageSwitcher tone="dark" />
        </div>

        <div
          class="mt-4 flex flex-col items-center gap-2 text-center text-sm text-primary-300 sm:items-start sm:text-start"
        >
          <p>
            {{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}
          </p>
          <i18n-t keypath="footer.credit" tag="p">
            <template #studio>
              <a
                :href="studio.url"
                :class="creditLinkClass"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ studio.name }}
              </a>
            </template>
          </i18n-t>
        </div>
      </template>
    </UiContainer>
  </footer>
</template>
