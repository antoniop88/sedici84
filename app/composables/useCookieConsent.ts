export const CONSENT_POLICY_VERSION = '1.0.0'
export const CONSENT_STORAGE_KEY = 'acme_cookie_consent'
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

export interface ConsentPreferences {
  necessary: true
  analytics: boolean
}

export interface ConsentRecord {
  version: string
  preferences: ConsentPreferences
  decidedAt: number
  expiresAt: number
}

function createDefaultPreferences(analytics: boolean): ConsentPreferences {
  return { necessary: true, analytics }
}

function createConsentRecord(analytics: boolean): ConsentRecord {
  const decidedAt = Date.now()
  return {
    version: CONSENT_POLICY_VERSION,
    preferences: createDefaultPreferences(analytics),
    decidedAt,
    expiresAt: decidedAt + CONSENT_MAX_AGE_MS,
  }
}

function isValidRecord(record: unknown): record is ConsentRecord {
  if (!record || typeof record !== 'object') return false
  const candidate = record as ConsentRecord
  return (
    candidate.version === CONSENT_POLICY_VERSION &&
    typeof candidate.decidedAt === 'number' &&
    typeof candidate.expiresAt === 'number' &&
    Date.now() <= candidate.expiresAt &&
    candidate.preferences?.necessary === true &&
    typeof candidate.preferences.analytics === 'boolean'
  )
}

function readStoredConsent(): ConsentRecord | null {
  if (!import.meta.client) return null

  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isValidRecord(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeStoredConsent(record: ConsentRecord): void {
  if (!import.meta.client) return
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record))
}

const consentRecord = ref<ConsentRecord | null>(null)
const showPreferences = ref(false)
const hydrated = ref(false)
let hydrationScheduled = false

function hydrateConsent() {
  if (hydrated.value || !import.meta.client) return
  consentRecord.value = readStoredConsent()
  hydrated.value = true
}

function scheduleHydration() {
  if (hydrationScheduled || !import.meta.client) return
  hydrationScheduled = true
  onNuxtReady(hydrateConsent)
}

export function resetConsentStateForTesting(): void {
  consentRecord.value = null
  showPreferences.value = false
  hydrated.value = false
  hydrationScheduled = false
}

export function useCookieConsent() {
  scheduleHydration()

  const hasDecided = computed(() => consentRecord.value !== null)

  const analyticsConsented = computed(() => consentRecord.value?.preferences.analytics === true)

  const showBanner = computed(() => hydrated.value && consentRecord.value === null)

  function persist(analytics: boolean) {
    const record = createConsentRecord(analytics)
    consentRecord.value = record
    writeStoredConsent(record)
    showPreferences.value = false
  }

  function acceptAll() {
    persist(true)
  }

  function rejectAll() {
    persist(false)
  }

  function savePreferences(preferences: Pick<ConsentPreferences, 'analytics'>) {
    persist(preferences.analytics)
  }

  function openPreferences() {
    showPreferences.value = true
  }

  function closePreferences() {
    showPreferences.value = false
  }

  return {
    consentRecord: readonly(consentRecord),
    hasDecided,
    analyticsConsented,
    showBanner,
    showPreferences: readonly(showPreferences),
    acceptAll,
    rejectAll,
    savePreferences,
    openPreferences,
    closePreferences,
  }
}
