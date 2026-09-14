import { useQuery } from "@tanstack/react-query";
import { getTopBrands } from "../../services/index";

export const TOP_BRANDS_QUERY_KEY = ["topBrands"];

export const useTopBrands = () => {
  return useQuery({
    queryKey: TOP_BRANDS_QUERY_KEY,
    queryFn: async () => {
      const data = await getTopBrands(5);
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
