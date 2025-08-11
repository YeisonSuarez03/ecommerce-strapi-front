// Base API response structure
export interface ApiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Place types
export interface Place {
  id: number
  name: string
  description?: string
}

export interface PlacesResponse extends ApiResponse<Place[]> {}

// Category types
export interface Category {
  id: number
  name: string
  description?: string
  slug: string
  child_categories?: Category[]
}

export interface CategoriesResponse extends ApiResponse<Category[]> {}

// Brand types
export interface Brand {
  id: number
  name: string
  description?: string
}

export interface BrandsResponse extends ApiResponse<Brand[]> {}

// Product types (basic structure)
export interface Product {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  slug: string
  reference: string
  category?: Category
  brand?: Brand
  places?: Place[]
}

export interface ProductsResponse extends ApiResponse<Product[]> {}

// Error response
export interface ApiError {
  error: string
  status?: number
  details?: any
} 