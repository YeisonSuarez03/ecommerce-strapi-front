import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const strapiParams = {
      "sort[0]": "name:asc",
      "pagination[pageSize]": searchParams.get("limit") || "100",
    }

    // Realizar petición a Strapi
    const url = buildStrapiUrl("/places", strapiParams)
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
    const places = data

    return NextResponse.json(places)
  } catch (error) {
    console.error("Error fetching places:", error)
    handleStrapiError(error)

    return NextResponse.json({ error: "Failed to fetch places" }, { status: 500 })
  }
}
