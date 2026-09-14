import { apiCall } from "../../../../services/apiClient";
import { FiltersState } from "../types/shop";
import { DEFAULT_PRICE_RANGE } from "../../../Redux/slices/shopFiltersSlice";

export const getProductsShop = async () => {
    const response = await apiCall.get("/api/Product");
    return response.data;
};

export const getCategories = async () => {
    const response = await apiCall.get("/api/Product/categories");
    return response.data;
};

export type ProductQueryParams = {
  pageIndex: number;
  pageSize?: number;
  filters?: Partial<FiltersState>;
};

export const getProductsPage = async ({ pageIndex, pageSize = 10, filters }: ProductQueryParams) => {
    const query = new URLSearchParams();
    query.set("PageIndex", String(pageIndex));
    query.set("PageSize", String(pageSize));

    if (filters?.mainCategory?.length) {
      filters.mainCategory.forEach((c) => {
        const id = Number(c.id);
        if (!isNaN(id)) query.append("CategoryIds", String(id));
      });
    }
    if (filters?.priceRange && (
      filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
      filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
    )) {
      query.set("MinPrice", String(filters.priceRange[0]));
      query.set("MaxPrice", String(filters.priceRange[1]));
    }
    if (filters?.stockStatus) {
      query.set("StockStatus", filters.stockStatus);
    }
    if (filters?.Search) {
      query.set("Search", filters.Search);
    }
    if (filters?.SortItem?.SortBy) {
      query.set("SortBy", filters.SortItem.SortBy);
    }
    if (filters?.SortItem?.SortOrder) {
      query.set("SortOrder", filters.SortItem.SortOrder);
    }
    if (filters?.colors?.length) {
      filters.colors.forEach((c) => query.append("Colors", c.name));
    }
    if (filters?.sizesSelected?.length) {
      filters.sizesSelected.forEach((s) => query.append("Sizes", s.name));
    }

    const queryString = query.toString();
    const response = await apiCall.get(`/api/Product?${queryString}`);
    return response.data;
};

export const getTodayOffers = async () => {
    const response = await apiCall.get("/api/TodayOffer/today offers");
    return response.data;
};

export const getProductById = async (productId: number) => {
    const response = await apiCall.get(`/api/Product/${productId}`);
    return response.data?.data ?? response.data;
};
