import { Category } from "@/types/category";
import { getBestMainImageUrl } from "@/lib/strapi";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HomeCategoriesProps {
  categories: Category[];
}

export function HomeCategories({ categories }: HomeCategoriesProps) {
  const handleCategoryClick = (category: Category) => {
    // Get all child category IDs
    const childIds = category.child_categories?.map(child => child.id) || [];
    // Combine parent and child IDs
    const allCategoryIds = [category.id, ...childIds];
    return `/products?categories=${allCategoryIds.join(',')}`;
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-main mb-4">
            Explora Nuestras Categorías
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos organizados por categorías especializadas
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={handleCategoryClick(category)}
              className="group block"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group-hover:border-primary/20">
                {/* Category Image */}
                <div className="relative h-64 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={getBestMainImageUrl(category.image)}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Sin imagen</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>

                {/* Category Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-main mb-2 group-hover:text-primary transition-colors duration-200">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-muted text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">
                      {category.child_categories?.length || 0} subcategorías
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary/80 hover:bg-primary/5 transition-all duration-200"
                    >
                      Explorar
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link href="/products">
            <Button className="inline-flex items-center px-8 py-3 bg-primary text-white hover:bg-secondary hover:text-white font-semibold rounded shadow-lg transition-all duration-200 transform hover:scale-105">
              Ver todas las categorías
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 