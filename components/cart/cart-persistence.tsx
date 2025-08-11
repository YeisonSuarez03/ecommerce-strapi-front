"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { loadCartFromStorage } from "@/lib/features/cart/cartSlice"

export function CartPersistence() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(loadCartFromStorage())
  }, [dispatch])

  return null
}
