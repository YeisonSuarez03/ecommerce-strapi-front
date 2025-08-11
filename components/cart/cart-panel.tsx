"use client"

import { Minus, Plus, Trash2, ShoppingBag, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { removeItem, updateQuantity, clearCart } from "@/lib/features/cart/cartSlice"
import { fetchWhatsappTemplate } from "@/lib/features/whatsapp-template/whatsappTemplateSlice"
import { formatWhatsAppMessage } from "@/lib/utils/whatsapp-template"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import { useSound } from "@/hooks/use-sound"
import { formatPrice } from "@/lib/utils"
import { useEffect } from "react"

interface CartPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CartPanel({ isOpen, onClose }: CartPanelProps) {
  const { items, total, itemCount } = useAppSelector((state) => state.cart)
  const { template, isLoading, error, isLoaded } = useAppSelector((state) => state.whatsappTemplate)
  const dispatch = useAppDispatch()
  const { playSound } = useSound()

  // Fetch WhatsApp template when component mounts if not already loaded
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      dispatch(fetchWhatsappTemplate());
    }
  }, [dispatch, isLoaded, isLoading]);

  const handleUpdateQuantity = (id: number, quantity: number) => {
    playSound("info")
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleRemoveItem = (id: number) => {
    playSound("error")
    dispatch(removeItem(id))
  }

  const handleClearCart = () => {
    playSound("error")
    dispatch(clearCart())
  }

  const handleCheckout = async () => {
    if (!template) {
      toast({
        title: "Error",
        description: "No se pudo cargar la plantilla de WhatsApp",
        variant: "destructive",
      });
      return;
    }

    try {
      // Format the WhatsApp message using the template
      const { phoneNumber, message } = formatWhatsAppMessage(
        template,
        items,
        total,
        itemCount
      );

      // Encode the message for WhatsApp URL with proper handling of line breaks and emojis
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodedMessage}`;

      // Open WhatsApp with the formatted message
      window.open(whatsappUrl, '_blank');
      
      playSound("success");
      dispatch(clearCart());
      toast({
        title: "¡Pedido enviado!",
        description: "Se abrió WhatsApp con el resumen de tu compra",
        variant: "success",
      });
    } catch (error) {
      console.error("Error formatting WhatsApp message:", error);
      toast({
        title: "Error",
        description: "No se pudo formatear el mensaje de WhatsApp",
        variant: "destructive",
      });
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-[480px] flex flex-col bg-gray-50">
        <SheetHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Carrito de Compras
            </SheetTitle>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {itemCount} {itemCount === 1 ? "producto" : "productos"}
            </Badge>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Tu carrito está vacío</h3>
              <p className="text-slate-600">Agrega algunos productos para comenzar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex gap-4">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-contain flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-slate-900 text-sm leading-tight line-clamp-3">{item.name}</h4>
                            <p className="text-sm text-slate-600 mt-1">{item.brand}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 border-slate-200"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-2 w-2" />
                            </Button>
                            <span className="text-base font-medium text-slate-900 min-w-[2rem] text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-slate-200"
                            >
                              <Plus className="h-2 w-2" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-700">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-xs text-slate-500">{formatPrice(item.price)} c/u</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-slate-200 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleClearCart}
                    className="text-slate-600 border-slate-200 hover:bg-slate-50 bg-transparent"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Vaciar carrito
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium text-slate-900">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Envío:</span>
                    <span className="font-medium text-slate-900">Gratis</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-green-700">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={isLoading || !template}
                  className="w-full bg-green-600 hover:bg-green-800 text-white h-12 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed rounded"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    "Proceder a Comprar"
                  )}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 text-center">
                    Error al cargar la plantilla de WhatsApp
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
