import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchHistoryState {
  keywords: string[];
}

const initialState: SearchHistoryState = {
  keywords: [],
};

const MAX_HISTORY = 10;

const searchHistorySlice = createSlice({
  name: "searchHistory",
  initialState,
  reducers: {
    addSearchKeyword: (state, action: PayloadAction<string>) => {
      const keyword = action.payload.trim();
      if (!keyword) return;
      const lower = keyword.toLowerCase();
      const filtered = state.keywords.filter(
        (k) => k.toLowerCase() !== lower
      );
      state.keywords = [keyword, ...filtered].slice(0, MAX_HISTORY);
    },
    removeSearchKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter((k) => k !== action.payload);
    },
    clearSearchHistory: (state) => {
      state.keywords = [];
    },
  },
});

export const { addSearchKeyword, removeSearchKeyword, clearSearchHistory } =
  searchHistorySlice.actions;
export default searchHistorySlice.reducer;
