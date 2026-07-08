<script setup lang="ts">
definePageMeta({
  robots: false,
})

useRobotsRule({ noindex: true, nofollow: true })
</script>

<template>
  <UiContainer as="main" class="py-12">
    <header class="mb-12 space-y-4">
      <h1 class="font-display text-3xl leading-tight text-foreground">UI Preview</h1>
      <p class="max-w-prose text-base leading-relaxed text-muted-foreground">
        Pagina temporanea per verificare font, token e primitive UI. Naviga con Tab per controllare
        focus ring e accessibilità da tastiera.
      </p>
    </header>

    <section aria-labelledby="buttons-heading" class="mb-12 space-y-6">
      <h2 id="buttons-heading" class="text-xl font-semibold text-foreground">UiButton</h2>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-muted-foreground">Primary</h3>
        <div class="flex flex-wrap gap-3">
          <UiButton variant="primary">Primary</UiButton>
          <UiButton variant="primary" disabled>Disabled</UiButton>
          <UiButton variant="primary" loading>Loading</UiButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-muted-foreground">Secondary</h3>
        <div class="flex flex-wrap gap-3">
          <UiButton variant="secondary">Secondary</UiButton>
          <UiButton variant="secondary" disabled>Disabled</UiButton>
          <UiButton variant="secondary" loading>Loading</UiButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-muted-foreground">Ghost</h3>
        <div class="flex flex-wrap gap-3">
          <UiButton variant="ghost">Ghost</UiButton>
          <UiButton variant="ghost" disabled>Disabled</UiButton>
          <UiButton variant="ghost" loading>Loading</UiButton>
        </div>
      </div>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-muted-foreground">As link</h3>
        <div class="flex flex-wrap gap-3">
          <UiButton to="/ui-preview" variant="primary">Internal link</UiButton>
          <UiButton to="https://example.com" variant="secondary"> External link </UiButton>
          <UiButton to="/ui-preview" variant="ghost" disabled> Disabled link </UiButton>
        </div>
      </div>
    </section>

    <section aria-labelledby="links-heading" class="space-y-4">
      <h2 id="links-heading" class="text-xl font-semibold text-foreground">UiLink</h2>
      <ul class="flex flex-wrap gap-4">
        <li>
          <UiLink to="/ui-preview">Internal link</UiLink>
        </li>
        <li>
          <UiLink to="https://example.com">External link</UiLink>
        </li>
      </ul>
    </section>
  </UiContainer>
</template>
