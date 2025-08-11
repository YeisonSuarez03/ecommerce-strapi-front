import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const strapiParams = {
      "populate[logo][fields][0]": "url",
      "populate[logo][fields][1]": "alternativeText",
      "sort[0]": "name:asc",
      "pagination[pageSize]": searchParams.get("limit") || "100",
    }

    // Realizar petición a Strapi
    const url = buildStrapiUrl("/brands", strapiParams)
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 300 }, // Cache por 5 minutos
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transformar datos de Strapi
    const brands = data

    return NextResponse.json(brands)
  } catch (error) {
    console.error("Error fetching brands:", error)
    handleStrapiError(error)

    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 })
  }
}
