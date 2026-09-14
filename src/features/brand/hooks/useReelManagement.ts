import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addReelService,
  getBrandReels,
  getBrandReelById,
  editReelService,
  deleteReelService,
  getBrandProducts,
} from "../services/reelManagement";
import type { ReelManagementFilter } from "../types/reelManagement";

export function useAddReel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof addReelService>[0]) => addReelService(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brand-reels"] });
    },
  });
}

export function useGetBrandReels(filter: ReelManagementFilter) {
  return useQuery({
    queryKey: ["brand-reels", filter],
    queryFn: () => getBrandReels(filter),
  });
}

export function useGetBrandReelById(id: string | number | undefined) {
  return useQuery({
    queryKey: ["brand-reel-by-id", id],
    queryFn: () => getBrandReelById(id!),
    enabled: !!id,
  });
}

export function useEditReel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Parameters<typeof editReelService>[0]) => editReelService(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brand-reels"] });
    },
  });
}

export function useDeleteReel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reelId: number) => deleteReelService(reelId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["brand-reels"] });
    },
  });
}

export function useGetBrandProducts(params: {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  selectedProductIds?: number[];
}) {
  return useQuery({
    queryKey: ["brand-products-for-reel", params],
    queryFn: () => getBrandProducts(params),
  });
}
