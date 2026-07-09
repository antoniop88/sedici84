import type {
  LandingEnCollectionItem,
  LandingItCollectionItem,
  LegalEnCollectionItem,
  LegalItCollectionItem,
  PagesEnCollectionItem,
  PagesItCollectionItem,
} from '@nuxt/content'

export type ContentCollectionType = 'pages' | 'legal' | 'landing'

export type LocalizedQueryResult<T> = {
  data: T | null
  isFallback: boolean
}

export type PageDocument = PagesItCollectionItem | PagesEnCollectionItem
export type LegalDocument = LegalItCollectionItem | LegalEnCollectionItem
export type LandingDocument = LandingItCollectionItem | LandingEnCollectionItem

export type CollectionDocumentMap = {
  pages: PageDocument
  legal: LegalDocument
  landing: LandingDocument
}

export type GalleryCategory = {
  key: string
  label: string
}

export type GalleryImage = {
  src: string
  alt: string
  category?: string
}
