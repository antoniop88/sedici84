type UmamiContext = ReturnType<typeof useScriptUmamiAnalytics>

let umamiContext: UmamiContext | null = null

export function useAnalyticsSetup() {
  const config = useRuntimeConfig()
  const { analyticsConsented } = useCookieConsent()

  const enabled = computed(() => Boolean(config.public.umamiHost && config.public.umamiWebsiteId))

  if (!enabled.value) {
    return { enabled, status: ref('idle' as const) }
  }

  const trigger = useScriptTriggerConsent({ consent: analyticsConsented })

  umamiContext = useScriptUmamiAnalytics({
    websiteId: config.public.umamiWebsiteId,
    hostUrl: config.public.umamiHost,
    scriptOptions: { trigger },
  })

  return {
    enabled,
    status: umamiContext.status,
  }
}

export function useTrackEvent() {
  const { analyticsConsented } = useCookieConsent()

  return (eventName: string, data?: Record<string, unknown>) => {
    if (!analyticsConsented.value) return
    if (!umamiContext || umamiContext.status.value !== 'loaded') return
    umamiContext.proxy.track(eventName, data ?? {})
  }
}
