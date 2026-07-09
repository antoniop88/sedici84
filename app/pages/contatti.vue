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
  <UiContainer v-if="page" class="py-12">
    <ContentFallbackNotice :show="isFallback" />

    <header class="mb-8 space-y-3">
      <h1 class="font-display text-3xl leading-tight text-foreground md:text-4xl">
        {{ page.title }}
      </h1>
      <p v-if="page.description" class="max-w-prose text-lg text-muted-foreground">
        {{ page.description }}
      </p>
    </header>

    <div class="mx-auto max-w-3xl space-y-10">
      <div class="prose prose-neutral max-w-prose">
        <ContentRenderer :value="page" />
      </div>

      <div class="rounded-xl border border-neutral-200 bg-white p-6 md:p-8">
        <h2 class="mb-6 font-display text-xl font-semibold text-foreground">
          {{ $t('contact.info.heading') }}
        </h2>
        <dl class="space-y-5 text-sm">
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
</template>
