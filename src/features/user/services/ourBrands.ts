import { apiCall } from "../../../../services/apiClient";

export interface BrandType {
  id: number;
  displayName: string;
  description: string;
  logoUrl: string;
  coverImageUrl?: string;
  category: string;
  averageRating: number;
  numOfReviews: number;
  productCount: number;
  followersCount: number;
  isFollowedByMe: boolean;
}

export interface BrandMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  totalPages: number;
}

export interface BrandsResponse {
  meta: BrandMeta;
  data: BrandType[];
}

export async function getBrands(params: {
  pageIndex?: number;
  search?: string;
  categoryName?: string;
}): Promise<BrandsResponse> {
  const { pageIndex = 1, search, categoryName } = params;
  const queryParams: Record<string, string> = {
    PageIndex: String(pageIndex),
    PageSize: "12",
  };
  if (search) queryParams.Search = search;
  if (categoryName) queryParams.CategoryName = categoryName;

  const res = await apiCall.get("/api/Brand", { params: queryParams });
  return res.data.data;
}

export async function getBrandCategories(): Promise<string[]> {
  const res = await apiCall.get("/api/Brand/categories");
  return res.data.data;
}
