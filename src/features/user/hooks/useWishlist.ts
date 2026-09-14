import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWishlist, toggleWishlist } from "../services/wishlist";

export const WISHLIST_QUERY_KEY = ["wishlist"];

export const useWishlist = () => {
  return useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getWishlist,
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) => toggleWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });
};
