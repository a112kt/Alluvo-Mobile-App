import { apiCall } from "../../../../services/apiClient";
import { store } from "../../../Redux/store";

export interface ShippingAddressData {
  id?: number;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  street?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  postcode?: string;
  isDefault?: boolean;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ShippingAddressResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: ShippingAddressData[];
  errors: any;
}

export interface UserProfileData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  profileImageUrl: string;
  numberOfFollowing: number;
  numberOfOrders: number;
}

export interface UserProfileResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: UserProfileData;
  errors: any;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdatePasswordData {
  currentPassword?: string;
  oldPassword?: string;
  newPassword: string;
}

export const GetUserProfile = async (): Promise<UserProfileResponse> => {
  try {
    const response = await apiCall.get<UserProfileResponse>("/api/Auth/UserInfo");
    return response.data;
  } catch (error: any) {
    console.error("GetUserProfile Error:", error?.response?.data || error?.message || error);
    throw error;
  }
};

export const UpdateProfile = async (data: UpdateProfileData) => {
  const response = await apiCall.put("/api/UserProfile/UpdateProfile", data);
  return response.data;
};

export const UpdatePassword = async (data: UpdatePasswordData) => {
  // Map oldPassword to currentPassword if present
  const payload = {
    currentPassword: data.currentPassword || data.oldPassword,
    newPassword: data.newPassword,
  };
  const response = await apiCall.put("/api/UserProfile/UpdatePassword", payload);
  return response.data;
};

export interface ImageUploadData {
  uri: string;
  fileName?: string;
  mimeType?: string;
}

export const UpdateProfileImage = async (data: ImageUploadData) => {
  const token = store.getState().auth.token;
  const form = new FormData();

  const fileName = data.fileName || "profile.jpg";
  const mimeType = data.mimeType || "image/jpeg";

  form.append("image", {
    uri: data.uri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/UserProfile/UpdateProfileImage`, {
    method: "PUT",
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to update profile image");
  }

  return await response.json();
};

export const GetShippingAddress = async (): Promise<ShippingAddressResponse> => {
  const response = await apiCall.get<ShippingAddressResponse>("/api/UserProfile/ShippingAddress");
  return response.data;
};

export const AddShippingAddress = async (data: Partial<ShippingAddressData>) => {
  const response = await apiCall.post("/api/UserProfile/ShippingAddress", data);
  return response.data;
};

export const UpdateShippingAddress = async (id: number, data: Partial<ShippingAddressData>) => {
  const response = await apiCall.patch(`/api/UserProfile/ShippingAddress/${id}`, data);
  return response.data;
};

export const DeleteShippingAddress = async (id: number) => {
  const response = await apiCall.delete(`/api/UserProfile/ShippingAddress/${id}`);
  return response.data;
};

export const RequestDeleteAccountOtp = async () => {
  const response = await apiCall.post("/api/UserProfile/RequestDeleteAccountOtp");
  return response.data;
};

export const ConfirmDeleteAccount = async (otp: string) => {
  const response = await apiCall.delete("/api/UserProfile/DeleteAccount", {
    data: { otp },
  });
  return response.data;
};
