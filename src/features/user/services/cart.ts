import axios from "axios";
import { apiCall } from "../../../../services/apiClient";

export interface CartItemRequest {
  productId: number;
  quantity: number;
  color: string;
  size: string;
}

export interface CartUpdateItemRequest {
  productId: number;
  quantity: number;
  change: number;
  color: string;
  size: string;
}

export interface CartItemRes {
  productId: number;
  productName: string;
  productMediaUrls: string[];
  productPrice: number;
  color: string;
  size: string;
  quantity: number;
  brandId: number;
  brandName: string;
  brandLogoUrl?: string;
}

export interface CartBrandGroupRes {
  brandId: number;
  brandName: string;
  brandLogoUrl?: string;
  items: CartItemRes[];
}

export interface CartGroupedByBrandRes {
  cartId: number;
  userId: string;
  brands: CartBrandGroupRes[];
}

export interface CartResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: CartGroupedByBrandRes | null;
  errors: any;
}

const EMPTY_CART_RESPONSE: CartResponse = {
  success: true,
  statusCode: 200,
  message: { en: "Cart is empty", ar: "السلة فارغة" },
  data: { cartId: 0, userId: "", brands: [] },
  errors: null,
};

export const getCart = async (): Promise<CartResponse> => {
  try {
    const response = await apiCall.get("/api/Cart");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return EMPTY_CART_RESPONSE;
    }
    throw error;
  }
};

export const addToCart = async (items: CartItemRequest[]): Promise<CartResponse> => {
  const response = await apiCall.post("/api/Cart", { items });
  return response.data;
};

export const updateCart = async (items: CartUpdateItemRequest[]): Promise<CartResponse> => {
  const response = await apiCall.put("/api/Cart", { items });
  return response.data;
};

export const clearCart = async (brandId?: number): Promise<CartResponse> => {
  const response = await apiCall.delete("/api/Cart", {
    params: brandId !== undefined ? { brandId } : undefined,
  });
  return response.data;
};
