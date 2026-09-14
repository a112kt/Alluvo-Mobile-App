import { useQuery } from "@tanstack/react-query";
import { getReelById } from "../services";

export function useReelById(reelId: number | null) {
  return useQuery({
    queryKey: ["reelById", reelId],
    queryFn: () => getReelById(reelId!),
    staleTime: 5 * 60 * 1000,
    enabled: !!reelId,
  });
}
