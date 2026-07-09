<script setup lang="ts">
const { locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// Map locale code → short label shown next to the flag.
const shortLabel: Record<string, string> = { it: 'IT', en: 'EN' }
</script>

<template>
  <nav :aria-label="$t('common.languageSwitcher.label')">
    <ul class="flex flex-wrap items-center gap-1.5">
      <li v-for="entry in locales" :key="entry.code">
        <NuxtLink
          :to="switchLocalePath(entry.code) ?? ''"
          :aria-current="locale === entry.code ? 'true' : undefined"
          :aria-label="entry.name"
          :title="entry.name"
          class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium tracking-wide transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          :class="
            locale === entry.code
              ? 'border-primary/25 bg-muted text-foreground'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          "
        >
          <span
            class="inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]"
            aria-hidden="true"
          >
            <!-- Italy -->
            <svg
              v-if="entry.code === 'it'"
              viewBox="0 0 60 40"
              class="h-full w-full"
              preserveAspectRatio="none"
            >
              <rect width="20" height="40" x="0" fill="#009246" />
              <rect width="20" height="40" x="20" fill="#ffffff" />
              <rect width="20" height="40" x="40" fill="#ce2b37" />
            </svg>
            <!-- United Kingdom (English) -->
            <svg v-else viewBox="0 0 60 40" class="h-full w-full" preserveAspectRatio="none">
              <rect width="60" height="40" fill="#012169" />
              <path d="M0,0 60,40 M60,0 0,40" stroke="#ffffff" stroke-width="8" />
              <path d="M0,0 60,40" stroke="#C8102E" stroke-width="4" />
              <path d="M60,0 0,40" stroke="#C8102E" stroke-width="4" />
              <path d="M30,0 V40 M0,20 H60" stroke="#ffffff" stroke-width="12" />
              <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" stroke-width="7" />
            </svg>
          </span>
          <span>{{ shortLabel[entry.code] ?? entry.code.toUpperCase() }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
