<script setup lang="ts">
import { z } from 'zod'

const { t } = useI18n()

const schema = z.object({
  name: z.string().min(1, t('errors.validation.required')),
  email: z.string().min(1, t('errors.validation.required')).email(t('errors.validation.email')),
  message: z.string().min(1, t('errors.validation.required')),
})

type FormState = z.infer<typeof schema>
type FormErrors = Partial<Record<keyof FormState, string>>

const form = reactive<FormState>({
  name: '',
  email: '',
  message: '',
})

const errors = ref<FormErrors>({})
const isSubmitting = ref(false)
const isSuccess = ref(false)
const hasSubmitError = ref(false)

function validate(): boolean {
  const result = schema.safeParse(form)
  errors.value = {}

  if (!result.success) {
    const nextErrors: FormErrors = {}
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof FormState
      if (!nextErrors[field]) {
        nextErrors[field] = issue.message
      }
    }
    errors.value = nextErrors
    return false
  }

  return true
}

async function onSubmit() {
  isSuccess.value = false
  hasSubmitError.value = false

  if (!validate()) {
    return
  }

  isSubmitting.value = true

  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...form } })
    isSuccess.value = true
    // Only clear the fields once we know the message was accepted.
    form.name = ''
    form.email = ''
    form.message = ''
  } catch {
    // Surface the failure instead of pretending the message was delivered.
    hasSubmitError.value = true
  } finally {
    isSubmitting.value = false
  }
}

const nameId = useId()
const emailId = useId()
const messageId = useId()
</script>

<template>
  <form class="space-y-6" novalidate @submit.prevent="onSubmit">
    <div
      v-if="isSuccess"
      role="status"
      class="rounded-lg border border-success/30 bg-success/10 px-4 py-3 text-sm text-foreground"
    >
      {{ $t('contact.form.success') }}
    </div>

    <div
      v-if="hasSubmitError"
      role="alert"
      class="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-foreground"
    >
      {{ $t('errors.generic') }}
    </div>

    <div>
      <label :for="nameId" class="mb-1 block text-sm font-medium text-foreground">
        {{ $t('contact.form.name') }}
      </label>
      <input
        :id="nameId"
        v-model="form.name"
        type="text"
        name="name"
        autocomplete="name"
        required
        class="w-full rounded-md border border-neutral-500 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-invalid="errors.name ? 'true' : undefined"
        :aria-describedby="errors.name ? `${nameId}-error` : undefined"
      />
      <p v-if="errors.name" :id="`${nameId}-error`" class="mt-1 text-sm text-error" role="alert">
        {{ errors.name }}
      </p>
    </div>

    <div>
      <label :for="emailId" class="mb-1 block text-sm font-medium text-foreground">
        {{ $t('contact.form.email') }}
      </label>
      <input
        :id="emailId"
        v-model="form.email"
        type="email"
        name="email"
        autocomplete="email"
        required
        class="w-full rounded-md border border-neutral-500 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-invalid="errors.email ? 'true' : undefined"
        :aria-describedby="errors.email ? `${emailId}-error` : undefined"
      />
      <p v-if="errors.email" :id="`${emailId}-error`" class="mt-1 text-sm text-error" role="alert">
        {{ errors.email }}
      </p>
    </div>

    <div>
      <label :for="messageId" class="mb-1 block text-sm font-medium text-foreground">
        {{ $t('contact.form.message') }}
      </label>
      <textarea
        :id="messageId"
        v-model="form.message"
        name="message"
        rows="5"
        required
        class="w-full rounded-md border border-neutral-500 bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        :aria-invalid="errors.message ? 'true' : undefined"
        :aria-describedby="errors.message ? `${messageId}-error` : undefined"
      />
      <p
        v-if="errors.message"
        :id="`${messageId}-error`"
        class="mt-1 text-sm text-error"
        role="alert"
      >
        {{ errors.message }}
      </p>
    </div>

    <UiButton type="submit" variant="primary" :loading="isSubmitting" :disabled="isSubmitting">
      {{ $t('contact.form.submit') }}
    </UiButton>
  </form>
</template>
