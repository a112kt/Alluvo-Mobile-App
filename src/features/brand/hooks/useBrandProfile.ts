import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBrandDetails,
  updateBrandDetails,
  getTopEngagedUsers,
  uploadBrandLogo,
  uploadBrandCover,
  deleteBrandLogo,
  deleteBrandCover,
} from "../services/brandProfile";
import { UpdateBrandDetailsReq } from "../types/brandProfile";

export const BRAND_DETAILS_KEY = "brandDetails";
export const TOP_ENGAGED_USERS_KEY = "topEngagedUsers";

export function useGetBrandDetails(brandId: number | undefined) {
  return useQuery({
    queryKey: [BRAND_DETAILS_KEY, brandId],
    queryFn: () => getBrandDetails(brandId!),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateBrandDetails() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      brandId,
      data,
    }: {
      brandId: number;
      data: UpdateBrandDetailsReq;
    }) => updateBrandDetails(brandId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BRAND_DETAILS_KEY, variables.brandId],
      });
    },
  });
}

export function useGetTopEngagedUsers(
  brandId: number | undefined,
  count: number = 10
) {
  return useQuery({
    queryKey: [TOP_ENGAGED_USERS_KEY, brandId, count],
    queryFn: () => getTopEngagedUsers(brandId!, count),
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadBrandLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      brandId,
      fileUri,
      fileName,
      mimeType,
    }: {
      brandId: number;
      fileUri: string;
      fileName: string;
      mimeType: string;
    }) => uploadBrandLogo(brandId, fileUri, fileName, mimeType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BRAND_DETAILS_KEY, variables.brandId],
      });
    },
  });
}

export function useUploadBrandCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      brandId,
      fileUri,
      fileName,
      mimeType,
    }: {
      brandId: number;
      fileUri: string;
      fileName: string;
      mimeType: string;
    }) => uploadBrandCover(brandId, fileUri, fileName, mimeType),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [BRAND_DETAILS_KEY, variables.brandId],
      });
    },
  });
}

export function useDeleteBrandLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: number) => deleteBrandLogo(brandId),
    onSuccess: (_, brandId) => {
      queryClient.invalidateQueries({
        queryKey: [BRAND_DETAILS_KEY, brandId],
      });
    },
  });
}

export function useDeleteBrandCover() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (brandId: number) => deleteBrandCover(brandId),
    onSuccess: (_, brandId) => {
      queryClient.invalidateQueries({
        queryKey: [BRAND_DETAILS_KEY, brandId],
      });
    },
  });
}
