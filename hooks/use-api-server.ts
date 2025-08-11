import { Brand } from '@/types/brand'
import { Category } from '@/types/category'
import { StrapiResponse } from '@/types/globals.strapi'
import { Place } from '@/types/places'
import { Product } from '@/types/product'
import { PrincipalBanner } from '@/types/principal-banner'
import { getSiteOrigin } from '@/helpers/getSiteOrigin'
import { cache } from 'react'
import { Home } from '@/types/home'

// hook para fetchs desde server-side
export function useApiServer<T>(url: string, options?: RequestInit): () => Promise<T> {
  return cache(async () => {
    const res = await fetch(`${getSiteOrigin()}/api${url}`, {
      cache: 'no-store', // or 'force-cache' depending on your use case
      ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`)
    }

    return res.json() as Promise<T>
  })
}

// Hook para obtener categorías
export function useGetCategories(getImage: boolean = false) {
  const queryString = getImage ? "?getImage=true" : "";
  return useApiServer<StrapiResponse<Category[]>>(`/categories${queryString}`)
}

// Hook para obtener productos
export function useGetProducts(queryString: string = "") {
  return useApiServer<StrapiResponse<Product[]>>(`/products${queryString}`)
}

// Hook para obtener un producto específico
export function useGetProduct(id: number | string) {
  return useApiServer<StrapiResponse<Product[]>>(`/products/${id}`)
}

// Hook para obtener marcas
export function useGetBrands() {
  return useApiServer <StrapiResponse<Brand[]>>("/brands")
}

// Hook para obtener lugares
export function useGetPlaces() {
  return useApiServer<StrapiResponse<Place[]>>("/places")
}

// Hook para obtener datos de la página de inicio
export function useGetHomePage() {
  return useApiServer<StrapiResponse<Home>>("/home-page")
}
