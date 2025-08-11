import qs from "qs";
import { StrapiMedia } from "@/types/globals.strapi";

// Configuración base para las peticiones a Strapi
export const strapiConfig = {
  baseURL: process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL,
  authToken: process.env.STRAPI_READONLY_AUTH_TOKEN,
  apiPath: "/api",
}

// Headers por defecto para las peticiones
export const getStrapiHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${strapiConfig.authToken}`,
})

// Función para construir URLs de Strapi
export function buildStrapiUrl(endpoint: string, params?: Record<string, any>) {
  // Use the original structure: baseURL + apiPath + endpoint
  const url = new URL(`${strapiConfig.apiPath}${endpoint}`, strapiConfig.baseURL);
  if (params && Object.keys(params).length > 0) {
    const queryString = qs.stringify(params, {
      encodeValuesOnly: true,
      encoder: (str, defaultEncoder, charset) => {
        // Do not encode colons in sort params or similar
        if (typeof str === 'string' && str.includes(':')) {
          return str;
        }
        return defaultEncoder(str, defaultEncoder, charset);
      },
    });
    url.search = queryString;
  }
  return url.toString();
}

// Función para obtener URL completa de medios de Strapi
export const getStrapiMediaUrl = (url: string | null | undefined) => {
  if (!url) return null
  if (url.startsWith("http")) return url
  return `${strapiConfig.baseURL}${url}`
}

// Helper to get the best image format for main image
export function getBestMainImageUrl(image: StrapiMedia | undefined): string {
  if (!image || !image.formats) return "/placeholder.svg";
  return (
    getStrapiMediaUrl(image.formats.large?.url) ||
    getStrapiMediaUrl(image.formats.medium?.url) ||
    getStrapiMediaUrl(image.formats.small?.url) ||
    getStrapiMediaUrl(image.formats.thumbnail?.url) ||
    getStrapiMediaUrl(image.url) ||
    "/placeholder.svg"
  );
}

// Helper to get the best image format for thumbnails
export function getBestThumbUrl(image: StrapiMedia | undefined): string {
  if (!image || !image.formats) return "/placeholder.svg";
  return (
    getStrapiMediaUrl(image.formats.small?.url) ||
    getStrapiMediaUrl(image.formats.thumbnail?.url) ||
    getStrapiMediaUrl(image.url) ||
    "/placeholder.svg"
  );
}

// Helper to get the SEO image (always thumbnail)
export function getSeoImageUrl(image: StrapiMedia | undefined): string {
  if (!image || !image.formats) return "/placeholder.svg";
  return getStrapiMediaUrl(image.formats.thumbnail?.url) || getStrapiMediaUrl(image.url) || "/placeholder.svg";
}

// Función para manejar errores de Strapi
export const handleStrapiError = (error: any) => {
  console.error("Strapi API Error:", error)

  if (error.response?.data?.error) {
    const strapiError = error.response.data.error
    throw new Error(`Strapi Error: ${strapiError.message} (${strapiError.status})`)
  }

  if (error.message) {
    throw new Error(`API Error: ${error.message}`)
  }

  throw new Error("Unknown API Error")
}
