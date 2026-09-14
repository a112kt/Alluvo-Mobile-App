import { useQuery, useMutation } from "@tanstack/react-query";
import { getRecentViews, trackProductView } from "../services/recentViews";

export const RECENT_VIEWS_QUERY_KEY = ["recentViews"];

export const useRecentViews = () => {
  return useQuery({
    queryKey: RECENT_VIEWS_QUERY_KEY,
    queryFn: getRecentViews,
  });
};

export const useTrackProductView = () => {
  return useMutation({
    mutationFn: (productId: number) => trackProductView(productId),
  });
};
