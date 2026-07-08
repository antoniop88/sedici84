export function isExternalUrl(to: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(to)
}
