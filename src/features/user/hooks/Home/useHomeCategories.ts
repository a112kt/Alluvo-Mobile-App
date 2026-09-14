import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../services/shop";

export const HOME_CATEGORIES_QUERY_KEY = ["homeCategories"];

export const useHomeCategories = () => {
  return useQuery({
    queryKey: HOME_CATEGORIES_QUERY_KEY,
    queryFn: async () => {
      const data = await getCategories();
      return data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
