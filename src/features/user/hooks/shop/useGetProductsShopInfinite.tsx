import { useInfiniteQuery } from "@tanstack/react-query"
import { getProductsPage, ProductQueryParams } from "../../services/shop"
import { FiltersState } from "../../types/shop";

const DEFAULT_PAGE_SIZE = 10;

export default function useGetProductsShopInfinite(filters?: Partial<FiltersState>, pageSize: number = DEFAULT_PAGE_SIZE) {
    return useInfiniteQuery({
        queryKey: ["products", "infinite", pageSize, filters],
        queryFn: ({ pageParam }) => {
            const params: ProductQueryParams = { pageIndex: pageParam, pageSize, filters };
            return getProductsPage(params);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage: any) => {
            const meta = lastPage?.data?.meta;
            if (!meta) return undefined;
            const { pageNumber: page, totalPages, totalRecords, pageSize: metaPageSize } = meta;
            if (totalPages) {
                const next = page < totalPages ? page + 1 : undefined;
                return next;
            }
            if (metaPageSize && totalRecords) {
                const next = page * metaPageSize < totalRecords ? page + 1 : undefined;
                return next;
            }
            return undefined;
        },
    });
}
