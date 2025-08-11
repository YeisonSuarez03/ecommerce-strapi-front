import { Suspense } from "react";
import ProductFiltersMenu from "./product-filters-menu";
import ProductFiltersMenuSkeleton from "./product-filters-menu-skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ProductFiltersMenuResponsiveProps {
  searchParams: Record<string, string>;
}

export default function ProductFiltersMenuResponsive({
  searchParams,
}: ProductFiltersMenuResponsiveProps) {
  return (
    <>
      {/* Mobile/Tablet Filter Button - Hidden on filters screens and above */}
      <div className="filters:hidden mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="btn-outline bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-80 overflow-y-auto scrollbar-stable bg-white"
          >
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="mt-6 pb-6">
              <Suspense fallback={<ProductFiltersMenuSkeleton />}>
                <ProductFiltersMenu searchParams={searchParams} />
              </Suspense>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters - Hidden on screens smaller than filters */}
      <div className="hidden filters:block h-full">
        <div className="card-custom sticky top-20 max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-stable">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-main">Filtros</h2>
            </div>
            <Suspense fallback={<ProductFiltersMenuSkeleton />}>
              <ProductFiltersMenu searchParams={searchParams} />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
