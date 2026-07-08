export default defineEventHandler((event) => {
  const path = event.path

  if (
    path === '/' ||
    !path.endsWith('/') ||
    path.startsWith('/_ipx/') ||
    path.startsWith('/_nuxt/') ||
    path.startsWith('/api/')
  ) {
    return
  }

  return sendRedirect(event, path.slice(0, -1), 301)
})
