<script setup lang="ts">
import { siteImages } from '../../../config/site'

withDefaults(
  defineProps<{
    variant?: 'full' | 'minimal'
  }>(),
  {
    variant: 'full',
  },
)

const localePath = useLocalePath()
const { brand, navigation, legalLinks } = useAppConfig()
const currentYear = new Date().getFullYear()
const contact = useContactLinks()
const route = useRoute()
// The contact page already shows the address and every way to get in touch.
const isContactPage = computed(() => route.path === localePath('/contatti'))

const studio = {
  name: 'Upstudio',
  url: 'https://upstudioit.it',
} as const

// Full footer: brown ground, centred, the logo tile between two hairlines.
const lightLinkClass =
  'inline-flex min-h-11 items-center rounded-sm text-primary-200 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const navLinkClass = `${lightLinkClass} px-2 text-sm uppercase tracking-[0.14em]`

const contactLinkClass = `${lightLinkClass} text-primary-50 underline decoration-white/30 underline-offset-4 hover:decoration-accent`

const linkClass =
  'inline-flex min-h-11 items-center rounded-sm text-sm text-primary-200 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const creditLinkClass =
  'rounded-sm text-primary-200 underline-offset-2 transition-colors motion-reduce:transition-none hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const minimalLegalLinks = computed(() =>
  legalLinks.filter((item) => item.to === '/privacy-policy' || item.to === '/cookie-policy'),
)
</script>

<template>
  <footer
    :class="
      variant === 'full'
        ? 'border-t-2 border-accent bg-primary-950 text-primary-foreground'
        : 'bg-primary-950 text-primary-foreground'
    "
  >
    <UiContainer :class="variant === 'full' ? 'pb-6 pt-14 md:pt-16' : 'py-12 md:py-16'">
      <template v-if="variant === 'full'">
        <!-- The logo centred between two hairlines, as in the header -->
        <div class="flex items-center gap-6 md:gap-10">
          <span class="h-px flex-1 bg-white/20" aria-hidden="true" />
          <NuxtLink
            :to="localePath('/')"
            class="shrink-0 rounded-lg bg-background p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950"
            :aria-label="$t('header.logoLabel', { name: brand.name })"
          >
            <img
              :src="siteImages.logo"
              :alt="brand.name"
              width="128"
              height="128"
              class="h-28 w-auto md:h-32"
            />
          </NuxtLink>
          <span class="h-px flex-1 bg-white/20" aria-hidden="true" />
        </div>

        <nav class="mt-6" :aria-label="$t('footer.sections.navigation')">
          <ul class="flex flex-wrap justify-center gap-x-6 gap-y-1">
            <li v-for="item in navigation" :key="item.to">
              <NuxtLink :to="localePath(item.to)" :class="navLinkClass">
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Visit: three centred columns (the contact page already has them) -->
        <ul
          v-if="!isContactPage"
          class="mx-auto mt-12 grid max-w-4xl gap-10 text-center sm:grid-cols-3"
        >
          <li class="flex flex-col items-center">
            <UiContactIcon name="pin" class="size-6 text-accent" />
            <h2 class="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {{ $t('contact.info.address') }}
            </h2>
            <a
              :href="contact.mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              :class="contactLinkClass"
              class="mt-1 text-center"
            >
              <span>{{ contact.street }}<br />{{ contact.cityLine }}</span>
              <span class="sr-only">{{ $t('content.externalLink') }}</span>
            </a>
            <p class="mt-1 text-sm text-primary-200">{{ $t('contact.info.hoursValue') }}</p>
          </li>
          <li class="flex flex-col items-center">
            <UiContactIcon name="phone" class="size-6 text-accent" />
            <h2 class="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {{ $t('contact.info.phone') }}
            </h2>
            <a :href="contact.telUrl" :class="contactLinkClass" class="mt-1">
              {{ contact.phone }}
            </a>
            <a
              :href="contact.whatsappUrl.value"
              target="_blank"
              rel="noopener noreferrer"
              :class="lightLinkClass"
              class="gap-2 text-sm"
            >
              <UiContactIcon name="whatsapp" class="size-4" />
              {{ $t('contact.form.whatsapp') }}
              <span class="sr-only">{{ $t('content.externalLink') }}</span>
            </a>
          </li>
          <li class="flex flex-col items-center">
            <UiContactIcon name="mail" class="size-6 text-accent" />
            <h2 class="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {{ $t('contact.info.email') }}
            </h2>
            <a :href="contact.mailUrl" :class="contactLinkClass" class="mt-1">
              {{ contact.email }}
            </a>
          </li>
        </ul>

        <div
          class="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-4 text-sm text-primary-300 md:flex-row md:flex-wrap md:justify-between md:gap-x-8"
        >
          <p>{{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}</p>
          <i18n-t keypath="footer.credit" tag="p">
            <template #studio>
              <a
                :href="studio.url"
                :class="lightLinkClass"
                class="!inline !min-h-0 underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ studio.name }}
              </a>
            </template>
          </i18n-t>
          <ul class="flex items-center gap-4">
            <li v-for="item in legalLinks" :key="item.to">
              <NuxtLink :to="localePath(item.to)" :class="lightLinkClass" class="text-sm">
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
            <li class="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
              <span class="flex h-3 w-6 overflow-hidden rounded-sm" aria-hidden="true">
                <span class="flex-1 bg-[#009246]" />
                <span class="flex-1 bg-white" />
                <span class="flex-1 bg-[#ce2b37]" />
              </span>
              Made in Italy
            </li>
          </ul>
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
