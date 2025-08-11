"use client"

import { ReactNode, createContext, useContext, useEffect, useState, useCallback } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { updateFormData, updateStepValidation } from "@/lib/features/quotation/quotationSlice"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StrapiMedia } from "@/types/globals.strapi"
import Image from "next/image"
import { getStrapiMediaUrl } from "@/lib/strapi"
import { hasValidUrl } from "@/lib/utils"

export interface FormItem {
  id: string
  value: any
  required?: boolean
  valid?: boolean
  error?: string
}

interface FormContextType {
  formItems: FormItem[]
  updateFormItem: (id: string, value: any, valid?: boolean, error?: string) => void
  isStepValid: () => boolean
  getFormItem: (id: string) => FormItem | undefined
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function useQuotationForm() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useQuotationForm must be used within a QuotationFormProvider")
  }
  return context
}

interface QuotationFormProps {
  children: ReactNode
  stepId: number
  formItems: Omit<FormItem, 'value' | 'valid' | 'error'>[]
}

export function QuotationForm({ 
  children, 
  stepId, 
  formItems: initialFormItems = []
}: QuotationFormProps) {
  const dispatch = useAppDispatch()
  const [formItems, setFormItems] = useState<FormItem[]>(initialFormItems.map(item => ({
    ...item,
    value: undefined,
    valid: !item.required, // If not required, it's valid by default
    error: undefined
  })))

  const updateFormItem = (id: string, value: any, valid?: boolean, error?: string) => {
    setFormItems(prev => {
      const updated = prev.map(item => 
        item.id === id 
          ? { ...item, value, valid: valid ?? item.valid, error }
          : item
      )
      
      // Update Redux store
      dispatch(updateFormData({ key: id, value }))
      
      return updated
    })
  }

  const getFormItem = (id: string) => {
    return formItems.find(item => item.id === id)
  }

  const isStepValid = useCallback(() => {
    return formItems.every(item => {
      if (!item.required) return true
      return item.valid && item.value !== undefined && item.value !== null && item.value !== ""
    })
  }, [formItems])

  // Update Redux step validation whenever form validation changes
  useEffect(() => {
    const isValid = isStepValid()
    dispatch(updateStepValidation({ stepNumber: stepId, isValid }))
  }, [formItems, stepId, isStepValid])

  const contextValue: FormContextType = {
    formItems,
    updateFormItem,
    isStepValid,
    getFormItem
  }

  return (
    <FormContext.Provider value={contextValue}>
      <div className="space-y-6">
        {children}
      </div>
    </FormContext.Provider>
  )
}

// Form Field Components
interface FormFieldProps {
  id: string
  label: string
  required?: boolean
  children: ReactNode
  error?: string
}

export function FormField({ id, label, required, children, error }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-base font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Input Component
interface FormInputProps {
  id: string
  type?: "text" | "email" | "tel" | "number"
  placeholder?: string
  className?: string
  validation?: (value: string) => { valid: boolean; error?: string }
}

export function FormInput({ 
  id, 
  type = "text", 
  placeholder, 
  className = "",
  validation 
}: FormInputProps) {
  const { getFormItem, updateFormItem } = useQuotationForm()
  const formItem = getFormItem(id)

  const handleChange = (value: string) => {
    let valid = true
    let error: string | undefined

    if (validation) {
      const validationResult = validation(value)
      valid = validationResult.valid
      error = validationResult.error
    } else if (formItem?.required && !value.trim()) {
      valid = false
      error = "Este campo es requerido"
    }

    updateFormItem(id, value, valid, error)
  }

  return (
    <Input
      id={id}
      type={type}
      value={formItem?.value || ""}
      onChange={(e) => handleChange(e.target.value)}
      placeholder={placeholder}
      className={`input-custom ${
        formItem?.error 
          ? "border-red-300 bg-red-50" 
          : ""
      } ${className}`}
    />
  )
}

// Select Component
interface FormSelectOption {
  value: string
  label: string
  description?: string
  image?: StrapiMedia
}

interface FormSelectProps {
  id: string
  placeholder?: string
  options: FormSelectOption[]
  className?: string
}

export function FormSelect({ id, placeholder, options, className = "" }: FormSelectProps) {
  const { getFormItem, updateFormItem } = useQuotationForm()
  const formItem = getFormItem(id)

  const handleChange = (value: string) => {
    const valid = value !== ""
    const error = valid ? undefined : "Este campo es requerido"
    updateFormItem(id, value, valid, error)
  }

  return (
    <Select 
      value={formItem?.value || ""} 
      onValueChange={handleChange}
    >
      <SelectTrigger className={`input-custom ${className}`}>
        <SelectValue placeholder={placeholder || "Selecciona una opción..."} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Radio Group Component
interface FormRadioGroupProps {
  id: string
  options: FormSelectOption[]
  className?: string
}

export function FormRadioGroup({ id, options, className = "" }: FormRadioGroupProps) {
  const { getFormItem, updateFormItem } = useQuotationForm()
  const formItem = getFormItem(id)

  const handleChange = (value: string) => {
    const valid = value !== ""
    const error = valid ? undefined : "Este campo es requerido"
    updateFormItem(id, value, valid, error)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name={id}
            value={option.value}
            checked={formItem?.value === option.value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <div className="flex flex-col">
            <span className="text-base font-medium text-slate-900">{option.label}</span>
            {option.description && (
              <span className="text-sm text-slate-500">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}

// Checkbox Group Component
interface FormCheckboxGroupProps {
  id: string
  options: FormSelectOption[]
  className?: string
}

export function FormCheckboxGroup({ id, options, className = "" }: FormCheckboxGroupProps) {
  const { getFormItem, updateFormItem } = useQuotationForm()
  const formItem = getFormItem(id)
  const selectedValues = (formItem?.value as string[]) || []

  const handleChange = (value: string, checked: boolean) => {
    let newValues: string[]
    if (checked) {
      newValues = [...selectedValues, value]
    } else {
      newValues = selectedValues.filter(v => v !== value)
    }
    
    const valid = newValues.length > 0
    const error = valid ? undefined : "Debes seleccionar al menos una opción"
    updateFormItem(id, newValues, valid, error)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={(e) => handleChange(option.value, e.target.checked)}
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
          <div className="flex flex-col">
            <span className="text-base font-medium text-slate-900">{option.label}</span>
            {option.description && (
              <span className="text-sm text-slate-500">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  )
} 

// Multi-Select Component for Categories
interface FormMultiSelectProps {
  id: string
  placeholder?: string
  options: FormSelectOption[]
  className?: string
}

export function FormMultiSelect({ id, placeholder, options, className = "" }: FormMultiSelectProps) {
  const { getFormItem, updateFormItem } = useQuotationForm()
  const formItem = getFormItem(id)
  const selectedValues = (formItem?.value as string[]) || []

  const handleAdd = (value: string) => {
    if (!selectedValues.includes(value)) {
      const newValues = [...selectedValues, value]
      const valid = newValues.length > 0
      const error = valid ? undefined : "Debes seleccionar al menos una categoría"
      updateFormItem(id, newValues, valid, error)
    }
  }

  const handleRemove = (valueToRemove: string) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove)
    const valid = newValues.length > 0
    const error = valid ? undefined : "Debes seleccionar al menos una categoría"
    updateFormItem(id, newValues, valid, error)
  }

  const handleRemoveAll = () => {
    updateFormItem(id, [], false, "Debes seleccionar al menos una categoría")
  }

  const getSelectedLabels = () => {
    return selectedValues.map(value => {
      const option = options.find(opt => opt.value === value)
      return option?.label || value
    })
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Categories Display */}
      {selectedValues.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">Categorías seleccionadas:</span>
            <button
              type="button"
              onClick={handleRemoveAll}
              className="text-xs text-red-600 hover:text-red-800 underline"
            >
              Remover todas
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {getSelectedLabels().map((label, index) => (
              <div
                key={selectedValues[index]}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(selectedValues[index])}
                  className="text-blue-600 hover:text-blue-800 text-lg font-bold leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Seleccionar categorías:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value)
            return (
              <label
                key={option.value}
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-colors ${
                  isSelected
                    ? "bg-blue-50 border border-blue-200"
                    : "hover:bg-slate-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleAdd(option.value)
                    } else {
                      handleRemove(option.value)
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    {
                      // hasValidUrl(option.image?.formats?.thumbnail?.url) && 
                        <Image src={getStrapiMediaUrl(option.image?.formats?.thumbnail?.url) || "/placeholder.svg"} alt={option.label} width={20} height={20} />
                    }
                    <span className="text-sm font-medium text-slate-900">{option.label}</span>
                  </div>
                  {option.description && (
                    <span className="text-xs text-slate-500">{option.description}</span>
                  )}
                </div>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
} 