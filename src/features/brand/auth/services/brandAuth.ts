import { apiCall } from "../../../../../services/apiClient";
import { BrandLoginRequest, BrandLoginResponse } from "../types";

export async function brandLogin(data: BrandLoginRequest): Promise<BrandLoginResponse> {
  const res = await apiCall.post("/api/Auth/Login", data);
  return res.data;
}
