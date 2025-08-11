import { buildStrapiUrl, getStrapiHeaders } from "@/lib/strapi";

export async function FaviconServer() {
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
      // Return default favicon if none is configured
      return (
        <>
          <link rel="icon" href="/placeholder-logo.svg" type="image/svg+xml" />
          <link rel="shortcut icon" href="/placeholder-logo.svg" type="image/svg+xml" />
          <link rel="apple-touch-icon" href="/placeholder-logo.svg" />
        </>
      );
    }

    // Construct the full Strapi media URL
    const strapiBaseUrl = process.env.STRAPI_BACKEND_URL;
    const fullFaviconUrl = `${strapiBaseUrl}${faviconUrl}`;

    // Return the favicon links
    return (
      <>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </>
    );

  } catch (error) {
    console.error("Error fetching favicon:", error);
    
    // Return default favicon on error
    return (
      <>
        <link rel="icon" href="/placeholder-logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/placeholder-logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/placeholder-logo.svg" />
      </>
    );
  }
} 