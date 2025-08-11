"use client"

import { useState, useEffect } from "react"
import { initializeTheme, applyTheme, loadThemeFromStorage } from "@/lib/theme-config"

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState("default")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Inicializar el tema al montar el componente
    const savedTheme = initializeTheme()
    setCurrentTheme(savedTheme)
    setIsLoaded(true)
  }, [])

  const changeTheme = (themeName: string) => {
    const success = applyTheme(themeName)
    if (success) {
      setCurrentTheme(themeName)
    }
    return success
  }

  const getCurrentTheme = () => {
    return loadThemeFromStorage()
  }

  return {
    currentTheme,
    changeTheme,
    getCurrentTheme,
    isLoaded,
  }
}
