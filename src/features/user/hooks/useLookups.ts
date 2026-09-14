import { useQuery } from "@tanstack/react-query";
import {
  getCountries,
  getCities,
  getColors,
  getSizes,
  getOrderStatuses,
  getStockStatuses,
  getPaymentStatuses,
  getPaymentMethods,
  getInformationTypes,
  getDisputeStatuses,
  getReelStatuses,
  getDeliveryMethods,
} from "../services/lookup";
import { getCategories } from "../services/shop";

export const LOOKUP_QUERY_KEY = ["lookups"];

export const useCountries = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "countries"],
    queryFn: getCountries,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useCities = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "cities"],
    queryFn: getCities,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useColors = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "colors"],
    queryFn: getColors,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useSizes = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "sizes"],
    queryFn: getSizes,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useOrderStatuses = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "order-statuses"],
    queryFn: getOrderStatuses,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useStockStatuses = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "stock-statuses"],
    queryFn: getStockStatuses,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const usePaymentStatuses = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "payment-statuses"],
    queryFn: getPaymentStatuses,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const usePaymentMethods = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "payment-methods"],
    queryFn: getPaymentMethods,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useInformationTypes = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "information-types"],
    queryFn: getInformationTypes,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useDisputeStatuses = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "dispute-statuses"],
    queryFn: getDisputeStatuses,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useReelStatuses = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "reel-statuses"],
    queryFn: getReelStatuses,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useDeliveryMethods = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "delivery-methods"],
    queryFn: getDeliveryMethods,
    staleTime: 24 * 60 * 60 * 1000,
  });

export const useCategories = () =>
  useQuery({
    queryKey: [...LOOKUP_QUERY_KEY, "categories"],
    queryFn: getCategories,
    staleTime: 24 * 60 * 60 * 1000,
  });
