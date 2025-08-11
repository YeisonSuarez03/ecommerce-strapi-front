"use client"

import { usePlaces, useCategories, useProducts, createApiHook } from "@/hooks/use-fetch"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

// Example of creating a custom hook for a specific endpoint
const useCustomEndpoint = createApiHook<any>('/api/custom-endpoint')

export function UseFetchExample() {
  // Basic usage
  const { data: places, isLoading: placesLoading, error: placesError, refetch: refetchPlaces } = usePlaces()
  
  // With retry options
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useCategories({
    retryCount: 3,
    retryDelay: 2000
  })
  
  // With query parameters
  const { data: products, isLoading: productsLoading } = useProducts({
    limit: '10',
    sortBy: 'price-low'
  })
  
  // Custom hook usage
  const { data: customData, isLoading: customLoading } = useCustomEndpoint()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">useFetch Hook Examples</h2>
      
      {/* Places Example */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Places</h3>
        {placesLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading places...</span>
          </div>
        ) : placesError ? (
          <div className="text-red-600">
            <p>Error: {placesError}</p>
            <Button onClick={refetchPlaces} size="sm" className="mt-2">
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </div>
        ) : (
          <div>
            <p>Loaded {places?.data?.length || 0} places</p>
            <ul className="mt-2 space-y-1">
              {places?.data?.slice(0, 3).map(place => (
                <li key={place.id} className="text-sm">
                  {place.name} - {place.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Categories Example */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Categories (with retry)</h3>
        {categoriesLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading categories...</span>
          </div>
        ) : categoriesError ? (
          <div className="text-red-600">
            <p>Error: {categoriesError}</p>
          </div>
        ) : (
          <div>
            <p>Loaded {categories?.data?.length || 0} categories</p>
            <ul className="mt-2 space-y-1">
              {categories?.data?.slice(0, 3).map(category => (
                <li key={category.id} className="text-sm">
                  {category.name} - {category.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Products Example */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Products (with query params)</h3>
        {productsLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading products...</span>
          </div>
        ) : (
          <div>
            <p>Loaded {products?.data?.length || 0} products</p>
            <ul className="mt-2 space-y-1">
              {products?.data?.slice(0, 3).map(product => (
                <li key={product.id} className="text-sm">
                  {product.name} - ${product.price}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Custom Hook Example */}
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Custom Hook</h3>
        {customLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading custom data...</span>
          </div>
        ) : (
          <div>
            <p>Custom data loaded: {customData ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  )
} 