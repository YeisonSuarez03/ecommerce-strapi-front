import ProductFiltersMenuResponsive from "@/components/filters/product/product-filters-menu-responsive";
import { ErrorBoundary } from "@/components/global/error-boundary";
import { GridProducts } from "@/components/ui/renders/products/grid-products";
import { GridProductsError, GridProductsSkeleton } from "@/components/ui/renders/products/grid-products-states";
import { Suspense } from "react";

// Prevent caching to avoid SSR issues
export const dynamic = 'force-dynamic'

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProductsPage({ searchParams }: Props) {
  // Await searchParams and convert to Record<string, string>
  const awaitedSearchParams = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col filters:flex-row gap-8">
          {/* Filters - Responsive with CSS */}
          <div className="w-full filters:w-80 filters:flex-shrink-0">
            <ProductFiltersMenuResponsive searchParams={awaitedSearchParams} />
          </div>
          {/* Products Grid */}
          <ErrorBoundary fallback={<GridProductsError />}>
            <Suspense fallback={<GridProductsSkeleton />}>
              <GridProducts searchParams={awaitedSearchParams} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
} 