import { apiCall } from "../../../../services/apiClient";
import type {
  BrandDetailsResponse,
  UpdateBrandDetailsReq,
  TopEngagedUserDto,
} from "../types/brandProfile";

export async function getBrandDetails(
  brandId: number
): Promise<BrandDetailsResponse> {
  const res = await apiCall.get(`/api/BrandDetails/${brandId}`);
  return res.data?.data ?? res.data;
}

export async function updateBrandDetails(
  brandId: number,
  data: UpdateBrandDetailsReq
): Promise<BrandDetailsResponse> {
  const res = await apiCall.put(`/api/BrandDetails/${brandId}`, data);
  return res.data?.data ?? res.data;
}

export async function getTopEngagedUsers(
  brandId: number,
  count: number = 10
): Promise<TopEngagedUserDto[]> {
  const res = await apiCall.get(
    `/api/BrandDetails/${brandId}/top-engaged-users`,
    { params: { count } }
  );
  return res.data?.data ?? res.data;
}

export async function uploadBrandLogo(
  brandId: number,
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<string> {
  const form = new FormData();
  form.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);
  const res = await apiCall.post(`/api/BrandDetails/${brandId}/logo`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data ?? res.data;
}

export async function uploadBrandCover(
  brandId: number,
  fileUri: string,
  fileName: string,
  mimeType: string
): Promise<string> {
  const form = new FormData();
  form.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);
  const res = await apiCall.post(`/api/BrandDetails/${brandId}/cover`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data?.data ?? res.data;
}

export async function deleteBrandLogo(brandId: number): Promise<boolean> {
  const res = await apiCall.delete(`/api/BrandDetails/${brandId}/logo`);
  return res.data?.data ?? res.data;
}

export async function deleteBrandCover(brandId: number): Promise<boolean> {
  const res = await apiCall.delete(`/api/BrandDetails/${brandId}/cover`);
  return res.data?.data ?? res.data;
}
