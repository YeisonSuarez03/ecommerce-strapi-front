"use client";
import { useSound } from "@/hooks/use-sound";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { Product } from "@/types/product";
import { useRouter, useSearchParams } from "next/navigation";
import { CardProduct } from "./card-product";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { SoundType } from "@/types/sound";
import { toast } from "@/hooks/use-toast";
import { Pagination, PaginationMeta } from "@/components/ui/pagination";

interface GridProductsClientProps {
  products: Product[];
  meta: PaginationMeta;
  searchParams: Record<string, string>;
}

export const GridProductsClient = ({ products, meta, searchParams }: GridProductsClientProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const currentSearchParams = useSearchParams();
  const { playSound } = useSound();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleSeeDetails = (product: Product) => {
    router.push(`/products/${product.slug}`);
  };

  const handleAddToCart = (product: Product) => {
    // Mini validation for max quantity
    const cartItem = cartItems.find((item: any) => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    if (currentQty + 1 > product.quantity) {
      playSound("error");
      toast({
        title: "Cantidad máxima alcanzada",
        description: `No puedes agregar más de ${product.quantity} unidades de este producto.`,
        variant: "destructive",
      });
      return;
    }
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        brand: product?.brand?.name || "",
        image: getStrapiMediaUrl(product?.images?.[0]?.formats?.thumbnail?.url) || "/placeholder.svg",
        reference: product.reference,
        quantity: 1,
        maxQuantity: product.quantity,
      })
    );
    playSound("success");
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const handlePageSizeChange = (pageSize: number) => {
    const params = new URLSearchParams(currentSearchParams.toString());
    params.set("pageSize", pageSize.toString());
    params.set("page", "1"); // Reset to first page when changing page size
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex-1 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 place-items-center gap-6">
        {products.map((product: Product) => (
          <CardProduct key={product.id} product={product} onSeeDetails={handleSeeDetails} onAddToCart={handleAddToCart} />
        ))}
      </div>
      
      {/* Pagination */}
      {meta.total > 0 && (
        <div className="flex justify-center pt-8 border-t border-default">
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[12, 24, 48, 96]}
            showPageSizeSelector={true}
            showTotal={true}
          />
        </div>
      )}
    </div>
  );
};
