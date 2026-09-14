import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  GetUserProfile, 
  UpdateProfile, 
  UpdatePassword, 
  UpdateProfileImage,
  GetShippingAddress,
  AddShippingAddress,
  UpdateShippingAddress,
  DeleteShippingAddress,
  RequestDeleteAccountOtp,
  ConfirmDeleteAccount,
  ShippingAddressResponse,
  ShippingAddressData,
} from "../../services/Profile";

export const USER_PROFILE_QUERY_KEY = ["userProfile"];
export const SHIPPING_ADDRESS_QUERY_KEY = [...USER_PROFILE_QUERY_KEY, "shippingAddress"];

export function useProfile() {
  return useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: GetUserProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: UpdatePassword,
  });
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UpdateProfileImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_PROFILE_QUERY_KEY });
    },
  });
}

export function useShippingAddressList() {
  return useQuery({
    queryKey: SHIPPING_ADDRESS_QUERY_KEY,
    queryFn: GetShippingAddress,
    select: (response: ShippingAddressResponse) => response?.data ?? [],
  });
}

export function useShippingAddress() {
  return useQuery({
    queryKey: SHIPPING_ADDRESS_QUERY_KEY,
    queryFn: GetShippingAddress,
    select: (response: ShippingAddressResponse) => {
      const addresses = response?.data ?? [];
      const defaultAddr = addresses.find((a: ShippingAddressData) => a.isDefault);
      return defaultAddr || addresses[0] || null;
    },
  });
}

export function useAddShippingAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_ADDRESS_QUERY_KEY });
    },
  });
}

export function useUpdateShippingAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ShippingAddressData> }) =>
      UpdateShippingAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_ADDRESS_QUERY_KEY });
    },
  });
}

export function useDeleteShippingAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: DeleteShippingAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SHIPPING_ADDRESS_QUERY_KEY });
    },
  });
}

export function useRequestDeleteAccountOtp() {
  return useMutation({
    mutationFn: RequestDeleteAccountOtp,
  });
}

export function useConfirmDeleteAccount() {
  return useMutation({
    mutationFn: ConfirmDeleteAccount,
  });
}

