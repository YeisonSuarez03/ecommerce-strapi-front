import { Button } from "@/components/ui/button"
import { getStrapiMediaUrl } from "@/lib/strapi"
import { Category } from "@/types/category"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface CategoriesSliderRenderProps{
    categories?: Category[]
}

const CategoriesSliderRender = (props: CategoriesSliderRenderProps) => {
    const {categories} = props;
    if (!categories || categories.length === 0) {
    return (
      <div className="bg-white border-b border-default py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <p className="text-muted">No se pudieron cargar las categorías</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-b border-default py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-main">Categorías</h2>
            <span className="text-sm text-muted">{categories.length} categorías disponibles</span>
          </div>

          <div className="relative group">
            {/* Flecha izquierda */}
            <Button
              variant="outline"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 btn-outline bg-white/95 backdrop-blur-sm shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 hidden sm:flex items-center justify-center"
              onClick={() => {
                const container = document.getElementById("categories-container")
                if (container) {
                  container.scrollBy({ left: -300, behavior: "smooth" })
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Flecha derecha */}
            <Button
              variant="outline"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 btn-outline bg-white/95 backdrop-blur-sm shadow-md hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 hidden sm:flex items-center justify-center"
              onClick={() => {
                const container = document.getElementById("categories-container")
                if (container) {
                  container.scrollBy({ left: 300, behavior: "smooth" })
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Container del carrusel */}
            <div
              id="categories-container"
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2 px-2 sm:px-12"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {categories.map((category) => (
                <div key={category.id} className="card-custom flex-shrink-0 p-4 cursor-pointer group min-w-[160px]">
                  <div className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100">
                      {category.image?.formats?.thumbnail?.url ? (
                        <Image
                          src={getStrapiMediaUrl(category.image.formats.thumbnail.url) || "/placeholder.svg"}
                          alt={category.image.alternativeText || category.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-2xl font-bold text-gray-400">
                            {category.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-main group-hover:text-primary transition-colors duration-200">
                      {category.name}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradientes para indicar scroll */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden sm:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesSliderRender