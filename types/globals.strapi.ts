// Configuración y utilidades para conectar con Strapi
export interface StrapiResponse<T> {
    data: T
    meta: {
      pagination?: {
        page: number
        pageSize: number
        pageCount: number
        total: number
      }
    }
  }
  
  export interface StrapiEntity {
    id: number
    attributes: Record<string, any>
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
  
  export interface StrapiMediaFormat {
    name: string
    hash: string
    ext: string
    mime: string
    width: number
    height: number
    size: number
    url: string
  }
  
  export interface StrapiMedia {
    id: number
    name: string
    alternativeText: string | null
    caption: string | null
    width: number
    height: number
    formats: {
      thumbnail?: StrapiMediaFormat
      small?: StrapiMediaFormat
      medium?: StrapiMediaFormat
      large?: StrapiMediaFormat
    }
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: string | null
    provider: string
    provider_metadata: any
    createdAt: string
    updatedAt: string
  }