import { apiCall } from "../../../../services/apiClient";
import type {
  BrandDashboardData,
  MyBrandInfo,
} from "../types/dashboard";

export async function getMyBrand(): Promise<MyBrandInfo> {
  const res = await apiCall.get("/api/Brand/my");
  return res.data?.data ?? res.data;
}

export async function getBrandDashboard(): Promise<BrandDashboardData> {
  const res = await apiCall.get("/api/Dashboard/brand-stats");
  return res.data?.data ?? res.data;
}

export async function getTopReels() {
  const res = await apiCall.get("/api/Reel/GetTopReels?topN=5");
  return res.data?.data ?? res.data;
}

export async function getRecentOrders() {
  const res = await apiCall.get("/api/Order/GetOrdersForBrand?pageSize=5");
  return res.data?.data ?? res.data;
}

export async function getTopProducts() {
  const res = await apiCall.get("/api/Product/GetTopProducts?topN=5");
  return res.data?.data ?? res.data;
}
