import { GlobalCart } from "@/components/cart/global-cart"

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <GlobalCart />
    </>
  )
} 