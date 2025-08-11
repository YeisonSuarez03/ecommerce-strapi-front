"use client"

import { QuotationStep1 } from "@/components/quotation/quotation-step-1"
import { QuotationStep2 } from "@/components/quotation/quotation-step-2"
import { QuotationSteps } from "@/components/quotation/quotation-steps"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { buildQuotationQueryString } from "@/lib/utils/quotation-to-filters"
import { useAppDispatch } from "@/lib/hooks"
import { clearAllFilters, initializeFilters } from "@/lib/features/filters/filtersSlice"

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

function SuccessResult({ title = "Form submitted successfully!", message = "Thank you for your time. We’ve received your information and will be in touch soon.", link = "" }) {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex justify-center mb-4"
        >
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>

        <button
          onClick={() => router.push(link)}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-medium shadow-md transition-all duration-200"
        >
          Go back home
        </button>
      </motion.div>
    </div>
  );
}


type CompletedType = {
  completed: boolean
  queryString: string
}

export default function QuotationClient() {
  const [isStarted, setIsStarted] = useState(false)
  const [isCompleted, setIsCompleted] = useState<CompletedType>({
    completed: false,
    queryString: ""
  })
  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleComplete = (formData: any) => {
    console.log("Quotation completed with data:", formData)
    
    // Transform quotation data to product filter parameters
    const queryString = buildQuotationQueryString(formData)
    setIsCompleted({
      completed: true,
      queryString
    })

    
    // Initialize filters with quotation data
    const filterData: any = {}
    
    if (formData.selectedPlace) {
      filterData.selectedPlaces = [parseInt(formData.selectedPlace)]
    }
    
    if (formData.selectedCategories && Array.isArray(formData.selectedCategories)) {
      filterData.selectedCategories = formData.selectedCategories.map((id: string) => parseInt(id))
    }
    
    // Set default sort to newest
    filterData.sortBy = 'newest'
    
    // Initialize filters in Redux
    dispatch(initializeFilters(filterData))
    
    // Redirect to products page with the quotation filters
    router.push(`/products${queryString}`)
    dispatch(clearAllFilters())
    setIsCompleted({
      completed: false,
      queryString
    })
  }

  const steps = [
    QuotationStep1,
    QuotationStep2,
    // Add more steps here as needed
  ]

  if (isStarted) {
    return (
      <div className="transition-all duration-500 ease-in-out">
        <QuotationSteps 
          steps={steps} 
          onComplete={handleComplete}
          className="py-8"
        />
      </div>
    )
  }

  return (

    isCompleted.completed ? (
      <div className="transition-all duration-500 ease-in-out">
        <SuccessResult 
          link={`/products${isCompleted.queryString}`}
        />
      </div>
    ) :
    <div className="max-w-4xl mx-auto w-full py-8 transition-all duration-500 ease-in-out">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Cotizador
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ¿No sabes qué productos deberías comprar? Deja que te guíemos. Responde las preguntas y deja que te recomendemos los productos más adecuados.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-1">
                ¿Cómo funciona?
              </h3>
              <p className="text-sm text-blue-700">
                Te haremos algunas preguntas sobre tus necesidades y preferencias. Con esta información, podremos recomendarte los productos más adecuados para ti.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <p className="text-sm text-slate-500 mb-6">
            El proceso toma aproximadamente 2-3 minutos
          </p>
          
          <Button 
            onClick={handleStart}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-medium"
          >
            <Play className="w-5 h-5 mr-2" />
            Comenzar Cotización
          </Button>
        </div>
      </div>
    </div>
  )
} 