import { apiCall } from "../../../../../services/apiClient";
import { API_BASE_URL } from "../../../../config/env";

export async function brandRegister(data: FormData): Promise<string> {
  const resp = await fetch(`${API_BASE_URL}/api/Auth/Register`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
    body: data,
  });
  const text = await resp.text().catch(() => "");
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text || null;
  }
  if (!resp.ok) {
    const firstErr = parsed?.errors?.[0];
    const errMsg =
      (typeof firstErr === "string" ? firstErr : firstErr?.en) ||
      (typeof parsed?.message === "string" ? parsed.message : parsed?.message?.en) ||
      parsed?.message ||
      `HTTP ${resp.status}`;
    throw new Error(errMsg);
  }
  return text;
}

export async function verifyOtp(data: {
  email: string;
  otp: string;
}): Promise<any> {
  const res = await apiCall.post("/api/Otp/VerifyOtp", data);
  return res.data;
}

export async function resendOtp(email: string): Promise<any> {
  const res = await apiCall.post(`/api/Otp/ResendOtp?email=${email}`);
  return res.data;
}

export async function addBrandInfo(data: {
  DisplayName: string;
  Description: string;
  LogoUrl: string;
  ReturnPolicyAsHtml: string;
  category: string;
  country: string;
  Governorate: string;
  district: string;
  numberOfEmployees: string;
}): Promise<any> {
  const res = await apiCall.post("/api/Brand/BrandInfo", data);
  return res.data;
}

export async function uploadMedia(fileUri: string): Promise<string> {
  const form = new FormData();
  form.append("file", {
    uri: fileUri,
    name: "upload.jpg",
    type: "image/jpeg",
  } as any);
  const res = await apiCall.post("/api/Media/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data?.url || res.data?.url || "";
}

export async function verifyIdentity(data: FormData): Promise<any> {
  const resp = await fetch(`${API_BASE_URL}/api/BrandVerification/Verify`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
    },
    body: data,
  });
  const text = await resp.text().catch(() => "");
  let parsed: any = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text || null;
  }
  if (!resp.ok) {
    const firstErr = parsed?.errors?.[0];
    const errMsg =
      (typeof firstErr === "string" ? firstErr : firstErr?.en) ||
      (typeof parsed?.message === "string" ? parsed.message : parsed?.message?.en) ||
      parsed?.message ||
      `HTTP ${resp.status}`;
    throw new Error(errMsg);
  }
  return parsed;
}

export async function getCountries(): Promise<any> {
  const res = await apiCall.get("/api/Lookup/countries");
  return res.data;
}

export async function getCities(country: string): Promise<any> {
  const res = await apiCall.get(`/api/Lookup/cities?country=${country}`);
  return res.data;
}

export async function getCategories(): Promise<any> {
  const res = await apiCall.get("/api/Product/categories");
  return res.data;
}
