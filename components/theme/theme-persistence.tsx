"use client"

import { useEffect } from "react"
import { initializeTheme } from "@/lib/theme-config"

export function ThemePersistence() {
  useEffect(() => {
    // Aplicar el tema guardado al cargar la aplicación
    initializeTheme()
  }, [])

  return null
}
