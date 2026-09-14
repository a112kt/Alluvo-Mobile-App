import { apiCall } from "../../../../services/apiClient";

export interface RecentViewProduct {
  productId: number;
  productName: string;
  price: number;
  imageUrls: string[];
}

export const trackProductView = async (productId: number): Promise<void> => {
  await apiCall.post(`/api/Product/view/${productId}`);
};

export const getRecentViews = async (): Promise<RecentViewProduct[]> => {
  const response = await apiCall.get("/api/Product/recentviews");
  return response.data;
};
