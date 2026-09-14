import { useQuery } from "@tanstack/react-query"
import { getProductsShop } from "../../services/shop"

export default function useGetProductsShop() {
    return useQuery({
        queryKey: ["products"],
        queryFn: () => getProductsShop()
    });
}