import { StrapiMedia } from "./globals.strapi"

export interface Brand {
  id: number
  name: string
  slug: string
  description?: string
  logo?: StrapiMedia
}