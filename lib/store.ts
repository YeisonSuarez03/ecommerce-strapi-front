import { configureStore } from '@reduxjs/toolkit'
import cartReducer from "./features/cart/cartSlice"
import filtersReducer from "./features/filters/filtersSlice"
import whatsappTemplateReducer from "./features/whatsapp-template/whatsappTemplateSlice"
import quotationReducer from "./features/quotation/quotationSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      filters: filtersReducer,
      whatsappTemplate: whatsappTemplateReducer,
      quotation: quotationReducer,
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']