"use client"

import React, { useEffect, useMemo } from "react"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { 
  setCurrentStep, 
  setTotalSteps, 
  setFormData, 
  nextStep, 
  previousStep, 
  completeQuotation 
} from "@/lib/features/quotation/quotationSlice"
import { saveQuotationData, loadQuotationData, clearQuotationData } from "@/lib/utils/cookies"

interface QuotationStepProps {
  // No props needed - validation is handled by Redux
}

interface QuotationStepsProps {
  steps: React.ComponentType<QuotationStepProps>[]
  onComplete?: (formData: any) => void
  className?: string
}

export function QuotationSteps({ steps, onComplete, className = "" }: QuotationStepsProps) {
  const { currentStep, totalSteps, formData, stepValidation, isCompleted } = useAppSelector((state) => state.quotation)
  const dispatch = useAppDispatch()

  // Initialize total steps when component mounts
  useEffect(() => {
    dispatch(setTotalSteps(steps.length))
  }, [steps])

  // Load saved data from cookie on mount
  useEffect(() => {
    const savedData = loadQuotationData()
    if (savedData) {
      dispatch(setFormData(savedData))
    }
  }, [])

  // Save data to cookie whenever form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveQuotationData(formData)
    }
  }, [formData])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      dispatch(nextStep())
    }
  }

  // Check if current step is valid using Redux state
  const isCurrentStepValid = useMemo(() => {
    return stepValidation[currentStep] ?? false
  }, [currentStep, stepValidation])

  const handlePrevious = () => {
    if (currentStep > 1) {
      dispatch(previousStep())
    }
  }

  const handleComplete = () => {
    if (onComplete) {
      onComplete(formData)
    }
    dispatch(completeQuotation())
    clearQuotationData()
  }

  const progress = (currentStep / totalSteps) * 100

  if (isCompleted) {
    return null
  }

  // Get the current step component
  const CurrentStepComponent = steps[currentStep - 1]

  return (
    <div className={`max-w-4xl mx-auto w-full ${className}`}>
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Paso {currentStep} de {totalSteps}
            </h2>
            <div className="text-sm text-slate-600">
              {Math.round(progress)}% completado
            </div>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          {/* Step Indicators */}
          <div className="flex items-center justify-between mt-4">
            {Array.from({ length: totalSteps }, (_, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber === currentStep
              const isCompleted = stepNumber < currentStep
              
              return (
                <div
                  key={stepNumber}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    isCompleted
                      ? "bg-green-600 text-white"
                      : isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Step Content */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <CurrentStepComponent />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid}
              className="flex text-white items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isCurrentStepValid}
              className="flex text-white items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Completar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
} 