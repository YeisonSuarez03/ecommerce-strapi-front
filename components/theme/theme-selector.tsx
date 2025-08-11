"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Palette, Check, RotateCcw } from "lucide-react"
import { themes } from "@/lib/theme-config"
import { useTheme } from "@/hooks/use-theme"
import { toast } from "@/hooks/use-toast"

export function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, changeTheme, isLoaded } = useTheme()

  const handleThemeChange = (themeName: string) => {
    const success = changeTheme(themeName)
    if (success) {
      setIsOpen(false)
      toast({
        title: "Tema aplicado",
        description: `Se ha aplicado el tema ${themeName} y se ha guardado tu preferencia.`,
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "No se pudo aplicar el tema seleccionado.",
        variant: "destructive",
      })
    }
  }

  const resetToDefault = () => {
    handleThemeChange("default")
    toast({
      title: "Tema restablecido",
      description: "Se ha restablecido el tema por defecto.",
      variant: "success",
    })
  }

  // No mostrar hasta que se haya cargado el tema
  if (!isLoaded) return null

  if (!isOpen) {
    return (
      {/* <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 btn-outline shadow-lg"
      >
        <Palette className="h-4 w-4 mr-2" />
        Cambiar Tema
      </Button> */}
    )
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 card-custom shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-main flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Selector de Tema
          </span>
          <div className="flex gap-1">
            <Button
              onClick={resetToDefault}
              variant="ghost"
              size="sm"
              className="text-muted hover:text-primary"
              title="Restablecer tema por defecto"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-muted hover:text-primary"
            >
              ×
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted">Tu selección se guardará automáticamente</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(themes).map(([name, colors]) => (
          <div
            key={name}
            className={`p-3 rounded-lg border cursor-pointer transition-all ${
              currentTheme === name
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-default hover:border-hover hover:bg-gray-50"
            }`}
            onClick={() => handleThemeChange(name)}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-main capitalize flex items-center gap-2">
                {name}
                {currentTheme === name && <Check className="h-4 w-4 text-primary" />}
              </span>
              {currentTheme === name && <Badge className="badge-primary text-xs">Activo</Badge>}
            </div>
            <div className="flex gap-2">
              <div
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: `rgb(${colors.primary})` }}
                title="Color primario"
              />
              <div
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: `rgb(${colors.secondary})` }}
                title="Color secundario"
              />
              <div
                className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                style={{ backgroundColor: `rgb(${colors.default})` }}
                title="Color por defecto"
              />
            </div>
            <div className="mt-2 text-xs text-muted">
              {name === "default" && "Tema original de la aplicación"}
              {name === "blue" && "Tonos azules profesionales"}
              {name === "green" && "Colores verdes naturales"}
              {name === "purple" && "Tonos púrpuras elegantes"}
              {name === "red" && "Colores rojos vibrantes"}
            </div>
          </div>
        ))}

        <div className="pt-3 border-t border-default">
          <div className="text-xs text-muted text-center">
            💡 Tu tema se guarda automáticamente y se aplicará la próxima vez que visites la página
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
