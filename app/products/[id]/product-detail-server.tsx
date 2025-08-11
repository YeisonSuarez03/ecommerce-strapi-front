import { use } from "react";
import { useGetProduct } from "@/hooks/use-api-server";
import ProductDetailClient from "./product-detail-client";
import { getSeoImageUrl } from "@/lib/strapi";

interface ProductDetailServerProps {
  params: { id: string };
}

function ProductDetailServerContent({ params }: ProductDetailServerProps) {
  const getProduct = useGetProduct(params.id);
  const productData = use(getProduct());

  return <ProductDetailClient product={productData?.data?.[0] || null} />;
}

export default async function ProductDetailServer({ params }: ProductDetailServerProps) {
  const awaitedParams = await params

  return <ProductDetailServerContent params={awaitedParams} />;
} 