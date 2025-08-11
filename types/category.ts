import { StrapiMedia } from "./globals.strapi"

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  image?: StrapiMedia
  isParent?: boolean
  child_categories?: Category[]
}


