import { useQuery } from "@tanstack/react-query";
import { fetchJamendoTracks } from "../services/jamendo";

export function useJamendoTracks(search?: string, limit: number = 20) {
  return useQuery({
    queryKey: ["jamendo-tracks", search || "default", limit],
    queryFn: () => fetchJamendoTracks(search, limit),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
