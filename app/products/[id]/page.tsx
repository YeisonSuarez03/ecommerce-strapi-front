import { Suspense } from "react";
import ProductDetailServer from "./product-detail-server";
import ProductDetailSkeleton from "./product-detail-skeleton";
import { useGetProduct } from "@/hooks/use-api-server";
import { getSeoImageUrl } from "@/lib/strapi";

interface ProductDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const awaitedParams = await params;
  const getProduct = useGetProduct(awaitedParams.id);
  const productData = await getProduct();
  const product = productData?.data?.[0];
  if (!product) return { title: "Marketplace - Producto no encontrado" };
  return {
    title: `Marketplace - ${product.name}`,
    description: product.description,
    openGraph: {
      title: `Marketplace - ${product.name}`,
      description: product.description,
      images: [getSeoImageUrl(product.images?.[0])],
    },
    twitter: {
      card: "summary_large_image",
      title: `Marketplace - ${product.name}`,
      description: product.description,
      images: [getSeoImageUrl(product.images?.[0])],
    },
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailServer params={params} />
    </Suspense>
  );
} 