import axios from "axios";
import { store } from "../src/Redux/store";
import { API_BASE_URL } from "../src/config/env";
export const apiCall = axios.create({
  baseURL: API_BASE_URL ? `${API_BASE_URL}/` : undefined,
  timeout: 60000,
  headers: {"Content-Type": "application/json",
    "Accept":"application/json"
  }
});   
apiCall.interceptors.request.use((config:any) => {
  const state = store.getState();  // here 
  const token = state.auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiCall.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const data = error.response.data;
      if (data?.message) {
        const msg = data.message;
        error.friendlyMessage = typeof msg === "string" ? msg : (msg.en || msg.ar || "An error occurred");
      } else if (data?.errors?.length > 0) {
        const first = data.errors[0];
        error.friendlyMessage = typeof first === "string" ? first : (first.en || first.ar || "An error occurred");
      }
    } else if (error.request) {
      error.friendlyMessage = "No response from server. Please check your connection.";
    }
    return Promise.reject(error);
  }
);

