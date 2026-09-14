import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCart,
  addToCart,
  updateCart,
  clearCart,
  CartItemRequest,
  CartUpdateItemRequest,
  CartResponse,
  CartBrandGroupRes,
  CartItemRes,
} from "../services/cart";

export const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCart,
  });
};

export const useCartBrands = (): CartBrandGroupRes[] => {
  const { data } = useCart();
  return data?.data?.brands ?? [];
};

export const useBrandCart = (brandId: number | undefined) => {
  const { data, isLoading } = useCart();
  const brands = data?.data?.brands ?? [];
  const brandGroup = brandId ? brands.find((b) => b.brandId === brandId) : undefined;
  return {
    brandGroup,
    cartItems: brandGroup?.items ?? [],
    isLoading,
  };
};

export const useCartItemCount = (): number => {
  const brands = useCartBrands();
  if (brands.length !== 1) return 0;
  return brands[0].items.reduce((sum, item) => sum + item.quantity, 0);
};

export const useAllCartItems = (): CartItemRes[] => {
  const brands = useCartBrands();
  return brands.flatMap((b) => b.items);
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: CartItemRequest[]) => addToCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: CartUpdateItemRequest[]) => updateCart(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId?: number) => clearCart(brandId),
    onSuccess: (response: CartResponse) => {
      queryClient.setQueryData(CART_QUERY_KEY, response);
    },
  });
};
