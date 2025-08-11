import { useGetProducts } from "@/hooks/use-api-server";
import { use } from "react";
import { GridProductsClient } from "./grid-products-client";
import { GridProductsEmpty } from "./grid-products-states";
import { buildQueryString } from "@/lib/utils";
import { PaginationMeta } from "@/components/ui/pagination";

interface GridProductsProps {
    searchParams: Record<string, string>;
}

export const GridProductsContent = ({ searchParams }: GridProductsProps) => {
  const queryString = buildQueryString(searchParams);
  const fetchCacheProducts = useGetProducts(queryString);
  const products = use(fetchCacheProducts());
  
  if (!products.data || products.data.length === 0) {
    return <GridProductsEmpty />;
  }

  // Extract pagination meta from Strapi response
  const meta: PaginationMeta = {
    page: products.meta?.pagination?.page || 1,
    pageSize: products.meta?.pagination?.pageSize || 12,
    pageCount: products.meta?.pagination?.pageCount || 1,
    total: products.meta?.pagination?.total || 0,
  };

  return <GridProductsClient products={products.data} meta={meta} searchParams={searchParams} />;
}

export const GridProducts = async ({ searchParams }: GridProductsProps) => {
  return <GridProductsContent searchParams={searchParams} />;
}