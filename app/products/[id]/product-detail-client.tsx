"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSound } from "@/hooks/use-sound";
import { addItem } from "@/lib/features/cart/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { getStrapiMediaUrl } from "@/lib/strapi";
import { formatPrice, hasValidUrl } from "@/lib/utils";
import { Product } from "@/types/product";
import { StrapiMedia } from "@/types/globals.strapi";
import {
  ArrowLeft,
  Award,
  Camera,
  Package,
  Shield,
  ShoppingCart,
  Star,
  Truck,
  Zap,
  Minus,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import TooltipText from "@/components/ui/tooltip-text";
import { getBestMainImageUrl, getBestThumbUrl } from "@/lib/strapi";
import { SoundType } from "@/types/sound";
import { toast } from "@/hooks/use-toast";

interface ProductDetailClientProps {
  product: Product;
}

const productFixed = {
  certifications: ["IP65", "CE", "FCC"],
    features: [
      "Rotación 360° horizontal",
      "Detección IA de personas/mascotas",
      "Audio bidireccional",
      "Visión nocturna a color",
      "Seguimiento automático",
      "Zona de privacidad",
      "App móvil intuitiva",
      "Almacenamiento en nube",
    ],
    inBox: [
      "Cámara Domo WiFi 360°",
      "Base de montaje",
      "Adaptador de corriente",
      "Cable USB",
      "Guía de instalación rápida",
      "Pegatinas de montaje",
    ],
}

export default function ProductDetailClient({
  product,
}: ProductDetailClientProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { playSound } = useSound();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fade, setFade] = useState(false);
  const maxQuantity = product?.quantity;

  // Memoize images for performance
  const images = useMemo(() => product.images || [], [product.images]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-main mb-4">
            Producto no encontrado
          </h1>
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="btn-outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  const handleMinus = () => setQuantity((q) => Math.max(1, q - 1));
  const handlePlus = () => setQuantity((q) => Math.min(maxQuantity, q + 1));

  const handleAddToCart = () => {
    const cartItem = cartItems.find((item: any) => item.id === product.id);
    const currentQty = cartItem ? cartItem.quantity : 0;
    if (currentQty + quantity > product.quantity) {
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
        quantity,
        maxQuantity: product.quantity,
      })
    );
    playSound("success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-default">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="text-muted hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            {/* Main image with fade transition */}
            <div className="aspect-square bg-white rounded-lg border border-default overflow-hidden relative">
              <Image
                src={getBestMainImageUrl(images[selectedImage])}
                alt={`${product.name}-image-${selectedImage + 1}`}
                width={600}
                height={600}
                className={`w-full h-full object-cover transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
                onLoadingComplete={() => setFade(false)}
              />
              {/* Logo de marca en la imagen principal */}
              <div className="absolute top-4 left-4 bg-white/95 rounded-lg p-2 shadow-md">
                {hasValidUrl(product.brand?.logo?.formats?.thumbnail?.url) && (
                  <Image
                    src={getStrapiMediaUrl(product.brand?.logo?.formats?.thumbnail?.url) || "/placeholder.svg"}
                    alt={product.brand?.name || ""}
                    width={32}
                    height={32}
                  />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                hasValidUrl(image?.formats?.thumbnail?.url) && (
                  <div key={index}>
                    <button
                      key={index}
                      onClick={() => {
                        if (selectedImage !== index) {
                          setFade(true);
                          setTimeout(() => {
                            setSelectedImage(index);
                          }, 250);
                        }
                      }}
                      className={`aspect-square bg-white rounded-lg border-2 overflow-hidden transition-all ${selectedImage === index ? "border-primary" : "border-default hover:border-hover"}`}
                    >
                      <Image
                        src={getBestThumbUrl(image)}
                        alt={`${product.name}-image-${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                  {
                    hasValidUrl(product.brand?.logo?.formats?.thumbnail?.url) && (
                      <Image
                        src={getStrapiMediaUrl(product.brand?.logo?.formats?.thumbnail?.url)!}
                        alt={product.brand?.name || ""}
                        width={20}
                        height={20}
                      />
                    )
                  }
                  <span className="text-sm font-medium text-muted">
                    {product.brand?.name}
                  </span>
                </div>
                <Badge variant="outline" className="border-default text-muted">
                  {product.category?.name}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-main mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 text-yellow-400 fill-current}`}
                    />
                  ))}
                  <span className="text-sm text-muted ml-2">
                    {5} ({18000} reseñas)
                  </span>
                </div>
              </div>
              <p className="text-muted text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted">
                Ideal para:
              </span>
              {product.places?.map((place) => (
                <Badge
                  key={place.id}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 flex items-center gap-1.5"
                >
                  {
                    hasValidUrl(place.icon?.formats?.thumbnail?.url) && (
                      <Image
                        src={getStrapiMediaUrl(place.icon?.formats?.thumbnail?.url) || "/placeholder.svg"}
                        alt={place.name}
                        width={16}
                        height={16}
                      />
                    )
                  }
                  {place.name}
                </Badge>
              ))}
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
                <div className="text-right">
                  <p className="text-sm text-muted">Stock disponible</p>
                  <p className={`text-lg font-semibold ${product?.quantity && product?.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product?.quantity || 0} unidades
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="quantity"
                    className="text-sm font-medium text-muted"
                  >
                    Cantidad:
                  </label>
                  <div className="flex items-center justify-center gap-2 my-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMinus}
                      className="h-8 w-8 p-0"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="text-lg font-medium w-8 text-center">{maxQuantity ? quantity : 0}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePlus}
                      className="h-8 w-8 p-0"
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="btn-primary w-full h-12 text-lg font-medium text-white hover:text-main hover:border-main border-main"
                disabled={(product.quantity || 0) === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {(product.quantity || 0) === 0
                  ? "Sin stock"
                  : `Agregar al carrito - ${formatPrice(product.price * quantity)}`}
              </Button>

              <div className="grid grid-cols-3 gap-4 text-center text-sm text-muted">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="h-5 w-5" />
                  <span>Envío gratis</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Shield className="h-5 w-5" />
                  <span>12 meses de garantía</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Award className="h-5 w-5" />
                  <span>Calidad premium</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Especificaciones técnicas */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="card-custom">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Especificaciones
              </h3>
              <div className="space-y-3 text-sm">
                {
                  product?.attributes?.map((attribute) => (
                    <div key={attribute.id} className="flex justify-between">
                      <span className="text-muted">{attribute.attribute.name}:</span>
                      <TooltipText numberOfCharacters={30} className="font-medium">{attribute.value}</TooltipText>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          <Card className="card-custom">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Características
              </h3>
              <ul className="space-y-2 text-sm">
                {productFixed.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="card-custom">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-main mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Contenido de la caja
              </h3>
              <ul className="space-y-2 text-sm">
                {productFixed.inBox?.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 pt-4 border-t border-default">
                <h4 className="font-medium text-main mb-2">Certificaciones</h4>
                <div className="flex flex-wrap gap-2">
                  {productFixed.certifications?.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 