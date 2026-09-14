import { useQuery } from "@tanstack/react-query";
import {
  getMyBrand,
  getBrandDashboard,
  getTopReels,
  getRecentOrders,
  getTopProducts,
} from "../services/brandDashboard";

export const MY_BRAND_KEY = ["myBrand"];
export const BRAND_DASHBOARD_KEY = ["brandDashboard"];
export const TOP_REELS_KEY = ["topReels"];
export const RECENT_ORDERS_KEY = ["recentOrders"];
export const TOP_PRODUCTS_KEY = ["topProducts"];

export function useMyBrand() {
  return useQuery({
    queryKey: MY_BRAND_KEY,
    queryFn: getMyBrand,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrandDashboard() {
  return useQuery({
    queryKey: BRAND_DASHBOARD_KEY,
    queryFn: getBrandDashboard,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopReels() {
  return useQuery({
    queryKey: TOP_REELS_KEY,
    queryFn: getTopReels,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: RECENT_ORDERS_KEY,
    queryFn: getRecentOrders,
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: TOP_PRODUCTS_KEY,
    queryFn: getTopProducts,
    staleTime: 5 * 60 * 1000,
  });
}
