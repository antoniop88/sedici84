import type { Component } from 'vue'
import PropertyCard from './PropertyCard.vue'
import PropertyDetail from './PropertyDetail.vue'

/**
 * Maps a registry `listComponent` / `detailComponent` name to its component.
 *
 * A static import registry (rather than resolveComponent by name) keeps the components in the
 * bundle: the generic collection pages no longer reference them statically, so a name-only lookup
 * would be tree-shaken away and render an unresolved element. Adding a collection registers its
 * display components here — one place, no edits to the generic pages.
 */
export const collectionComponents: Record<string, Component> = {
  PropertyCard,
  PropertyDetail,
}
