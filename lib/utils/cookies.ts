export const QUOTATION_COOKIE_NAME = "quotation:data"
export const QUOTATION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function setCookie(name: string, value: string, maxAge: number = QUOTATION_COOKIE_MAX_AGE): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`
  }
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

export function removeCookie(name: string): void {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  }
}

export function saveQuotationData(data: any): void {
  try {
    const jsonData = JSON.stringify(data)
    setCookie(QUOTATION_COOKIE_NAME, jsonData)
  } catch (error) {
    console.error('Error saving quotation data to cookie:', error)
  }
}

export function loadQuotationData(): any {
  try {
    const cookieData = getCookie(QUOTATION_COOKIE_NAME)
    if (cookieData) {
      return JSON.parse(cookieData)
    }
  } catch (error) {
    console.error('Error loading quotation data from cookie:', error)
  }
  return null
}

export function clearQuotationData(): void {
  removeCookie(QUOTATION_COOKIE_NAME)
} 