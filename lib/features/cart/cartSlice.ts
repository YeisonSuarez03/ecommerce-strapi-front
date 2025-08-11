import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { toast } from "@/hooks/use-toast"

export interface CartItem {
  id: number
  name: string
  price: number
  brand: string
  image: string
  reference: string
  quantity: number
  maxQuantity?: number // new: for validation
}

interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isLoaded: boolean
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoaded: false,
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  return { total, itemCount }
}

const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart-items", JSON.stringify(items))
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    loadCartFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const savedItems = localStorage.getItem("cart-items")
        if (savedItems) {
          try {
            const items = JSON.parse(savedItems) as CartItem[]
            state.items = items
            const { total, itemCount } = calculateTotals(items)
            state.total = total
            state.itemCount = itemCount
          } catch (error) {
            console.error("Error loading cart from localStorage:", error)
          }
        }
      }
      state.isLoaded = true
    },
    // Add item with quantity/maxQuantity validation and sound
    // Returns: 'success' if added/updated, 'error' if max quantity reached, 'info' for other info
    addItem: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number; maxQuantity?: number }>) => {
      const { id, name, price, brand, image, reference, quantity = 1, maxQuantity } = action.payload
      const existingItem = state.items.find((item) => item.id === id)
      const maxQ = typeof maxQuantity === "number" ? maxQuantity : 1
      if (existingItem) {
        if (existingItem.maxQuantity !== undefined) {
          if (existingItem.quantity + quantity > existingItem.maxQuantity) {
            toast({
              title: "Cantidad máxima alcanzada",
              description: `No puedes agregar más de ${existingItem.maxQuantity} unidades de este producto.`,
              variant: "destructive",
            })
          }
        }
        existingItem.quantity += quantity
        toast({
          title: "Cantidad actualizada",
          description: `${name} - Cantidad: ${existingItem.quantity}`,
          variant: "success",
        })
        const { total, itemCount } = calculateTotals(state.items)
        state.total = total
        state.itemCount = itemCount
        saveToLocalStorage(state.items)
      } else {
        const addQty = Math.min(quantity, maxQ)
        state.items.push({ id, name, price, brand, image, reference, quantity: addQty, maxQuantity: maxQ })
        toast({
          title: "Producto agregado",
          description: `${name} se agregó al carrito (Cantidad: ${addQty})`,
          variant: "success",
        })
        const { total, itemCount } = calculateTotals(state.items)
        state.total = total
        state.itemCount = itemCount
        saveToLocalStorage(state.items)
      }
    },
    // Update quantity with maxQuantity validation and sound
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (item && action.payload.quantity > 0) {
        if (item.maxQuantity !== undefined && action.payload.quantity > item.maxQuantity) {
          toast({
            title: "Cantidad máxima alcanzada",
            description: `No puedes agregar más de ${item.maxQuantity} unidades de este producto.`,
            variant: "destructive",
          })
          return
        }
        item.quantity = action.payload.quantity
        toast({
          title: "Cantidad actualizada",
          description: `${item.name} - Nueva cantidad: ${action.payload.quantity}`,
          variant: "success",
        })
      } else if (item && action.payload.quantity <= 0) {
        state.items = state.items.filter((item) => item.id !== action.payload.id)
      }
      const { total, itemCount } = calculateTotals(state.items)
      state.total = total
      state.itemCount = itemCount
      saveToLocalStorage(state.items)
    },
    removeItem: (state, action: PayloadAction<number>) => {
      const removedItem = state.items.find((item) => item.id === action.payload)
      state.items = state.items.filter((item) => item.id !== action.payload)
      if (removedItem) {
        toast({
          title: "Producto eliminado",
          description: `${removedItem.name} se eliminó del carrito`,
          variant: "destructive",
        })
      }
      const { total, itemCount } = calculateTotals(state.items)
      state.total = total
      state.itemCount = itemCount
      saveToLocalStorage(state.items)
    },
    clearCart: (state) => {
      if (state.items.length > 0) {
        toast({
          title: "Carrito vaciado",
          description: "Todos los productos fueron eliminados del carrito",
          variant: "destructive",
        })
      }
      state.items = []
      state.total = 0
      state.itemCount = 0
      saveToLocalStorage([])
    },
  },
})

export const { loadCartFromStorage, addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
