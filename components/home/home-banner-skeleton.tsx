export function HomeBannerSkeleton() {
  return (
    <section className="w-full min-h-[600px] overflow-hidden">
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10"></div>
      
      {/* Content */}
      <div className="relative z-20 min-h-[600px] flex items-center justify-center">
        <div className="max-w-3xl mx-auto text-center px-4">
          <div className="h-12 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded-lg mb-8 animate-pulse max-w-2xl mx-auto"></div>
          <div className="h-12 w-48 bg-gray-300 rounded-lg animate-pulse mx-auto"></div>
        </div>
      </div>
    </section>
  );
} 