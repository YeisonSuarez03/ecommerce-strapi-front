"use client";

import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Place } from "@/types/places";
import { ProductFilters } from "@/types/product";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { CategoryAccordion } from "./category-accordion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import {
  setSearchTerm,
  setSelectedBrands,
  setSelectedCategories,
  setSelectedPlaces,
  setPriceRange,
  setSortBy,
  setServerPriceRange,
  clearAllFilters,
  initializeFilters,
} from "@/lib/features/filters/filtersSlice";

export interface ProductFiltersMenuClientProps extends Omit<ProductFilters, 'category' | 'brand' | 'place' | 'minPrice' | 'maxPrice'> {
  brands: Brand[];
  categories: Category[];
  places: Place[];
  selectedBrands: number[];
  selectedCategories: number[];
  selectedPlaces: number[];
  priceMin: number;
  priceMax: number;
  sortBy: ProductFilters['sortBy'];
}

// Helper to get priceMin/priceMax from query params
function getInitialPriceRange(searchParams: URLSearchParams, serverMin: number, serverMax: number) {
  const min = searchParams.get("priceMin") ? Number(searchParams.get("priceMin")) : serverMin;
  const max = searchParams.get("priceMax") ? Number(searchParams.get("priceMax")) : serverMax;
  return [min, max];
}

export default function ProductFiltersMenuClient({
  brands,
  categories,
  places,
  selectedBrands: initialBrands,
  selectedCategories: initialCategories,
  selectedPlaces: initialPlaces,
  priceMin: initialPriceMin,
  priceMax: initialPriceMax,
  sortBy: initialSortBy,
}: ProductFiltersMenuClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  const isInitialized = useRef(false);

  // Get state from Redux
  const {
    searchTerm,
    selectedBrands,
    selectedCategories,
    selectedPlaces,
    priceRange,
    sortBy,
    serverMin,
    serverMax,
  } = useSelector((state: RootState) => state.filters);

  // Debounce all filter state
  const [debouncedSearchTerm] = useDebounce(searchTerm, 700);
  const [debouncedBrands] = useDebounce(selectedBrands, 700);
  const [debouncedCategories] = useDebounce(selectedCategories, 700);
  const [debouncedPlaces] = useDebounce(selectedPlaces, 700);
  const [debouncedPriceRange] = useDebounce(priceRange, 700);
  const [debouncedSortBy] = useDebounce(sortBy, 700);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize filters only once on client side
  useEffect(() => {
    if (!isClient || isInitialized.current) return;
    
    // Initialize filters from props
    dispatch(initializeFilters({
      searchTerm: searchParams.get("search") || "",
      selectedBrands: initialBrands || [],
      selectedCategories: initialCategories || [],
      selectedPlaces: initialPlaces || [],
      priceRange: [initialPriceMin ?? 0, initialPriceMax ?? 1500],
      sortBy: initialSortBy || "newest",
    }));

    // Fetch server price range
    fetch("/api/products/price-range")
      .then(res => res.json())
      .then(({ min, max }) => {
        dispatch(setServerPriceRange({ min, max }));
        // Only update priceRange if no priceMin/priceMax in query params
        const urlParams = new URLSearchParams(window.location.search);
        const hasMin = urlParams.has("priceMin");
        const hasMax = urlParams.has("priceMax");
        if (!hasMin && !hasMax) {
          dispatch(setPriceRange([min, max]));
        } else {
          const [initialMin, initialMax] = getInitialPriceRange(urlParams, min, max);
          dispatch(setPriceRange([initialMin, initialMax]));
        }
      })
      .catch(() => {
        dispatch(setServerPriceRange({ min: 0, max: 1500000 }));
        dispatch(setPriceRange([0, 1500000]));
      });

    isInitialized.current = true;
  }, [isClient]); // Only depend on isClient, not on props or searchParams

  // Update URL query params after debounce
  useEffect(() => {
    if (!isClient || !isInitialized.current) return; // Don't update URL until initialized
    
    const params = new URLSearchParams();
    if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
    if (debouncedBrands.length > 0) params.set("brands", debouncedBrands.join(","));
    if (debouncedCategories.length > 0) params.set("categories", debouncedCategories.join(","));
    if (debouncedPlaces.length > 0) params.set("places", debouncedPlaces.join(","));
    if (debouncedPriceRange[0] !== 0) params.set("priceMin", String(debouncedPriceRange[0]));
    if (debouncedPriceRange[1] !== 1500) params.set("priceMax", String(debouncedPriceRange[1]));
    if (debouncedSortBy && debouncedSortBy !== "newest") params.set("sortBy", debouncedSortBy);
    // Reset page to 1 when filters change
    params.set("page", "1");
    router.replace(`?${params.toString()}`);
  }, [isClient, debouncedSearchTerm, debouncedBrands, debouncedCategories, debouncedPlaces, debouncedPriceRange, debouncedSortBy, router]);

  const updateFilter = useCallback((key: string, value: any) => {
    if (!isClient) return;
    
    const params = new URLSearchParams(searchParams.toString());
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      } else {
        params.delete(key);
      }
    } else {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`?${params.toString()}`);
  }, [isClient, router, searchParams]);

  // Clear all filters
  const handleClearAllFilters = () => {
    if (!isClient) return;
    
    dispatch(clearAllFilters());
    router.replace("/products"); // This will clear all query params and trigger SSR re-render
  };

  // Use initial values for server-side rendering to prevent hydration mismatch
  const displaySearchTerm = isClient ? searchTerm : (searchParams.get("search") || "");
  const displaySelectedBrands = isClient ? selectedBrands : (initialBrands || []);
  const displaySelectedCategories = isClient ? selectedCategories : (initialCategories || []);
  const displaySelectedPlaces = isClient ? selectedPlaces : (initialPlaces || []);
  const displayPriceRange = isClient ? priceRange : [initialPriceMin ?? 0, initialPriceMax ?? 1500];
  const displaySortBy = isClient ? sortBy : (initialSortBy || "newest");
  const displayServerMin = isClient ? serverMin : 0;
  const displayServerMax = isClient ? serverMax : 1500000;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-semibold text-main mb-3">Buscar</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light h-4 w-4" />
          <Input
            placeholder="Buscar productos..."
            value={displaySearchTerm}
            onChange={e => isClient && dispatch(setSearchTerm(e.target.value))}
            className="input-custom pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-main mb-3">Precio</h3>
        <div className="px-2">
          <Slider 
            value={displayPriceRange} 
            onValueChange={([min, max]) => isClient && dispatch(setPriceRange([min, max]))} 
            max={displayServerMax} 
            min={displayServerMin} 
            step={10} 
            className="mb-4" 
          />
          <div className="flex justify-between text-sm text-muted mb-2">
            <div className="text-center">
              <span className="block text-xs text-light">Mínimo</span>
              <span className="font-medium">{formatPrice(displayPriceRange[0])}</span>
            </div>
            <div className="text-center">
              <span className="block text-xs text-light">Máximo</span>
              <span className="font-medium">{formatPrice(displayPriceRange[1])}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted">
            <span>
              Rango: {formatPrice(displayPriceRange[0])} - {formatPrice(displayPriceRange[1])}
            </span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-main mb-3">Marcas</h3>
        <div className="space-y-2">
          {brands.map(brand => (
            <div key={brand.id} className="flex items-center space-x-2 gap-2">
              <input
                type="checkbox"
                id={`brand-${brand.id}`}
                checked={displaySelectedBrands.includes(brand.id)}
                onChange={e => {
                  if (!isClient) return;
                  
                  const newArr = e.target.checked
                    ? [...displaySelectedBrands, brand.id]
                    : displaySelectedBrands.filter(id => id !== brand.id);
                  dispatch(setSelectedBrands(newArr));
                  updateFilter("brands", newArr);
                }}
                className="cursor-pointer"
              />
              <label htmlFor={`brand-${brand.id}`} className="text-sm text-muted flex items-center gap-2 cursor-pointer">
                {brand.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="font-semibold text-main mb-3">Categorías</h3>
        <CategoryAccordion
          categories={categories}
          selectedCategories={displaySelectedCategories}
          onCategoryChange={(categoryId, checked) => {
            if (!isClient) return;
            
            let newArr: number[];
            
            if (checked) {
              // When checking a category, add it and all its children
              const category = categories.find(cat => cat.id === categoryId);
              const childIds = category?.child_categories?.map(child => child.id) || [];
              newArr = [...displaySelectedCategories, categoryId, ...childIds];
            } else {
              // When unchecking a category, remove it and all its children
              const category = categories.find(cat => cat.id === categoryId);
              const childIds = category?.child_categories?.map(child => child.id) || [];
              newArr = displaySelectedCategories.filter(id => id !== categoryId && !childIds.includes(id));
            }
            
            dispatch(setSelectedCategories(newArr));
            updateFilter("categories", newArr);
          }}
        />
      </div>

      {/* Places */}
      <div>
        <h3 className="font-semibold text-main mb-3">Lugar de uso</h3>
        <div className="space-y-2">
          {places.map(place => (
            <div key={place.id} className="flex items-center space-x-2 gap-2">
              <input
                type="checkbox"
                id={`place-${place.id}`}
                checked={displaySelectedPlaces.includes(place.id)}
                onChange={e => {
                  if (!isClient) return;
                  
                  const newArr = e.target.checked
                    ? [...displaySelectedPlaces, place.id]
                    : displaySelectedPlaces.filter(id => id !== place.id);
                  dispatch(setSelectedPlaces(newArr));
                  updateFilter("places", newArr);
                }}
                className="cursor-pointer"
              />
              <label htmlFor={`place-${place.id}`} className="text-sm text-muted flex items-center gap-2 cursor-pointer">
                {place.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-main mb-3">Ordenar por</h3>
        <Select value={displaySortBy} onValueChange={val => {
          if (!isClient) return;
          
          if (val === "newest" || val === "oldest" || val === "price-low" || val === "price-high") {
            dispatch(setSortBy(val));
            updateFilter("sortBy", val);
          }
        }}>
          <SelectTrigger className="input-custom">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más reciente</SelectItem>
            <SelectItem value="oldest">Más antiguo</SelectItem>
            <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
            <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" onClick={handleClearAllFilters} className="btn-outline w-full bg-transparent">
        <X className="h-4 w-4 mr-2" />
        Limpiar filtros
      </Button>
    </div>
  );
} 