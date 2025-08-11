export default function ProductFiltersMenuSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>
      {/* Price Range */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
      </div>
      {/* Brands */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {/* Categories */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {/* Places */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <div className="h-4 w-4 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {/* Sort */}
      <div>
        <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>
      {/* Clear Filters Button */}
      <div className="h-10 w-full bg-gray-200 rounded" />
    </div>
  );
} 