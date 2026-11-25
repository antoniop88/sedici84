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
const { brand, navigation, legalLinks } = useAppConfig()
const currentYear = new Date().getFullYear()
const contact = useContactLinks()

const studio = {
  name: 'Upstudio',
  url: 'https://upstudioit.it',
} as const

const contactRowClass =
  'group flex min-h-11 items-center gap-4 rounded-sm py-1 text-primary-100 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const navLinkClass =
  'inline-flex min-h-11 items-center rounded-sm text-sm uppercase tracking-[0.14em] text-primary-200 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const linkClass =
  'rounded-sm text-sm text-primary-200 transition-colors motion-reduce:transition-none hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const creditLinkClass =
  'rounded-sm text-primary-200 underline-offset-2 transition-colors motion-reduce:transition-none hover:text-primary-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950'

const minimalLegalLinks = computed(() =>
  legalLinks.filter((item) => item.to === '/privacy-policy' || item.to === '/cookie-policy'),
)
</script>

<template>
  <footer class="bg-primary-950 text-primary-foreground">
    <UiContainer :class="variant === 'full' ? 'pb-8 pt-16 md:pt-20' : 'py-12 md:py-16'">
      <template v-if="variant === 'full'">
        <!-- Visit: the address large, the ways to get in touch beside it -->
        <div class="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div class="lg:col-span-7">
            <h2 class="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              {{ $t('contact.info.heading') }}
            </h2>
            <a
              :href="contact.mapsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="group mt-5 inline-block rounded-sm font-display text-4xl leading-[1.05] text-primary-foreground transition-colors motion-reduce:transition-none hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary-950 md:text-5xl"
            >
              {{ contact.street }}<br />{{ contact.cityLine }}
              <span class="sr-only">{{ $t('content.externalLink') }}</span>
            </a>
            <p class="mt-5 flex items-center gap-3 text-sm text-primary-200">
              <UiContactIcon name="clock" class="size-5 shrink-0 text-accent" />
              {{ $t('contact.info.hours') }}: {{ $t('contact.info.hoursValue') }}
            </p>
          </div>

          <ul class="flex flex-col justify-end gap-1 lg:col-span-5">
            <li>
              <a
                :href="contact.whatsappUrl.value"
                target="_blank"
                rel="noopener noreferrer"
                :class="contactRowClass"
              >
                <UiContactIcon name="whatsapp" class="size-6 shrink-0" />
                <span>{{ $t('contact.form.whatsapp') }}</span>
                <span class="sr-only">{{ $t('content.externalLink') }}</span>
              </a>
            </li>
            <li>
              <a :href="contact.mailUrl" :class="contactRowClass">
                <UiContactIcon name="mail" class="size-6 shrink-0 text-accent" />
                <span>{{ contact.email }}</span>
              </a>
            </li>
            <li>
              <a :href="contact.telUrl" :class="contactRowClass">
                <UiContactIcon name="phone" class="size-6 shrink-0 text-accent" />
                <span>{{ contact.phone }}</span>
              </a>
            </li>
          </ul>
        </div>

        <nav
          class="mt-14 border-t border-white/10 pt-4"
          :aria-label="$t('footer.sections.navigation')"
        >
          <ul class="flex flex-wrap gap-x-8 gap-y-1">
            <li v-for="item in navigation" :key="item.to">
              <NuxtLink :to="localePath(item.to)" :class="navLinkClass">
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- The name set wide across the container -->
        <p
          class="mt-10 whitespace-nowrap font-display text-[clamp(3.5rem,12vw,11rem)] leading-[0.9] text-primary-100"
          aria-hidden="true"
        >
          {{ brand.name }}
        </p>

        <div
          class="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-primary-300 md:flex-row md:flex-wrap md:items-center md:gap-x-8"
        >
          <p>{{ $t('footer.copyright', { year: currentYear, name: brand.name }) }}</p>
          <ul class="flex gap-6">
            <li v-for="item in legalLinks" :key="item.to">
              <NuxtLink :to="localePath(item.to)" :class="linkClass">
                {{ $t(item.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
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
          <p class="flex items-center gap-2 text-xs uppercase tracking-[0.2em] md:ms-auto">
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
