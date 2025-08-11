import { StrapiMedia } from "./globals.strapi"

export interface Place {
  id: number
  name: string
  description?: string
  icon?: StrapiMedia
}