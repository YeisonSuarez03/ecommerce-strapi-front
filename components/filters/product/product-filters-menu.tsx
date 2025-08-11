import ProductFiltersMenuClient from "./product-filters-menu-client";
import ProductFiltersMenuSkeleton from "./product-filters-menu-skeleton";
import { useGetBrands, useGetCategories, useGetPlaces } from "@/hooks/use-api-server";
import { ProductFilters } from "@/types/product";
import { Suspense, use } from "react";

interface ProductFiltersMenuProps {
  searchParams: Record<string, string>;
}

export default function ProductFiltersMenu({ searchParams }: ProductFiltersMenuProps) {
  const selectedBrands = searchParams?.brands?.split(",").map(Number).filter(Boolean) || [];
  const selectedCategories = searchParams?.categories?.split(",").map(Number).filter(Boolean) || [];
  const selectedPlaces = searchParams?.places?.split(",").map(Number).filter(Boolean) || [];
  const priceMin = Number(searchParams?.priceMin) || 0;
  const priceMax = Number(searchParams?.priceMax) || 1500;
  const sortBy = searchParams?.sortBy || "newest";

  const getBrands = useGetBrands();
  const getCategories = useGetCategories(true); // Get categories with images
  const getPlaces = useGetPlaces();

  const [brands, categories, places] = [
    use(getBrands()),
    use(getCategories()),
    use(getPlaces()),
  ];

  return (
    <Suspense fallback={<ProductFiltersMenuSkeleton />}>
      <ProductFiltersMenuClient
        brands={brands.data || []}
        categories={categories.data || []}
        places={places.data || []}
        selectedBrands={selectedBrands}
        selectedCategories={selectedCategories}
        selectedPlaces={selectedPlaces}
        priceMin={priceMin}
        priceMax={priceMax}
        sortBy={sortBy as ProductFilters['sortBy']}
      />
    </Suspense>
  );
}