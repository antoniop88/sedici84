import type {
  LandingEnCollectionItem,
  LandingItCollectionItem,
  LegalEnCollectionItem,
  LegalItCollectionItem,
  PagesEnCollectionItem,
  PagesItCollectionItem,
  ProjectsEnCollectionItem,
  ProjectsItCollectionItem,
} from '@nuxt/content'

export type ContentCollectionType = 'pages' | 'projects' | 'legal' | 'landing'

export type LocalizedQueryResult<T> = {
  data: T | null
  isFallback: boolean
}

export type PageDocument = PagesItCollectionItem | PagesEnCollectionItem
export type ProjectDocument = ProjectsItCollectionItem | ProjectsEnCollectionItem
export type LegalDocument = LegalItCollectionItem | LegalEnCollectionItem
export type LandingDocument = LandingItCollectionItem | LandingEnCollectionItem

export type CollectionDocumentMap = {
  pages: PageDocument
  projects: ProjectDocument
  legal: LegalDocument
  landing: LandingDocument
}

export function sortProjectsByOrder(projects: ProjectDocument[]): ProjectDocument[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

export function getFeaturedProjects(projects: ProjectDocument[], limit = 3): ProjectDocument[] {
  return sortProjectsByOrder(projects.filter((project) => project.featured)).slice(0, limit)
}
