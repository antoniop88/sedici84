<script setup lang="ts">
defineProps<{
  show: boolean
}>()
</script>

<template>
  <div
    v-if="show"
    role="status"
    class="mb-6 rounded-lg border border-warning/40 bg-warning/15 px-4 py-3 text-sm text-foreground"
  >
    {{ $t('content.fallbackNotice') }}
  </div>
</template>
