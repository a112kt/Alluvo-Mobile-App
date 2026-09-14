import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FiltersState, mainCategoryType, colorType, sizeType, sortOptionType } from "../../features/user/types/shop";

export const DEFAULT_PRICE_RANGE: [number, number] = [0, 100000];

const initialState: FiltersState = {
  mainCategory: [],
  priceRange: DEFAULT_PRICE_RANGE,
  stockStatus: null,
  sizesSelected: [],
  colors: [],
  Search: "",
  SortItem: null,
};

const shopFiltersSlice = createSlice({
  name: "shopFilters",
  initialState,
  reducers: {
    setMainCategory: (state, action: PayloadAction<mainCategoryType[]>) => {
      state.mainCategory = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<number[]>) => {
      state.priceRange = action.payload;
    },
    setStockStatus: (state, action: PayloadAction<string | null>) => {
      state.stockStatus = action.payload;
    },
    setColors: (state, action: PayloadAction<colorType[]>) => {
      state.colors = action.payload;
    },
    toggleColor: (state, action: PayloadAction<colorType>) => {
      const exists = state.colors.some((c) => c.id === action.payload.id);
      if (exists) {
        state.colors = state.colors.filter((c) => c.id !== action.payload.id);
      } else {
        state.colors.push(action.payload);
      }
    },
    removeColor: (state, action: PayloadAction<colorType>) => {
      state.colors = state.colors.filter((c) => c.id !== action.payload.id);
    },
    setSizesSelected: (state, action: PayloadAction<sizeType[]>) => {
      state.sizesSelected = action.payload;
    },
    toggleSize: (state, action: PayloadAction<sizeType>) => {
      const exists = state.sizesSelected.some((s) => s.id === action.payload.id);
      if (exists) {
        state.sizesSelected = state.sizesSelected.filter((s) => s.id !== action.payload.id);
      } else {
        state.sizesSelected.push(action.payload);
      }
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.Search = action.payload;
    },
    setSortItem: (state, action: PayloadAction<sortOptionType | null>) => {
      state.SortItem = action.payload;
    },
    clearAllFilters: (state) => {
      state.mainCategory = [];
      state.priceRange = DEFAULT_PRICE_RANGE;
      state.stockStatus = null;
      state.colors = [];
      state.Search = "";
      state.sizesSelected = [];
      state.SortItem = null;
    },
  },
});

export default shopFiltersSlice.reducer;
export const {
  setMainCategory,
  setPriceRange,
  setStockStatus,
  setColors,
  setSearch,
  setSortItem,
  clearAllFilters,
  removeColor,
  toggleColor,
  setSizesSelected,
  toggleSize,
} = shopFiltersSlice.actions;
