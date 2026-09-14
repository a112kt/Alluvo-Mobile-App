import { apiCall } from "../../../../services/apiClient";
import type { BrandReelAnalytics } from "../types/reelAnalytics";
import type { ReelDetailAnalytics } from "../types/reelDetailAnalytics";

export async function getBrandReelAnalytics(): Promise<BrandReelAnalytics> {
  const res = await apiCall.get("/api/Dashboard/brand-reel-analytics");
  return res.data?.data ?? res.data;
}

export async function getReelAnalytics(reelId: number, year: number): Promise<ReelDetailAnalytics> {
  const res = await apiCall.get("/api/ReelManagement/Analytics", {
    params: { reelId, year },
  });
  return res.data?.data ?? res.data;
}
