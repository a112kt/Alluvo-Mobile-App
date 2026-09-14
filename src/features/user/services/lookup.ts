import { apiCall } from "../../../../services/apiClient";

export const getCountries = async () => {
  const response = await apiCall.get("/api/Lookup/countries");
  return response.data;
};

export const getCities = async () => {
  const response = await apiCall.get("/api/Lookup/cities");
  return response.data;
};

export const getColors = async () => {
  const response = await apiCall.get("/api/Lookup/colors");
  return response.data;
};

export const getSizes = async () => {
  const response = await apiCall.get("/api/Lookup/sizes");
  return response.data;
};

export const getOrderStatuses = async () => {
  const response = await apiCall.get("/api/Lookup/order-statuses");
  return response.data;
};

export const getStockStatuses = async () => {
  const response = await apiCall.get("/api/Lookup/stock-statuses");
  return response.data;
};

export const getPaymentStatuses = async () => {
  const response = await apiCall.get("/api/Lookup/payment-statuses");
  return response.data;
};

export const getPaymentMethods = async () => {
  const response = await apiCall.get("/api/Lookup/payment-methods");
  return response.data;
};

export const getInformationTypes = async () => {
  const response = await apiCall.get("/api/Lookup/information-types");
  return response.data;
};

export const getDisputeStatuses = async () => {
  const response = await apiCall.get("/api/Lookup/dispute-statuses");
  return response.data;
};

export const getReelStatuses = async () => {
  const response = await apiCall.get("/api/Lookup/reel-statuses");
  return response.data;
};

export const getDeliveryMethods = async () => {
  const response = await apiCall.get("/api/Lookup/delivery-methods");
  return response.data;
};
