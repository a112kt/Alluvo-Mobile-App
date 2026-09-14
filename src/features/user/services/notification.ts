import { apiCall } from "../../../../services/apiClient";

export interface Notification {
  id: number;
  userId: string;
  user: any;
  type: number;
  referenceId: number;
  message: string;
  messageAr: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  statusCode: number;
  message: {
    en: string;
    ar: string;
  };
  data: Notification[];
  errors: any;
}

export interface NotificationsParams {
  unreadOnly?: boolean;
  lastNotificationDate?: string;
  take?: number;
}

/**
 * Fetch notifications from the server
 */
export const getNotifications = async (params: NotificationsParams = {}): Promise<NotificationsResponse> => {
  const response = await apiCall.get("/api/Notification", { params });
  return response.data;
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = async (id: number) => {
  const response = await apiCall.patch(`/api/Notification/${id}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async () => {
  const response = await apiCall.put("/api/Notification/mark-all-read");
  return response.data;
};

/**
 * Get the count of unread notifications
 */
export const getUnreadCount = async () => {
  const response = await apiCall.get("/api/Notification/unread-count");
  return response.data;
};

/**
 * Delete a single notification
 */
export const deleteNotification = async (id: number) => {
  const response = await apiCall.delete(`/api/Notification/${id}`);
  return response.data;
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async () => {
  const response = await apiCall.delete("/api/Notification/clear-all");
  return response.data;
};
