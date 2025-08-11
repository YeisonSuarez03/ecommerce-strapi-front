export function HomeCategoriesSkeleton() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-8 bg-gray-200 rounded-lg mb-4 animate-pulse max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Image Skeleton */}
              <div className="h-64 bg-gray-200 animate-pulse"></div>
              
              {/* Content Skeleton */}
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse w-3/4"></div>
                
                {/* Action Skeleton */}
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="text-center mt-12">
          <div className="h-12 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto"></div>
        </div>
      </div>
    </section>
  );
} 