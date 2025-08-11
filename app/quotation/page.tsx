import { Suspense } from "react"
import type { Metadata } from "next"
import QuotationClient from "./quotation-client"

export const metadata: Metadata = {
  title: "Cotizador - Marketplace Cámaras de Seguridad",
  description: "¿No sabes qué productos deberías comprar? Deja que te guíemos. Responde las preguntas y deja que te recomendemos los productos más adecuados.",
  openGraph: {
    title: "Cotizador - Marketplace Cámaras de Seguridad",
    description: "¿No sabes qué productos deberías comprar? Deja que te guíemos. Responde las preguntas y deja que te recomendemos los productos más adecuados.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cotizador - Marketplace Cámaras de Seguridad",
    description: "¿No sabes qué productos deberías comprar? Deja que te guíemos. Responde las preguntas y deja que te recomendemos los productos más adecuados.",
  },
}

export default function QuotationPage() {

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <QuotationClient />
        </Suspense>
      </div>
    </main>
  )
} 