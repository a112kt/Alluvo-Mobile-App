import { useQuery } from "@tanstack/react-query";
import { getBrandReelAnalytics } from "../services/reelAnalytics";

export const BRAND_REEL_ANALYTICS_KEY = ["brandReelAnalytics"];

export function useBrandReelAnalytics() {
  return useQuery({
    queryKey: BRAND_REEL_ANALYTICS_KEY,
    queryFn: getBrandReelAnalytics,
    staleTime: 5 * 60 * 1000,
  });
}
