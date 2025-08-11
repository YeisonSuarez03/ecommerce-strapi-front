export default function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg border border-default overflow-hidden relative" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg border-2" />
              ))}
            </div>
          </div>
          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="h-6 w-24 bg-gray-200 rounded" />
              </div>
              <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
              <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-80 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-72 bg-gray-200 rounded mb-2" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
            <div className="h-1 w-full bg-gray-200 rounded my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-8 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-24 bg-gray-200 rounded" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-32 bg-gray-200 rounded" />
                <div className="h-10 w-32 bg-gray-200 rounded" />
              </div>
              <div className="h-12 w-full bg-gray-200 rounded" />
              <div className="grid grid-cols-3 gap-4 text-center text-sm text-muted">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="h-5 w-5 bg-gray-200 rounded-full" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Especificaciones técnicas */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-custom p-6 space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded mb-2" />
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-4 w-full bg-gray-200 rounded mb-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 