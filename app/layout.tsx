import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ReduxProvider from "@/components/providers/redux-provider"
import { Toaster } from "@/components/ui/toaster"
import { ThemePersistence } from "@/components/theme/theme-persistence"
import { Header } from "@/components/global/header"
import { Footer } from "@/components/global/footer"
import { FaviconServer } from "@/components/global/favicon-server"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketplace - Cámaras de Seguridad",
  description: "Encuentra las mejores cámaras de seguridad para tu hogar o negocio",
  generator: 'v0.dev',
  icons: {
    icon: '/favicon.ico',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <FaviconServer />
      </head>
      <body className={inter.className}>
        <Header />
        <ReduxProvider>
          <main className="min-h-screen">
            {children}
          </main>
          <ThemePersistence />
          <Toaster />
        </ReduxProvider>
        <Footer />
      </body>
    </html>
  )
}
