<script setup lang="ts">
const { locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const linkClass =
  'rounded-sm px-2 py-1 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
</script>

<template>
  <nav :aria-label="$t('common.languageSwitcher.label')">
    <ul class="flex flex-wrap items-center gap-1">
      <li v-for="entry in locales" :key="entry.code">
        <NuxtLink
          :to="switchLocalePath(entry.code) ?? ''"
          :aria-current="locale === entry.code ? 'true' : undefined"
          :class="[
            linkClass,
            locale === entry.code
              ? 'font-medium text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          ]"
        >
          {{ entry.name }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
