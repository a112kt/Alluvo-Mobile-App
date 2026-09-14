import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFollowedBrands,
  toggleFollowBrand,
} from "../services/BrandProfile";

export interface FollowedBrand {
  brandId: number;
  brandDisplayName: string;
  brandLogoUrl: string;
  isFollowed: boolean;
  totalFollowers: number;
  message: string;
}

export interface FollowedBrandsResponse {
  success: boolean;
  statusCode: number;
  data: FollowedBrand[];
}

const FOLLOWED_BRANDS_KEY = ["followedBrands"];

export const useFollowedBrands = () => {
  return useQuery({
    queryKey: FOLLOWED_BRANDS_KEY,
    queryFn: getFollowedBrands,
    select: (response: FollowedBrandsResponse) => response?.data ?? [],
  });
};

export const useToggleFollowBrand = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: number) => toggleFollowBrand(brandId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FOLLOWED_BRANDS_KEY });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
};
