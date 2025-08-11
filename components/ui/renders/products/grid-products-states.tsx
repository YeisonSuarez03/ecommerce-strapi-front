import { AlertCircle, Search } from "lucide-react";

export function GridProductsSkeleton() {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card-custom group animate-pulse">
              <div className="relative">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg" />
                <div className="absolute top-3 right-3 w-8 h-8 bg-gray-300 rounded-md" />
                <div className="absolute top-3 left-3 w-8 h-8 bg-gray-300 rounded-md" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="h-5 w-32 bg-gray-200 rounded mb-1" />
                  <div className="h-5 w-12 bg-gray-200 rounded" />
                </div>
                <div className="h-4 w-full bg-gray-200 rounded mb-3" />
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 bg-gray-200 rounded-full" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <div className="h-4 w-12 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-10 w-1/2 bg-gray-200 rounded" />
                  <div className="h-10 w-1/2 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  export function GridProductsError() {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-main mb-2">Error al cargar los productos</h3>
        <p className="text-muted mb-4">Ocurrió un problema al cargar los productos. Por favor, intenta recargar la página.</p>
      </div>
    );
  }
  
  export function GridProductsEmpty() {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <Search className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-main mb-2">No se encontraron productos</h3>
        <p className="text-muted mb-4">Intenta ajustar los filtros para encontrar lo que buscas.</p>
      </div>
    );
  }