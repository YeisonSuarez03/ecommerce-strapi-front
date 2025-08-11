"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"

interface CartButtonProps {
  onClick: () => void
}

export function CartButton({ onClick }: CartButtonProps) {
  const { itemCount, isLoaded } = useAppSelector((state) => state.cart)

  // No mostrar el botón hasta que se haya cargado el estado desde localStorage
  if (!isLoaded) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        size="lg"
        className="relative bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full h-14 w-14 p-0"
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-secondary hover:bg-secondary text-white min-w-[24px] h-6 rounded-full flex items-center justify-center text-xs font-bold">
            {itemCount > 99 ? "+99" : itemCount}
          </Badge>
        )}
      </Button>
    </div>
  )
}
