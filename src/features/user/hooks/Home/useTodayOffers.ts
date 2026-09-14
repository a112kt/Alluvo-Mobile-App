import { useQuery } from "@tanstack/react-query";
import { getTodayOffers } from "../../services/shop";

export const TODAY_OFFERS_QUERY_KEY = ["todayOffers"];

export const useTodayOffers = () => {
  return useQuery({
    queryKey: TODAY_OFFERS_QUERY_KEY,
    queryFn: async () => {
      const data = await getTodayOffers();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
