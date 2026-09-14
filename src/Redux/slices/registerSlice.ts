import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../config/env";

const baseUrl = API_BASE_URL;

export interface RegisterData {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: string;
  Password: string;
  DateOfBirth: string;
  Gender: string;
  ProfileImage?: string;
}

interface RegisterState {
  loading: boolean;
  success: boolean;
  error: string | null;
  message: { en: string | null; ar: string | null };
  fieldErrors: { field: string; en: string; ar: string }[] | null;
}

interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: { en: string; ar: string } | string;
  data?: any;
  errors?: { field: string; en: string; ar: string }[] | null;
}

const initialState: RegisterState = {
  loading: false,
  success: false,
  error: null,
  message: { en: null, ar: null },
  fieldErrors: null,
};

export const registerUser = createAsyncThunk<
  RegisterResponse,
  FormData, 
  { rejectValue: any }
>("auth/registerUser", async (form, { rejectWithValue }) => {
  try {
    const url = `${baseUrl}/api/Auth/Register`;

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
      },
      body: form,
    });

    // ✅ Parse Response
    const text = await resp.text().catch(() => "");
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    // ✅ Error Handling
    if (!resp.ok) {
      if (data?.errors?.length > 0) {
        const firstError = data.errors[0];
        return rejectWithValue({
          message: firstError?.en || firstError?.ar || "Validation error",
          field: firstError?.field,
          errors: data.errors,
        });
      }

      if (data?.message) {
        const msg = typeof data.message === "string" ? data.message : data.message.en || data.message.ar || "Server error";
        return rejectWithValue({
          message: msg,
          errors: data.errors || [],
        });
      }

      return rejectWithValue({
        message: `HTTP ${resp.status}`,
        errors: [],
      });
    }

    // ✅ Success
    return (
      (data as RegisterResponse) ?? {
        success: true,
        statusCode: resp.status,
        message: { en: "Success", ar: null },
        data: null,
        errors: null,
      }
    );
  } catch (err: any) {
    return rejectWithValue({
      message: err?.message || "Network error",
      errors: [],
    });
  }
});


const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    resetRegisterState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.fieldErrors = null;
        state.message = { en: null, ar: null };
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.loading = false;
          state.success = !!action.payload?.success;
          // set message (handle both object or string)
          if (
            action.payload?.message &&
            typeof action.payload.message === "object"
          ) {
            state.message = {
              en: (action.payload.message as any).en || null,
              ar: (action.payload.message as any).ar || null,
            };
          } else if (typeof action.payload?.message === "string") {
            state.message = { en: action.payload.message as string, ar: null };
          } else {
            state.message = { en: null, ar: null };
          }
          state.fieldErrors = action.payload?.errors || null;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        const payload = action.payload;
        if (payload) {
          if (payload.message) {
            if (typeof payload.message === "object") {
              state.message = {
                en: payload.message.en || null,
                ar: payload.message.ar || null,
              };
              state.error = payload.message.en || null;
            } else if (typeof payload.message === "string") {
              state.message = { en: payload.message, ar: null };
              state.error = payload.message;
            }
          } else if (payload.errors) {
            state.fieldErrors = payload.errors;
            const first =
              Array.isArray(payload.errors) && payload.errors.length
                ? payload.errors[0]
                : null;
            state.error = first?.en || null;
          } else {
            state.error =
              typeof payload === "string" ? payload : JSON.stringify(payload);
          }
        } else {
          state.error = action.error?.message || "Registration failed";
        }
      });
  },
});

export const { resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
