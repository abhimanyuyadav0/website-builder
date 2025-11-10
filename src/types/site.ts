export type MediaType = 'image' | 'video' | 'icon'

export interface SiteConfig {
  site: {
    global: GlobalConfig
    pages: PageConfig[]
  }
}

export interface GlobalConfig {
  brand: string
  theme: 'light' | 'dark'
  layout: {
    header?: LayoutComponentConfig
    footer?: LayoutComponentConfig
  }
}

export interface LayoutComponentConfig {
  component: string
  props?: Record<string, unknown>
}

export interface PageConfig {
  id: string
  path: string
  name: string
  layout?: string
  seo?: {
    title?: string
    description?: string
  }
  sections: SectionConfig[]
  children?: PageConfig[]
  metadata?: PageMetadata
}

export interface SectionConfig {
  key: string
  component: string
  props?: Record<string, unknown>
  style?: Record<string, unknown>
}

export interface PageMetadata {
  createdAt?: string
  updatedAt?: string
}

