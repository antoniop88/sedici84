<script setup lang="ts">
defineI18nRoute({
  paths: {
    it: '/contatti',
    en: '/contact',
  },
})

const { locale, t } = useI18n()
const { queryByStem } = useContentLocale()
const { organization } = useAppConfig()

const addressLine = computed(() => {
  const { street, postalCode, city, country } = organization.address
  return [street, [postalCode, city].filter(Boolean).join(' '), country].filter(Boolean).join(', ')
})

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

usePageSeo({
  title: computed(() => page.value?.title ?? ''),
  description: computed(() => page.value?.description),
  schemaOrgFrontmatter: computed(() => page.value?.schemaOrg),
})
</script>

<template>
  <div v-if="page">
    <UiContainer class="pt-12 md:pt-16">
      <ContentFallbackNotice :show="isFallback" />

      <header class="mb-10 max-w-prose space-y-4">
        <p class="text-sm font-medium uppercase tracking-[0.2em] text-accent">
          {{ $t('nav.contact') }}
        </p>
        <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl lg:text-5xl">
          {{ page.title }}
        </h1>
        <p v-if="page.description" class="text-lg leading-relaxed text-muted-foreground">
          {{ page.description }}
        </p>
      </header>
    </UiContainer>

    <UiContainer v-if="page.body" class="pb-12 md:pb-16">
      <div
        class="overflow-hidden rounded-xl border border-primary-800/20 lg:grid lg:grid-cols-2 lg:items-stretch"
      >
        <div class="relative min-h-[16rem] overflow-hidden bg-muted sm:min-h-[20rem] lg:min-h-0">
          <!-- Plain img: NuxtPicture SSR emits inline onerror, blocked by script-src-attr 'none'. -->
          <img
            src="/images/hero/slide-2.jpg"
            :alt="$t('contact.intro.imageAlt')"
            width="800"
            height="600"
            loading="lazy"
            decoding="async"
            class="h-full w-full object-cover"
          />
        </div>

        <div
          class="flex flex-col justify-center bg-primary px-8 py-10 text-primary-foreground md:px-12 md:py-16"
        >
          <div class="mb-6 h-px w-16 bg-accent" aria-hidden="true" />
          <div
            class="max-w-prose space-y-5 text-base leading-relaxed [&_p]:m-0 [&_p]:text-primary-foreground/85 [&_p:first-of-type]:font-display [&_p:first-of-type]:text-2xl [&_p:first-of-type]:leading-snug [&_p:first-of-type]:text-primary-foreground md:[&_p:first-of-type]:text-[1.75rem]"
          >
            <ContentRenderer :value="page" />
          </div>
        </div>
      </div>
    </UiContainer>

    <UiContainer class="pb-16 md:pb-20">
      <div class="grid gap-8 lg:grid-cols-2">
        <div class="rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
          <h2 class="mb-6 font-display text-xl font-semibold text-foreground">
            {{ $t('contact.info.heading') }}
          </h2>
          <dl class="grid gap-5 text-sm sm:grid-cols-2">
            <div>
              <dt class="font-medium uppercase tracking-wide text-accent">
                {{ $t('contact.info.address') }}
              </dt>
              <dd class="mt-1 text-muted-foreground">{{ addressLine }}</dd>
            </div>
            <div>
              <dt class="font-medium uppercase tracking-wide text-accent">
                {{ $t('contact.info.phone') }}
              </dt>
              <dd class="mt-1">
                <a
                  :href="`tel:${organization.phone.replace(/\s+/g, '')}`"
                  class="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {{ organization.phone }}
                </a>
              </dd>
            </div>
            <div>
              <dt class="font-medium uppercase tracking-wide text-accent">
                {{ $t('contact.info.email') }}
              </dt>
              <dd class="mt-1">
                <a
                  :href="`mailto:${organization.email}`"
                  class="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {{ organization.email }}
                </a>
              </dd>
            </div>
            <div>
              <dt class="font-medium uppercase tracking-wide text-accent">
                {{ $t('contact.info.hours') }}
              </dt>
              <dd class="mt-1 text-muted-foreground">{{ $t('contact.info.hoursValue') }}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </UiContainer>
  </div>
</template>
