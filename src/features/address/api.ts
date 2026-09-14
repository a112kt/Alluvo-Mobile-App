import { apiCall } from "../../../services/apiClient";
import { Address, AddressResponse } from "./types";

export const getAddresses = async (): Promise<AddressResponse> => {
  const response = await apiCall.get<AddressResponse>("/api/UserProfile/ShippingAddress");
  return response.data;
};

export const addAddress = async (data: Partial<Address>): Promise<AddressResponse> => {
  const response = await apiCall.post<AddressResponse>("/api/UserProfile/ShippingAddress", data);
  return response.data;
};

export const updateAddress = async (id: number, data: Partial<Address>): Promise<AddressResponse> => {
  const response = await apiCall.patch<AddressResponse>(`/api/UserProfile/ShippingAddress/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id: number): Promise<AddressResponse> => {
  const response = await apiCall.delete<AddressResponse>(`/api/UserProfile/ShippingAddress/${id}`);
  return response.data;
};
