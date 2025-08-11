import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi"
import type { ProductFilters } from "@/types/product"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)


    // Extraer parámetros de filtrado
    const filters: ProductFilters = {
      search: searchParams.get("search") || undefined,
      category: searchParams.get("categories")?.split(",").map(Number).filter(Boolean) || undefined,
      brand: searchParams.get("brands")?.split(",").map(Number).filter(Boolean) || undefined,
      place: searchParams.get("places")?.split(",").map(Number).filter(Boolean) || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : (searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : undefined),
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : (searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : undefined),
      sortBy: (searchParams.get("sortBy") as ProductFilters["sortBy"]) || "newest",
      page: Number(searchParams.get("page")) || 1,
      pageSize: Number(searchParams.get("pageSize")) || 12,
    }


    // Construir parámetros para Strapi
    let strapiParams: Record<string, any> = {
      "populate[category][fields][0]": "name",
      "populate[category][fields][1]": "description",
      "populate[category][populate][image][fields][0]": "formats",
      "populate[category][populate][image][fields][1]": "alternativeText",

      "populate[brand][fields][0]": "name",
      "populate[brand][fields][1]": "description",
      "populate[brand][populate][logo][fields][0]": "formats",
      "populate[brand][populate][logo][fields][1]": "alternativeText",

      "populate[places][fields][0]": "name",
      "populate[places][populate][icon][fields][0]": "formats",
      "populate[places][populate][icon][fields][1]": "alternativeText",

      "populate[images][fields][0]": "formats",
      "populate[images][fields][1]": "alternativeText",

      "pagination[page]": filters.page,
      "pagination[pageSize]": filters.pageSize,
    }

    // Aplicar filtros
    let filterIndex = 0

    if (filters.search) {
      strapiParams[`filters[$or][${filterIndex}][name][$containsi]`] = filters.search
      strapiParams[`filters[$or][${filterIndex}][description][$containsi]`] = filters.search
      filterIndex++
    }

    if (filters.category && filters.category.length > 0) {
      filters.category.forEach((categoryId, index) => {
        strapiParams[`filters[category][id][$in][${index}]`] = categoryId
      })
    }

    if (filters.brand && filters.brand.length > 0) {
      filters.brand.forEach((brandId, index) => {
        strapiParams[`filters[brand][id][$in][${index}]`] = brandId
      })
    }

    if (filters.place && filters.place.length > 0) {
      filters.place.forEach((placeId, index) => {
        strapiParams[`filters[places][id][$in][${index}]`] = placeId
      })
    }

    if (filters.minPrice !== undefined) {
      strapiParams["filters[price][$gte]"] = filters.minPrice
    }

    if (filters.maxPrice !== undefined) {
      strapiParams["filters[price][$lte]"] = filters.maxPrice
    }

    // Aplicar ordenamiento
    switch (filters.sortBy) {
      case "newest":
        strapiParams["sort[0]"] = "createdAt:desc"
        break
      case "oldest":
        strapiParams["sort[0]"] = "createdAt:asc"
        break
      case "price-low":
        strapiParams["sort[0]"] = "price:asc"
        break
      case "price-high":
        strapiParams["sort[0]"] = "price:desc"
        break
      default:
        strapiParams["sort[0]"] = "createdAt:desc"
    }

    // Realizar petición a Strapi
    const url = buildStrapiUrl("/products", strapiParams)
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 60 }, // Cache por 1 minuto
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transformar datos de Strapi
    const products = data

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Error fetching products:", error?.message || error)
    // handleStrapiError(error)

    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
