"use client"

import { useTheme } from "@/hooks/use-theme"
import { Badge } from "@/components/ui/badge"
import { Palette } from "lucide-react"

export function ThemeStatus() {
  const { currentTheme, isLoaded } = useTheme()

  if (!isLoaded) return null

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Badge variant="outline" className="bg-white/90 backdrop-blur-sm shadow-sm border-default">
        <Palette className="h-3 w-3 mr-1" />
        Tema: {currentTheme}
      </Badge>
    </div>
  )
}
