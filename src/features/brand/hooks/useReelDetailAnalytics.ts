import { useQuery } from "@tanstack/react-query";
import { getReelAnalytics } from "../services/reelAnalytics";

export function useReelDetailAnalytics(reelId: number, year: number) {
  return useQuery({
    queryKey: ["reelDetailAnalytics", reelId, year],
    queryFn: () => getReelAnalytics(reelId, year),
    staleTime: 5 * 60 * 1000,
    enabled: !!reelId,
  });
}
