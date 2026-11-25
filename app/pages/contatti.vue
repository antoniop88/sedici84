<script setup lang="ts">
defineI18nRoute({
  paths: {
    it: '/contatti',
    en: '/contact',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()
const contact = useContactLinks()

const { data: pageResult } = await useAsyncData(
  () => `page-contatti-${locale.value}`,
  () => queryByStem('pages', 'contatti'),
  { watch: [locale] },
)

if (!pageResult.value?.data) {
  throw createError({ statusCode: 404, statusMessage: t('errors.notFound'), fatal: true })
}

const page = computed(() => pageResult.value?.data)
const isFallback = computed(() => pageResult.value?.isFallback ?? false)

const cardClass =
  'group flex h-full flex-col items-start gap-2 border-t border-neutral-200 pt-5 transition-[border-color,transform] duration-200 motion-reduce:transition-none hover:-translate-y-0.5 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-white'
const labelClass = 'mt-3 text-xs font-medium uppercase tracking-[0.2em] text-accent-ink'
const valueClass = 'font-display text-2xl leading-tight text-foreground'

usePageSeo({
  title: computed(() => page.value?.title ?? ''),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <div v-if="page">
    <UiContainer>
      <ContentFallbackNotice :show="isFallback" />
    </UiContainer>

    <section class="py-12 md:py-16" aria-labelledby="contact-title">
      <UiContainer>
        <div class="grid items-start gap-10 md:grid-cols-[7fr_5fr] md:gap-14">
          <div>
            <h1
              id="contact-title"
              class="text-xs font-medium uppercase tracking-[0.24em] text-accent-ink"
            >
              {{ page.title }}
            </h1>
            <div
              class="mt-5 space-y-5 [&_p]:m-0 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-muted-foreground [&_p:first-of-type]:font-display [&_p:first-of-type]:text-4xl [&_p:first-of-type]:pb-3 [&_p:first-of-type]:leading-[1.05] [&_p:first-of-type]:text-foreground md:[&_p:first-of-type]:text-6xl"
            >
              <ContentRenderer :value="page" />
            </div>
            <div class="mt-8 flex flex-wrap gap-3">
              <UiButton :to="contact.whatsappUrl.value" variant="primary" class="gap-3 px-6 py-3">
                <UiContactIcon name="whatsapp" class="size-5" />
                {{ $t('contact.form.whatsapp') }}
              </UiButton>
              <UiButton :to="contact.mailUrl" variant="secondary" class="gap-3 px-6 py-3">
                <UiContactIcon name="mail" class="size-5" />
                {{ contact.email }}
              </UiButton>
            </div>
          </div>
          <img
            src="/images/collezioni/donna/donna1.jpeg"
            :alt="$t('contact.intro.imageAlt')"
            width="600"
            height="750"
            loading="eager"
            decoding="async"
            class="aspect-[4/5] w-full rounded-lg object-cover"
          />
        </div>
      </UiContainer>
    </section>

    <section
      class="border-t border-neutral-200 bg-white py-12 md:py-16"
      aria-labelledby="contact-info"
    >
      <UiContainer>
        <h2
          id="contact-info"
          class="font-display text-3xl leading-tight text-foreground md:text-5xl"
        >
          {{ $t('contact.info.heading') }}
        </h2>
        <div class="mt-4 h-px w-16 bg-accent" aria-hidden="true" />
        <ul class="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <a
              :href="contact.whatsappUrl.value"
              target="_blank"
              rel="noopener noreferrer"
              :class="cardClass"
            >
              <UiContactIcon name="whatsapp" class="size-8" />
              <span :class="labelClass">{{ $t('contact.info.whatsapp') }}</span>
              <span :class="valueClass">{{ contact.phone }}</span>
              <span class="sr-only">{{ $t('content.externalLink') }}</span>
            </a>
          </li>
          <li>
            <a :href="contact.mailUrl" :class="cardClass">
              <UiContactIcon name="mail" class="size-8 text-accent-ink" />
              <span :class="labelClass">{{ $t('contact.info.email') }}</span>
              <span :class="valueClass">{{ contact.email }}</span>
            </a>
          </li>
          <li>
            <a :href="contact.telUrl" :class="cardClass">
              <UiContactIcon name="phone" class="size-8 text-accent-ink" />
              <span :class="labelClass">{{ $t('contact.info.phone') }}</span>
              <span :class="valueClass">{{ contact.phone }}</span>
            </a>
          </li>
          <li>
            <a :href="contact.mapsUrl" target="_blank" rel="noopener noreferrer" :class="cardClass">
              <UiContactIcon name="pin" class="size-8 text-accent-ink" />
              <span :class="labelClass">{{ $t('contact.info.address') }}</span>
              <span :class="valueClass">{{ contact.street }}<br />{{ contact.cityLine }}</span>
              <span class="text-sm text-accent-ink underline underline-offset-4">
                {{ $t('contact.info.openMap') }}
              </span>
              <span class="sr-only">{{ $t('content.externalLink') }}</span>
            </a>
          </li>
        </ul>
        <p class="mt-10 flex items-center gap-3 text-base text-muted-foreground">
          <UiContactIcon name="clock" class="size-5 shrink-0 text-accent-ink" />
          {{ $t('contact.info.hours') }}: {{ $t('contact.info.hoursValue') }}
        </p>
      </UiContainer>
    </section>
  </div>
</template>
