<script setup lang="ts">
import {
  defaultLocaleCode,
  findCollectionKeyBySegment,
  getCollectionPath,
  resolveCollectionKey,
  type LocaleCode,
} from '../../../config/collections'

const { locales, locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

// switchLocalePath reuses the current route params, so on an untranslated collection detail it
// produces a broken cross-locale URL like /en/immobili/<it-slug> (IT segment under the EN prefix)
// that 404s. Detect that here and fall back to the collection's localized list.
function localeTo(code: Parameters<typeof switchLocalePath>[0]): string {
  const target = switchLocalePath(code) ?? ''
  const prefix = code === defaultLocaleCode ? '' : `/${code}`
  const relative = target.startsWith(`${prefix}/`) ? target.slice(prefix.length) : target
  const [segment, slug] = relative.replace(/^\//, '').split('/')

  if (segment && slug && !resolveCollectionKey(segment, code as LocaleCode)) {
    const key = findCollectionKeyBySegment(segment)
    if (key) {
      const listPath = getCollectionPath(key, code as LocaleCode)
      return code === defaultLocaleCode ? listPath : `/${code}${listPath}`
    }
  }

  return target
}

const linkClass =
  'rounded-sm px-2 py-1 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
</script>

<template>
  <nav :aria-label="$t('common.languageSwitcher.label')">
    <ul class="flex flex-wrap items-center gap-1">
      <li v-for="entry in locales" :key="entry.code">
        <NuxtLink
          :to="localeTo(entry.code)"
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
