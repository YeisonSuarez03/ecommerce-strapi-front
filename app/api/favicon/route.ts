import { NextRequest, NextResponse } from "next/server";
import { buildStrapiUrl, getStrapiHeaders, getStrapiMediaUrl, handleStrapiError } from "@/lib/strapi";

export async function GET(request: NextRequest) {
  try {
    // Fetch favicon from Strapi global endpoint
    const url = buildStrapiUrl("/global", {
      "populate[favicon]": "true"
    });
    
    const response = await fetch(url, {
      method: "GET",
      headers: getStrapiHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const faviconUrl = data?.data?.favicon?.url;

    if (!faviconUrl) {
      // Return a default favicon if none is configured
      return NextResponse.redirect(new URL("/placeholder-logo.svg", request.url));
    }

    // Construct the full Strapi media URL
    const strapiBaseUrl = process.env.STRAPI_BACKEND_URL;
    const fullFaviconUrl = getStrapiMediaUrl(faviconUrl);
    
    // Fetch the actual favicon image from Strapi
    const faviconResponse = await fetch(fullFaviconUrl, {
      headers: getStrapiHeaders(),
    });

    if (!faviconResponse.ok) {
      throw new Error(`Failed to fetch favicon: ${faviconResponse.status}`);
    }

    // Get the favicon as a buffer
    const faviconBuffer = await faviconResponse.arrayBuffer();
    const contentType = faviconResponse.headers.get("content-type") || "image/x-icon";

    // Return the favicon with proper headers
    return new NextResponse(faviconBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600", // Cache for 1 hour
        "Access-Control-Allow-Origin": "*",
      },
    });

  } catch (error: any) {
    console.error("Error fetching favicon:", error?.message || error);
    handleStrapiError(error);
    
    // Return a default favicon on error
    return NextResponse.redirect(new URL("/placeholder-logo.svg", request.url));
  }
} 