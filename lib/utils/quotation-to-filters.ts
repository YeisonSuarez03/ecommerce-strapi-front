import { QuotationFormData } from "@/lib/features/quotation/quotationSlice"

/**
 * Transforms quotation form data into product filter query parameters
 * @param formData - The quotation form data
 * @returns Object with query parameters for the products page
 */
export function transformQuotationToFilters(formData: QuotationFormData): Record<string, string> {
  const params: Record<string, string> = {}
  
  // Transform selected place to places parameter
  if (formData.selectedPlace) {
    params.places = formData.selectedPlace
  }
  
  // Transform selected categories to categories parameter
  if (formData.selectedCategories && Array.isArray(formData.selectedCategories)) {
    params.categories = formData.selectedCategories.join(',')
  }
  
  // Set default sort to newest (most relevant for quotations)
  params.sortBy = 'newest'
  
  // Set page to 1 to start from the beginning
  params.page = '1'
  
  return params
}

/**
 * Builds a query string from quotation form data
 * @param formData - The quotation form data
 * @returns Query string for the products page
 */
export function buildQuotationQueryString(formData: QuotationFormData): string {
  const params = transformQuotationToFilters(formData)
  const queryString = new URLSearchParams(params).toString()
  return queryString ? `?${queryString}` : ''
} 