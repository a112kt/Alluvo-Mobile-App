import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getBrands, getBrandCategories, BrandsResponse } from "../services/ourBrands";

export function useOurBrands(params: {
  search?: string;
  categoryName?: string;
}) {
  const { search, categoryName } = params;

  return useInfiniteQuery<BrandsResponse>({
    queryKey: ["ourBrands", { search, categoryName }],
    queryFn: ({ pageParam = 1 }) =>
      getBrands({ pageIndex: pageParam as number, search, categoryName }),
    getNextPageParam: (lastPage) => {
      if (lastPage?.meta?.hasNextPage) {
        return lastPage.meta.pageNumber + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useBrandCategories() {
  return useQuery({
    queryKey: ["brandCategories"],
    queryFn: getBrandCategories,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  });
}
