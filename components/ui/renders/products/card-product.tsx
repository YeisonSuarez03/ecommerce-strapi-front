import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/product";
import { Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Button } from "../../button";
import { formatPrice, hasValidUrl } from "@/lib/utils";
import { getStrapiMediaUrl } from "@/lib/strapi";

interface CardProductProps {
  product: Product;
  onSeeDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CardProduct = ({
  product,
  onSeeDetails,
  onAddToCart,
}: CardProductProps) => {
  return (
    <div key={product.id} className="card-custom flex flex-col h-full group max-w-[500px]">
      <div className="relative">
        <Image
          src={
            getStrapiMediaUrl(product.images?.[0]?.formats?.thumbnail?.url) || "/placeholder.svg"
          }
          alt={product.name}
          width={300}
          height={450}
          className="w-full h-52 object-contain transition-transform duration-200 rounded-t-lg"
        />
        {/* <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-default shadow-sm"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div> */}
        {/* Logo de marca en la esquina superior izquierda */}
        {hasValidUrl(product.brand?.logo?.formats?.thumbnail?.url) && (
          <div className="absolute top-3 left-3 bg-white/90 rounded-md p-1.5 shadow-sm">
            <Image
              src={getStrapiMediaUrl(product.brand?.logo?.formats?.thumbnail?.url)!}
              alt={product.brand?.name || ""}
              width={30}
              height={30}
            />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between mb-2 gap-2">
            <h3 className="font-semibold text-main lg:text-base text-sm leading-tight line-clamp-3">
              {product.name}
            </h3>
            <span className="lg:text-lg md:text-base text-lg font-bold text-primary ml-2">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-xs md:text-sm text-muted mb-3 line-clamp-4">
            {product.description}
          </p>

        </div>

        <div>
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {hasValidUrl(product.brand?.logo?.formats?.thumbnail?.url) && (
                <Image
                  src={getStrapiMediaUrl(product.brand?.logo?.formats?.thumbnail?.url)!}
                  alt={product.brand?.name || ""}
                  width={20}
                  height={20}
                />
              )}
              <span className="md:text-sm text-xs font-medium text-muted">
                {product.brand?.name}
              </span>
            </div>
            <div className="flex justify-end flex-wrap gap-1">
              {product.places?.slice(0, 2).map((place) => (
                <Badge
                  key={place.id}
                  variant="secondary"
                  className="badge-muted flex items-center gap-1 text-xs font-normal text-white hover:text-main"
                >
                  {hasValidUrl(place.icon?.formats?.thumbnail?.url) && (
                    <Image
                      src={getStrapiMediaUrl(place.icon?.formats?.thumbnail?.url)!}
                      alt={place.name || ""}
                      width={12}
                      height={12}
                      className="brightness-0 invert"
                    />
                  )}
                  {place.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => onSeeDetails(product)}
              variant="outline"
              className="btn-outline flex-1 rounded"
            >
              Ver detalles
            </Button>
            <Button
              onClick={() => onAddToCart(product)}
              className="btn-primary flex-1 text-white hover:bg-secondary rounded"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
