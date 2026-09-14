import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/shop";

export const useProductDetails = (productId: number) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });
};