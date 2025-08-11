import { buildStrapiUrl, getStrapiHeaders, handleStrapiError } from "@/lib/strapi";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const strapiParams = {
      "populate[PrincipalBanner][fields][0]": "title",
      "populate[PrincipalBanner][fields][1]": "description", 
      "populate[PrincipalBanner][fields][2]": "buttonLink",
      "populate[PrincipalBanner][populate][media]": true,
    };

    // Realizar petición a Strapi
    const url = buildStrapiUrl("/home-page", strapiParams);
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 300 }, // Cache por 5 minutos
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching home page:", error);
    handleStrapiError(error);

    return NextResponse.json({ error: "Failed to fetch home page" }, { status: 500 });
  }
} 