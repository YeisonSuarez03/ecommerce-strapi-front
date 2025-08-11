import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const getImage = searchParams.get("getImage") === "true"
    const id = searchParams.get("id")

    const strapiParams: Record<string, any> = {
      "fields[0]": "name",
      "fields[1]": "description",
      "fields[2]": "slug",
      "populate[child_categories][fields][0]": "name",
      "populate[child_categories][fields][1]": "description",
      "populate[child_categories][fields][2]": "slug",
      "filters[isParent][$eq]": true,
      "sort[0]": "name:asc",
      "pagination[pageSize]": searchParams.get("limit") || "100",
    }

    if(id){
      strapiParams["filters[id][$eq]"] = id;
    }

    // Conditionally add image population
    if (getImage) {
      strapiParams["populate[image][fields][0]"] = "formats";
      strapiParams["populate[image][fields][1]"] = "alternativeText";

      strapiParams["populate[child_categories][populate][image][fields][0]"] = "formats";
      strapiParams["populate[child_categories][populate][image][fields][1]"] = "alternativeText";
    }

    // Realizar petición a Strapi
    const url = buildStrapiUrl("/categorias", strapiParams)
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
    const categories = data

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    handleStrapiError(error)

    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
