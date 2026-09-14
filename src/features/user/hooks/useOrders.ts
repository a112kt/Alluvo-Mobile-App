import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyOrders,
  getOrderDetails,
  createOrder,
  updateOrderStatus,
  getOrderSummary,
  CreateOrderPayload,
  OrderSummaryPayload,
  OrderSummaryResponse,
  MyOrdersResponse,
  OrderInfo,
  deleteOrder,
  payWithCard,
  payWithWallet,
} from "../services/order";

export const ORDERS_QUERY_KEY = ["orders"];

export const useMyOrders = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: getMyOrders,
  });
};

export const useMyOrdersGrouped = () => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "grouped"],
    queryFn: getMyOrders,
    select: (response: MyOrdersResponse) => {
      const data = response?.data ?? response;
      return {
        active: Array.isArray(data?.active) ? data.active : [],
        completed: Array.isArray(data?.completed) ? data.completed : [],
        issues: Array.isArray(data?.issues) ? data.issues : [],
      };
    },
  });
};

export const useOrderDetails = (id: number | null) => {
  return useQuery({
    queryKey: [...ORDERS_QUERY_KEY, "details", id],
    queryFn: () => getOrderDetails(id!),
    enabled: !!id,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
};

export const useOrderSummary = () => {
  return useMutation({
    mutationFn: (payload: OrderSummaryPayload) => getOrderSummary(payload),
  });
};

export const usePayWithCard = () => {
  return useMutation({
    mutationFn: (orderId: number) => payWithCard(orderId),
  });
};

export const usePayWithWallet = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      phone,
    }: {
      orderId: number;
      phone: string;
    }) => payWithWallet(orderId, phone),
  });
};
