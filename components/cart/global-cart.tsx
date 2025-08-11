"use client"

import { useState } from "react"
import { CartButton } from "@/components/cart/cart-button"
import { CartPanel } from "@/components/cart/cart-panel"
import { CartPersistence } from "./cart-persistence"

export function GlobalCart() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <>
      <CartButton onClick={() => setIsCartOpen(true)} />
      <CartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CartPersistence />
    </>
  )
}
