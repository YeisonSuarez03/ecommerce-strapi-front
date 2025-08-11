import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { clearAllFilters } from '../filters/filtersSlice'

export interface QuotationFormData {
  [key: string]: any
}

interface QuotationState {
  currentStep: number
  totalSteps: number
  formData: QuotationFormData
  stepValidation: Record<number, boolean> // Track validation state for each step
  isCompleted: boolean
  isVisible: boolean
}

const initialState: QuotationState = {
  currentStep: 1,
  totalSteps: 2, // Updated to 2 steps
  formData: {},
  stepValidation: {}, // Initialize empty validation state
  isCompleted: false,
  isVisible: true,
}

const quotationSlice = createSlice({
  name: 'quotation',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setTotalSteps: (state, action: PayloadAction<number>) => {
      state.totalSteps = action.payload
    },
    updateFormData: (state, action: PayloadAction<{ key: string; value: any }>) => {
      const { key, value } = action.payload
      state.formData[key] = value
    },
    setFormData: (state, action: PayloadAction<QuotationFormData>) => {
      state.formData = action.payload
    },
    // New action to update step validation
    updateStepValidation: (state, action: PayloadAction<{ stepNumber: number; isValid: boolean }>) => {
      const { stepNumber, isValid } = action.payload
      state.stepValidation[stepNumber] = isValid
    },
    // New action to set validation for multiple steps at once
    setStepValidation: (state, action: PayloadAction<Record<number, boolean>>) => {
      state.stepValidation = action.payload
    },
    // New action to clear validation for a specific step
    clearStepValidation: (state, action: PayloadAction<number>) => {
      delete state.stepValidation[action.payload]
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      const step = action.payload
      if (step >= 1 && step <= state.totalSteps) {
        state.currentStep = step
      }
    },
    completeQuotation: (state) => {
      state.isCompleted = true
      state.isVisible = false
    },
    resetQuotation: (state) => {
      state.currentStep = 1
      state.formData = {}
      state.stepValidation = {} // Reset validation state
      state.isCompleted = false
      state.isVisible = true
    },
    hideQuotation: (state) => {
      state.isVisible = false
    },
    showQuotation: (state) => {
      state.isVisible = true
    },
  },
  extraReducers: (builder) => {
    builder.addCase(clearAllFilters, (state) => {
      // When filters are cleared, also reset quotation state
      state.currentStep = 1
      state.formData = {}
      state.stepValidation = {}
      state.isCompleted = false
      state.isVisible = true
    })
  },
})

export const {
  setCurrentStep,
  setTotalSteps,
  updateFormData,
  setFormData,
  updateStepValidation,
  setStepValidation,
  clearStepValidation,
  nextStep,
  previousStep,
  goToStep,
  completeQuotation,
  resetQuotation,
  hideQuotation,
  showQuotation,
} = quotationSlice.actions

export default quotationSlice.reducer 