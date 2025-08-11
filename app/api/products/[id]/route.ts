import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const awaitedParams = await params
    const productId = awaitedParams.id

    // Parámetros para obtener producto completo con todas las relaciones
    const strapiParams = {
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

      "populate[attributes][populate][attribute][fields][0]": "name",
      "populate[attributes][fields][0]": "value",

      "filters[slug][$eq]": productId,
      "pagination[start]": 0,
      "pagination[limit]": 1
    }

    // Realizar petición a Strapi
    const url = buildStrapiUrl(`/products/`, strapiParams)
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 300 }, // Cache por 5 minutos
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transformar datos de Strapi
    const product = data

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    handleStrapiError(error)

    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}
