import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  token: string | null;
  roles: string[] | null;
  brandStatus: string | null;
  brandName: string | null;
  isInUserMode: boolean;
};

const initialState: AuthState = {
  token: null,
  roles: null,
  brandStatus: null,
  brandName: null,
  isInUserMode: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
    setBrandStatus: (state, action: PayloadAction<string>) => {
      state.brandStatus = action.payload;
    },
    setBrandName: (state, action: PayloadAction<string>) => {
      state.brandName = action.payload;
    },
    setUserMode: (state, action: PayloadAction<boolean>) => {
      state.isInUserMode = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.roles = null;
      state.brandStatus = null;
      state.brandName = null;
      state.isInUserMode = false;
    },
  },
});

export default authSlice.reducer;
export const { setToken, setRoles, setBrandStatus, setBrandName, setUserMode, clearAuth } = authSlice.actions;
