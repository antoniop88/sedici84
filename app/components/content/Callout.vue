<script setup lang="ts">
type CalloutVariant = 'info' | 'warning' | 'legal'

const props = withDefaults(
  defineProps<{
    type?: CalloutVariant
    title?: string
  }>(),
  {
    type: 'info',
    title: undefined,
  },
)

const variantClasses: Record<CalloutVariant, string> = {
  info: 'border-info/30 bg-info/10 text-foreground',
  warning: 'border-warning/40 bg-warning/15 text-foreground',
  legal: 'border-error/30 bg-error/10 text-foreground',
}
</script>

<template>
  <aside
    class="my-6 rounded-lg border-l-4 p-4"
    :class="variantClasses[props.type]"
    role="note"
    :aria-label="props.title"
  >
    <p v-if="props.title" class="mb-2 font-semibold">{{ props.title }}</p>
    <div class="prose prose-neutral max-w-none text-sm leading-relaxed">
      <slot />
    </div>
  </aside>
</template>
