import { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";
import { jwtDecode } from "jwt-decode";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../../services/toastService";

export const useSignalR = () => {
  const navigate = useNavigation<any>();
  const token = useSelector((state: RootState) => state.auth.token);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const queryClient = useQueryClient();
  const [lastNotification, setLastNotification] = useState<any>(null);

  useEffect(() => {
    if (!token) return;

    let userId = "";
    try {
      const decoded: any = jwtDecode(token);
      // The userId is usually in 'nameidentifier' or 'sub' claim
      userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || decoded.sub;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    if (!userId) return;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.EXPO_PUBLIC_API_URL}/notificationHub?userId=${userId}`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, [token]);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
        }
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
      }
    };

    startConnection();

    connection.on("ReceiveNotification", (notification) => {
      setLastNotification(notification);
      
      const i18n = require('i18next');
      const currentLang = (i18n.default || i18n).language || 'en';
      
      showToast(
        currentLang === 'ar' ? "إشعار جديد" : "New Notification",
        currentLang === 'ar' 
          ? (notification.messageAr || notification.message)
          : (notification.message || notification.messageAr),
        () => {
          // Navigate to notifications screen
          navigate.navigate("User", { screen: "Notifications" });
        }
      );

      // Optimistically add the new notification to the cache
      queryClient.setQueriesData({ queryKey: ["notifications"] }, (old: any) => {
        if (!old || !old.data) return old;
        // Check if notification already exists to avoid duplicates
        if (old.data.find((n: any) => n.id === notification.id)) return old;
        return {
          ...old,
          data: [notification, ...old.data]
        };
      });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    connection.on("UpdateUnreadCount", (count) => {
      queryClient.setQueryData(["notifications", "unread-count"], (old: any) => {
        if (!old) return { data: count };
        return { ...old, data: count };
      });
    });

    return () => {
      connection.off("ReceiveNotification");
      connection.off("UpdateUnreadCount");
      if (connection.state !== signalR.HubConnectionState.Disconnected) {
        connection.stop();
      }
    };
  }, [connection, queryClient]);

  return { lastNotification };
};
