import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface ProductFiltersState {
  searchTerm: string;
  selectedBrands: number[];
  selectedCategories: number[];
  selectedPlaces: number[];
  priceRange: [number, number];
  sortBy: "newest" | "oldest" | "price-low" | "price-high";
  serverMin: number;
  serverMax: number;
}

const initialState: ProductFiltersState = {
  searchTerm: "",
  selectedBrands: [],
  selectedCategories: [],
  selectedPlaces: [],
  priceRange: [0, 1500],
  sortBy: "newest",
  serverMin: 0,
  serverMax: 1500000,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedBrands: (state, action: PayloadAction<number[]>) => {
      state.selectedBrands = action.payload;
    },
    setSelectedCategories: (state, action: PayloadAction<number[]>) => {
      state.selectedCategories = action.payload;
    },
    setSelectedPlaces: (state, action: PayloadAction<number[]>) => {
      state.selectedPlaces = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    setSortBy: (state, action: PayloadAction<"newest" | "oldest" | "price-low" | "price-high">) => {
      state.sortBy = action.payload;
    },
    setServerPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.serverMin = action.payload.min;
      state.serverMax = action.payload.max;
    },
    clearAllFilters: (state) => {
      state.searchTerm = "";
      state.selectedBrands = [];
      state.selectedCategories = [];
      state.selectedPlaces = [];
      state.priceRange = [state.serverMin, state.serverMax];
      state.sortBy = "newest";
    },
    initializeFilters: (state, action: PayloadAction<Partial<ProductFiltersState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  setSearchTerm,
  setSelectedBrands,
  setSelectedCategories,
  setSelectedPlaces,
  setPriceRange,
  setSortBy,
  setServerPriceRange,
  clearAllFilters,
  initializeFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer; 