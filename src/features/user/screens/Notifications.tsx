import { Pressable, StyleSheet, Text, View, RefreshControl, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { backarrow } from "../../../assests/icons/AllIcon";
import { SvgXml } from "react-native-svg";
import GradientText from "../../../Components/GradientText";
import { threeDots } from "../../../iconComponent/svgIcons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ModalNotificationsCard from "../components/ModalNotificationsCard";
import { Divider } from "react-native-paper";
import NotificationCard from "../../../Components/cards/NotificationCard";
import { 
  useNotifications, 
  useDeleteNotification, 
  useMarkNotificationAsRead, 
  useMarkAllAsRead, 
  useClearAllNotifications 
} from "../hooks/useNotifications";
import { ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { lightColors } from "../../../../theme";

export default function Notifications() {
  const navigate = useNavigation<any>();
  const { i18n } = useTranslation();
  const [openModal, setopenModal] = useState(false);
  const filters = ["All", "Unread", "Read"];
  const [selected, setselected] = useState("All");

  const params = React.useMemo(() => ({
    unreadOnly: selected === "Unread" ? true : (selected === "Read" ? false : undefined),
    take: 50
  }), [selected]);

  const { data: notificationsResponse, isLoading, refetch } = useNotifications(params);

  const deleteMutation = useDeleteNotification();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();
  const clearAllMutation = useClearAllNotifications();

  // Mark all as read when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      markAllAsReadMutation.mutate();
    }, [])
  );

  const notifications = React.useMemo(() => {
    const list = notificationsResponse?.data || [];
    if (selected === "Read") {
      return list.filter((n: any) => n.isRead);
    }
    if (selected === "Unread") {
      return list.filter((n: any) => !n.isRead);
    }
    return list;
  }, [notificationsResponse, selected]);

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate(undefined, {
      onSuccess: () => setopenModal(false)
    });
  };

  const handleClearAll = () => {
    clearAllMutation.mutate(undefined, {
      onSuccess: () => setopenModal(false)
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 40, backgroundColor: lightColors.bgLight }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 15,
        }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} colors={["#1B2351"]} />
        }
      >
        <ModalNotificationsCard 
          open={openModal} 
          onMarkAllAsRead={handleMarkAllAsRead}
          onClearAll={handleClearAll}
        />
        <View
          style={{
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 4,
          }}
        >
          <Pressable onPress={() => navigate.goBack()} style={{ padding: 10 }}>
            <SvgXml xml={backarrow} />
          </Pressable>
          <GradientText text="Notification" textStyle={styles.text} />
          <Pressable onPress={() => setopenModal(true)} style={{ padding: 10 }}>
            <SvgXml xml={threeDots} />
          </Pressable>
        </View>

        <View style={styles.filters}>
          {filters.map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setselected(filter)}
              style={[
                styles.filterTab,
                selected === filter && styles.activeFilterTab
              ]}
            >
              <Text style={[
                styles.filterText,
                selected === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={{ marginTop: 20 }}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#1B2351" style={{ marginTop: 50 }} />
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <View key={notification.id}>
                <NotificationCard
                  id={notification.id}
                  message={
                    i18n.language === "ar"
                      ? notification.messageAr || notification.message
                      : notification.message
                  }
                  createdAt={notification.createdAt}
                  isRead={notification.isRead}
                  onDelete={handleDelete}
                  onPress={() => {
                    // Mark as read if it's not already
                    if (!notification.isRead) {
                      handleMarkAsRead(notification.id);
                    }
                    
                    // Navigate to brand if referenceId exists
                    if (notification.referenceId) {
                      const brandId = Number(notification.referenceId);
                      if (!isNaN(brandId)) {
                        try {
                          navigate.navigate("BrandProfile", { brandId });
                        } catch {
                          // Screen not in current stack (e.g. brand layout) - ignore
                        }
                      }
                    }
                  }}
                />
                <Divider
                  style={{
                    backgroundColor: "#F0F0F0",
                    width: "100%",
                    height: 1,
                    marginVertical: 10,
                  }}
                />
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 50, color: '#8C8C8C', fontFamily: 'Inter-Regular' }}>
              No notifications found
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
  },
  filters: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "70%",
    alignSelf: 'center',
    marginTop: 20,
    height: 40,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeFilterTab: {
    backgroundColor: "#1B2351",
  },
  filterText: {
    fontSize: 14,
    color: "#8C8C8C",
    fontFamily: "Inter-Medium",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
});
