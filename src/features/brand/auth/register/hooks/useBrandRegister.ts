import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setToken } from "../../../../../Redux/slices/authSlice";
import {
  brandRegister,
  verifyOtp,
  addBrandInfo,
  verifyIdentity,
} from "../services";

export function useBrandRegister() {
  return useMutation({
    mutationFn: (data: FormData) => brandRegister(data),
  });
}

export function useBrandVerifyOtp() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) => verifyOtp(data),
    onSuccess: (resData) => {
      const token = resData?.data?.token || resData?.token || null;
      if (token) {
        dispatch(setToken(token));
      }
    },
  });
}

export function useBrandAddInfo() {
  return useMutation({
    mutationFn: (data: {
      DisplayName: string;
      Description: string;
      LogoUrl: string;
      ReturnPolicyAsHtml: string;
      category: string;
      country: string;
      Governorate: string;
      district: string;
      numberOfEmployees: string;
    }) => addBrandInfo(data),
  });
}

export function useBrandVerifyIdentity() {
  return useMutation({
    mutationFn: (data: FormData) => verifyIdentity(data),
  });
}
