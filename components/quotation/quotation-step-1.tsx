"use client"

import { Loader2 } from "lucide-react"
import { QuotationForm, FormField, FormSelect } from "@/components/quotation/quotation-form"
import { usePlaces } from "@/hooks/use-fetch"
import { Place } from "@/types/api"

interface QuotationStep1Props {
  onValidationChange?: (isValid: boolean) => void
}

export function QuotationStep1({ onValidationChange }: QuotationStep1Props) {
  const { data: placesResponse, isLoading, error, refetch } = usePlaces()
  const places = placesResponse?.data || []

  const formItems = [
    {
      id: 'selectedPlace',
      required: true
    }
  ]

  const placeOptions = places.map((place: Place) => ({
    value: place.id.toString(),
    label: place.name,
    description: place.description
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando lugares...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700">Error al cargar los lugares. Por favor, intenta de nuevo.</p>
          <button 
            onClick={refetch} 
            className="mt-4 text-sm text-red-600 hover:text-red-800 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">
          ¿Dónde necesitas instalar el sistema?
        </h2>
        <p className="text-slate-600">
          Selecciona el lugar donde planeas instalar las cámaras de seguridad
        </p>
      </div>

      <QuotationForm 
        stepId={1}
        formItems={formItems}
      >
        <FormField 
          id="selectedPlace" 
          label="Lugar de instalación" 
          required
        >
          <FormSelect
            id="selectedPlace"
            placeholder="Selecciona un lugar..."
            options={placeOptions}
          />
        </FormField>
      </QuotationForm>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Consejo:</strong> La selección del lugar nos ayuda a recomendarte el tipo de productos más adecuados para tu espacio específico.
        </p>
      </div>
    </div>
  )
} 