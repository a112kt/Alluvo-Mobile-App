import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification, 
  NotificationsParams,
  markAllAsRead,
  getUnreadCount,
  clearAllNotifications
} from "../services/notification";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

/**
 * Hook to fetch notifications
 */
export const useNotifications = (params: NotificationsParams = {}) => {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
    queryFn: () => getNotifications(params),
  });
};

/**
 * Hook to get unread count
 */
export const useUnreadCount = () => {
  return useQuery({
    queryKey: [...NOTIFICATIONS_QUERY_KEY, "unread-count"],
    queryFn: getUnreadCount,
  });
};

/**
 * Hook to mark a notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

/**
 * Hook to mark all as read
 */
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onMutate: async () => {
      // Optimistically clear unread count
      queryClient.setQueryData([...NOTIFICATIONS_QUERY_KEY, "unread-count"], (old: any) => {
        if (!old) return { data: 0 };
        return { ...old, data: 0 };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

/**
 * Hook to delete a notification with optimistic updates
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
      const previousData = queryClient.getQueryData([NOTIFICATIONS_QUERY_KEY]);
      
      // Optimistic update for all queries under 'notifications'
      queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (old: any) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((n: any) => n.id !== id)
        };
      });

      return { previousData };
    },
    onError: (err, id, context) => {
      if (context?.previousData) {
        queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};

/**
 * Hook to clear all notifications
 */
export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearAllNotifications,
    onSuccess: () => {
      queryClient.setQueriesData({ queryKey: NOTIFICATIONS_QUERY_KEY }, (old: any) => {
        if (!old) return old;
        return { ...old, data: [] };
      });
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
    },
  });
};
