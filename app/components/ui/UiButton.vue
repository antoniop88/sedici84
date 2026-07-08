<script setup lang="ts">
import { isExternalUrl } from '~/utils/isExternalUrl'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    disabled?: boolean
    loading?: boolean
    to?: string
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    disabled: false,
    loading: false,
    to: undefined,
    type: 'button',
  },
)

const isLink = computed(() => Boolean(props.to))
const isExternal = computed(() => (props.to ? isExternalUrl(props.to) : false))
const isDisabled = computed(() => props.disabled || props.loading)

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-700 active:bg-primary-800',
  secondary:
    'border border-neutral-300 bg-neutral-100 text-secondary-foreground hover:bg-neutral-200 active:bg-neutral-300',
  ghost: 'bg-transparent text-foreground hover:bg-neutral-100 active:bg-neutral-200',
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50'
</script>

<template>
  <NuxtLink
    v-if="isLink"
    :to="to!"
    :class="[baseClasses, variantClasses[variant]]"
    :aria-disabled="isDisabled || undefined"
    :aria-busy="loading || undefined"
    :tabindex="isDisabled ? -1 : undefined"
    :target="isExternal ? '_blank' : undefined"
    :rel="isExternal ? 'noopener noreferrer' : undefined"
  >
    <span
      v-if="loading"
      class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
      aria-hidden="true"
    />
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="[baseClasses, variantClasses[variant]]"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
  >
    <span
      v-if="loading"
      class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>
