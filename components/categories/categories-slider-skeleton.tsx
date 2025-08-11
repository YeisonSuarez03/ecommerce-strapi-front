export default function CategoriesSliderSkeleton() {
  return (
    <div className="bg-white border-b border-default py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="relative">
            {/* Container del carrusel skeleton */}
            <div className="flex space-x-4 overflow-hidden pb-2 px-2 sm:px-12">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex-shrink-0 min-w-[160px]">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3 bg-gray-200 rounded-lg" />
                      <div className="h-4 w-24 bg-gray-200 rounded mx-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gradientes skeleton */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none hidden sm:block" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  )
}
