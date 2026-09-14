import { apiCall } from "../../../../services/apiClient";

export interface AddressInfo {
  name: string;
  shippingLastName: string;
  postalCode: string;
  country: string;
  street: string;
  city: string;
  phoneNumber: string;
  shippingBuilding?: string;
  shippingFloor?: string;
  shippingApartment?: string;
  saveAddress?: boolean;
  setAsDefault?: boolean;
}

export interface CreateOrderPayload {
  addressId?: number;
  address?: AddressInfo;
  paymentMethod: number;
  deliveryMethod: number;
  discountCode?: string | null;
  brandId?: number | null;
}

export interface OrderSummaryPayload {
  addressId?: number;
  address?: AddressInfo;
  paymentMethod: number;
  deliveryMethod: number;
  discountCode?: string | null;
  brandId?: number | null;
}

export interface OrderSummaryProduct {
  productId: number;
  productName: string;
  color: string;
  size: number;
  quantity: number;
  unitPrice: number;
  discountPercentage: number | null;
  priceAfterDiscount: number;
  totalItemPrice: number;
  productImages: string[];
}

export interface OrderSummaryShippingAddress {
  name: string;
  lastName: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  city: string;
  country: string;
  postalCode: string;
  phoneNumber: string;
}

export interface OrderSummaryData {
  items: OrderSummaryProduct[];
  summary: {
    shippingAddress: OrderSummaryShippingAddress;
    subTotal: number;
    discountAmount: number;
    shippingPrice: number;
    deliveryMethod: string;
    paymentMethod: string;
    total: number;
  };
}

export interface OrderSummaryResponse {
  success: boolean;
  statusCode: number;
  data: OrderSummaryData;
}

export interface OrderItemInfo {
  productId: number;
  productName?: string;
  productMediaUrls?: string[];
  quantity: number;
  price?: number;
}

export interface OrderDetailsItem {
  name: string;
  color: string;
  description: string;
  productMediaUrls: string[];
  size: number;
  quantity: number;
  price: number;
}

export interface OrderDetailsInfo {
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingPhoneNumber: string;
  paymentMethod: number;
  paymentStatus: number;
  deliveryMethod: number;
  discount: number;
  totalAmount: number;
}

export interface OrderDetailsData {
  id: number;
  createdAt: string;
  orderStatus: number;
  trackingNumber: string | null;
  items: OrderDetailsItem[];
  orderInfo: OrderDetailsInfo;
}

export interface OrderDetailsResponse {
  success: boolean;
  statusCode: number;
  data: OrderDetailsData;
}

export interface OrderInfo {
  id: number;
  orderNumber?: string;
  createdAt?: string;
  totalAmount?: number;
  status?: string;
  paymentStatus?: string;
  items?: OrderItemInfo[];
  deliveryMethod?: string;
  paymentMethod?: string;
}

export interface MyOrdersResponse {
  success?: boolean;
  data?: {
    active?: OrderInfo[];
    completed?: OrderInfo[];
    issues?: OrderInfo[];
  };
  active?: OrderInfo[];
  completed?: OrderInfo[];
  issues?: OrderInfo[];
}

export const getMyOrders = async (): Promise<MyOrdersResponse> => {
  const response = await apiCall.get("/api/Order/MyOrders");
  return response.data;
};

export const getOrderDetails = async (id: number) => {
  const response = await apiCall.get(`/api/Order/${id}`);
  return response.data;
};

export const createOrder = async (payload: CreateOrderPayload) => {
  const response = await apiCall.post("/api/Order", payload);
  return response.data;
};

export const updateOrderStatus = async (id: number, status: string) => {
  const response = await apiCall.put(`/api/Order/${id}/status`, { status });
  return response.data;
};

export const getOrderSummary = async (payload: OrderSummaryPayload) => {
  const response = await apiCall.post("/api/Order/Summary", payload);
  return response.data;
};

export const deleteOrder = async (id: number) => {
  const response = await apiCall.delete(`/api/Order/${id}`);
  return response.data;
};

export const payWithCard = async (orderId: number) => {
  const response = await apiCall.post("/api/Payment/pay", { orderId });
  return response.data;
};

export const payWithWallet = async (orderId: number, phone: string) => {
  const response = await apiCall.post("/api/Payment/wallet", {
    orderId,
    phone,
  });
  return response.data;
};
