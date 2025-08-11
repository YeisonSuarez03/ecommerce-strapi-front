export interface QuotationFormData {
  [key: string]: any
}

export interface QuotationStep {
  id: number
  title: string
  description?: string
  component: React.ReactNode
}

export interface QuotationResult {
  formData: QuotationFormData
  recommendations?: any[]
  timestamp: Date
} 