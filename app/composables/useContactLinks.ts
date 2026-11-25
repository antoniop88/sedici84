/** Contact URLs shared by the footer and the contact page. */
export function useContactLinks() {
  const { t } = useI18n()
  const { organization } = useAppConfig()

  const { street, postalCode, city } = organization.address
  const addressText = `${street}, ${postalCode} ${city}`

  const whatsappUrl = computed(() => {
    const phone = organization.phone.replace(/\D/g, '')
    const text = encodeURIComponent(t('contact.form.whatsappMessage'))
    return `https://wa.me/${phone}?text=${text}`
  })

  return {
    email: organization.email,
    phone: organization.phone,
    street,
    cityLine: `${postalCode} ${city}`,
    mailUrl: `mailto:${organization.email}`,
    telUrl: `tel:${organization.phone.replace(/\s+/g, '')}`,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`,
    whatsappUrl,
  }
}
