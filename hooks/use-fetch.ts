"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  PlacesResponse, 
  CategoriesResponse, 
  BrandsResponse, 
  ProductsResponse,
  Place,
  Category,
  Brand,
  Product
} from '@/types/api'

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  immediate?: boolean
  retryCount?: number
  retryDelay?: number
}

interface UseFetchReturn<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  setData: (data: T) => void
  setError: (error: string | null) => void
  reset: () => void
}

export function useFetch<T = any>(
  url: string,
  options: FetchOptions = {}
): UseFetchReturn<T> {
  const { 
    method = 'GET', 
    headers = {}, 
    body, 
    immediate = true,
    retryCount = 0,
    retryDelay = 1000
  } = options

  // Separate states for better control
  const [data, setDataState] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setErrorState] = useState<string | null>(null)
  const [retryAttempts, setRetryAttempts] = useState(0)

  // Use refs to store the latest values to avoid dependency issues
  const urlRef = useRef(url)
  const methodRef = useRef(method)
  const headersRef = useRef(headers)
  const bodyRef = useRef(body)

  // Update refs when props change
  useEffect(() => {
    urlRef.current = url
    methodRef.current = method
    headersRef.current = headers
    bodyRef.current = body
  }, [url, method, headers, body])

  const fetchData = useCallback(async (isRetry = false) => {
    try {
      setIsLoading(true)
      setErrorState(null)

      const fetchOptions: RequestInit = {
        method: methodRef.current,
        headers: {
          'Content-Type': 'application/json',
          ...headersRef.current
        }
      }

      if (bodyRef.current && methodRef.current !== 'GET') {
        fetchOptions.body = JSON.stringify(bodyRef.current)
      }

      const response = await fetch(urlRef.current, fetchOptions)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()
      setDataState(responseData)
      setIsLoading(false)
      setRetryAttempts(0) // Reset retry attempts on success
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      
      // Handle retry logic
      if (retryCount > 0 && retryAttempts < retryCount && !isRetry) {
        setRetryAttempts(prev => prev + 1)
        setTimeout(() => {
          fetchData(true)
        }, retryDelay)
        return
      }

      setErrorState(errorMessage)
      setIsLoading(false)
    }
  }, [retryCount, retryDelay]) // Only depend on retry options, not on URL/body/headers

  const setData = useCallback((newData: T) => {
    setDataState(newData)
  }, [])

  const setError = useCallback((newError: string | null) => {
    setErrorState(newError)
  }, [])

  const reset = useCallback(() => {
    setDataState(null)
    setIsLoading(false)
    setErrorState(null)
    setRetryAttempts(0)
  }, [])

  // Only run on mount and when immediate changes
  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [immediate, fetchData])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    setData,
    setError,
    reset
  }
}

// Specialized hooks for common endpoints
export function usePlaces(options?: Omit<FetchOptions, 'method' | 'body'>) {
  return useFetch<PlacesResponse>('/api/places', options)
}

export function useCategories(params?: Record<string, string>, options?: Omit<FetchOptions, 'method' | 'body'>) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
  return useFetch<CategoriesResponse>(`/api/categories${queryString}`, options)
}

export function useProducts(params?: Record<string, string>, options?: Omit<FetchOptions, 'method' | 'body'>) {
  const queryString = params ? `?${new URLSearchParams(params).toString()}` : ''
  return useFetch<ProductsResponse>(`/api/products${queryString}`, options)
}

export function useBrands(options?: Omit<FetchOptions, 'method' | 'body'>) {
  return useFetch<BrandsResponse>('/api/brands', options)
}

// Utility function to create custom hooks for any endpoint
export function createApiHook<T>(endpoint: string) {
  return (options?: Omit<FetchOptions, 'method' | 'body'>) => {
    return useFetch<T>(endpoint, options)
  }
}

// Example of creating a custom hook for a specific endpoint
export const useHomePage = createApiHook<any>('/api/home-page') 