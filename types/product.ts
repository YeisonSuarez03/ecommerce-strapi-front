import { AttributeValue } from "./attributes"
import { Brand } from "./brand"
import { Category } from "./category"
import { StrapiMedia } from "./globals.strapi"
import { Place } from "./places"

// Tipos para los productos desde Strapi

export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  slug: string
  reference: string

  // Relaciones
  category?: Category
  brand?: Brand
  places?: Place[]
  attributes?: AttributeValue[]

  // Medios
  images?: StrapiMedia[]
}

// Parámetros para filtrar productos
export interface ProductFilters {
  search?: string
  category?: number[]
  brand?: number[]
  place?: number[]
  minPrice?: number
  maxPrice?: number
  sortBy?: "newest" | "oldest" | "price-low" | "price-high"
  page?: number
  pageSize?: number
}