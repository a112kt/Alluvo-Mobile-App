import { apiCall } from "../../../../services/apiClient";

export interface WishlistProduct {
  productId: number;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number | null;
  brandName: string;
  imageUrl: string;
}

export interface WishlistData {
  isEmpty: boolean;
  count: number;
  products: WishlistProduct[];
}

export interface WishlistResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: WishlistData;
  errors: any;
}

export interface ToggleLoveResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: {
    productId: number;
    isLoved: boolean;
  };
  errors: any;
}

export const getWishlist = async (): Promise<WishlistResponse> => {
  const response = await apiCall.get("/api/Wishlist");
  return response.data;
};

export const toggleWishlist = async (productId: number): Promise<ToggleLoveResponse> => {
  const response = await apiCall.post(`/api/Wishlist/${productId}/toggle-love`);
  return response.data;
};
