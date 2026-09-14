import { apiCall } from "../../../../services/apiClient";
import type {
  ReelManagementFilter,
  ReelsListResponse,
  SingleReelResponse,
  ProductsResponse,
} from "../types/reelManagement";

export async function addReelService(data: {
  title: string;
  video: { uri: string; name?: string; type?: string };
  products: number[];
  status: string;
  filterId?: string;
  musicTrackId?: string;
  musicTrackName?: string;
  musicTrackArtist?: string;
}) {
  const form = new FormData();

  form.append("Title", data.title);
  form.append("Status", data.status || "draft");
  form.append("Video", {
    uri: data.video.uri,
    name: data.video.name || "reel.mp4",
    type: data.video.type || "video/mp4",
  } as any);

  if (data.products && data.products.length > 0) {
    form.append("ProductIds", data.products.join(","));
  }

  if (data.filterId) form.append("FilterId", data.filterId);
  if (data.musicTrackId) form.append("MusicTrackId", data.musicTrackId);
  if (data.musicTrackName) form.append("MusicTrackName", data.musicTrackName);
  if (data.musicTrackArtist) form.append("MusicTrackArtist", data.musicTrackArtist);

  const response = await apiCall.post('/api/ReelManagement', form, {
    headers: { "Content-Type": undefined },
  });

  return response.data;
}

export async function getBrandReels(filter: ReelManagementFilter): Promise<ReelsListResponse> {
  const params = new URLSearchParams();
  if (filter.Search) params.append("Search", filter.Search);
  if (filter.Status) params.append("Status", filter.Status);
  if (filter.Sort) params.append("Sort", filter.Sort);
  if (filter.Page) params.append("PageIndex", filter.Page.toString());
  params.append("PageSize", (filter.PageSize ?? 50).toString());
  const res = await apiCall.get(`/api/ReelManagement/Reels?${params}`);
  return res.data;
}

export async function getBrandReelById(id: string | number): Promise<SingleReelResponse> {
  const res = await apiCall.get(`/api/ReelManagement/${id}`);
  return res.data;
}

export async function editReelService(data: {
  ReelId: string | number;
  Title: string;
  Status?: string;
  ProductIds: number[];
  ClearProducts: boolean;
}) {
  const form = new FormData();
  form.append("ReelId", String(data.ReelId ?? ""));
  form.append("Title", data.Title);
  form.append("Status", data.Status || "draft");
  form.append(
    "ProductIds",
    data.ProductIds.length > 0 ? data.ProductIds.join(",") : ""
  );
  form.append("ClearProducts", data.ClearProducts.toString());
  const res = await apiCall.patch("/api/ReelManagement", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteReelService(reelId: number) {
  const res = await apiCall.delete(`/api/ReelManagement?reelId=${reelId}`);
  return res.data;
}

export async function getBrandProducts(params: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  selectedProductIds?: number[];
}): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams();
  if (params.pageIndex) searchParams.append("PageIndex", params.pageIndex.toString());
  if (params.pageSize) searchParams.append("PageSize", params.pageSize.toString());
  if (params.search) searchParams.append("Search", params.search);
  if (params.selectedProductIds?.length) {
    params.selectedProductIds.forEach((id) =>
      searchParams.append("SelectedProductIds", id.toString())
    );
  }
  const res = await apiCall.get(`/api/ReelManagement/Products?${searchParams}`);
  return res.data;
}
