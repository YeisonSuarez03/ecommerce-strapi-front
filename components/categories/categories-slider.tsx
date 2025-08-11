"use server"

import { Category } from "@/types/category"
import CategoriesSliderRender from "./categories-slider-render"

async function fetchCategories(): Promise<Category[]> {
  try {
    const url = `${process.env.FRONTEND_URL}/api/categories`

    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 300 }, // Cache por 5 minutos
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transformar datos de Strapi según la nueva estructura
    return data.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.name,
      slug: item.slug,
      image: item.image
        ? {
            formats: item.image.formats,
            alternativeText: item.image.alternativeText,
          }
        : null,
    }))
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Retornar array vacío en caso de error para evitar que la página falle
    return []
  }
}

export default async function CategoriesSlider() {
  const categories = await fetchCategories()

  return (
    <CategoriesSliderRender categories={categories} />
  )
}
