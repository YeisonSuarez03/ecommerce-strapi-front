"use client"

import { Loader2 } from "lucide-react"
import { QuotationForm, FormField, FormMultiSelect } from "@/components/quotation/quotation-form"
import { useCategories } from "@/hooks/use-fetch"
import { Category } from "@/types/category"

interface QuotationStep2Props {
  onValidationChange?: (isValid: boolean) => void
}

const ID_CAMARAS_CATEGORY = "49"

export function QuotationStep2({ onValidationChange }: QuotationStep2Props) {
  const { data: categoriesResponse, isLoading, error, refetch } = useCategories({
    id: ID_CAMARAS_CATEGORY,
    getImage: "true"
  })
  const categories = categoriesResponse?.data?.[0]?.child_categories || []

  const formItems = [
    {
      id: 'selectedCategories',
      required: true
    }
  ]

  const categoryOptions = categories.map((category: Category) => ({
    value: category.id.toString(),
    label: category.name,
    description: category?.description,
    image: category?.image
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Cargando categorías...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-700">Error al cargar las categorías. Por favor, intenta de nuevo.</p>
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
          ¿Qué tipo de productos te interesan?
        </h2>
        <p className="text-slate-600">
          Selecciona las categorías de productos que más te interesan para personalizar tu cotización
        </p>
      </div>

      <QuotationForm 
        stepId={2}
        formItems={formItems}
      >
        <FormField 
          id="selectedCategories" 
          label="Categorías de productos" 
          required
        >
          <FormMultiSelect
            id="selectedCategories"
            options={categoryOptions}
          />
        </FormField>
      </QuotationForm>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Consejo:</strong> Puedes seleccionar múltiples categorías. Esto nos ayudará a recomendarte los productos más relevantes para tus necesidades específicas.
        </p>
      </div>
    </div>
  )
} 