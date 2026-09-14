import { useQuery } from "@tanstack/react-query";
import { getProductsPage } from "../../services/shop";

export const HOME_PRODUCTS_QUERY_KEY = ["homeProducts"];

export const useHomeProducts = () => {
  return useQuery({
    queryKey: HOME_PRODUCTS_QUERY_KEY,
    queryFn: () => getProductsPage({ pageIndex: 2, pageSize: 10 }),
  });
};
