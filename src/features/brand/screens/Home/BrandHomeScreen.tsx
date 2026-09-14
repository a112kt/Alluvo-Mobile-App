import React, { useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Pressable,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useSelector } from "react-redux";
import { RootState } from "../../../../Redux/store";
import { useBrandTabBarPadding } from "../../navigation/useBrandTabBarPadding";
import { useBrandDashboard, useMyBrand } from "../../hooks/useBrandDashboard";
import { useRoomList } from "../../../user/hooks/useChat";
import { ChatContext } from "../../../user/chatContext/ChatContext";
import StatCard from "../../components/StatCard";
import TopReelCard from "../../components/TopReelCard";
import OrderRow from "../../components/OrderRow";
import PendingApprovalCard from "../../components/PendingApprovalCard";
import RejectedCard from "../../components/RejectedCard";
import { DashboardSkeleton, FadeInView } from "../../components/SkeletonLoader";
import ErrorState from "../../components/ErrorState";

function PressableScale({
  children,
  onPress,
  style,
}: {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

function fmt(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

function fmtCurrency(n: number): string {
  if (n >= 1000000) return `EGP ${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `EGP ${(n / 1000).toFixed(1)}K`;
  return `EGP ${n.toFixed(0)}`;
}

function ErrorView({ onRetry }: { onRetry?: () => void }) {
  return <ErrorState message="Failed to load dashboard data." onRetry={onRetry} />;
}

const ORDER_STATUS_LABELS: Record<number, string> = {
  0: "Pending",
  1: "Processing",
  2: "Shipped",
  3: "Delivered",
  4: "Cancelled",
};

export default function BrandHomeScreen({ navigation }: any) {
  const tabBarPadding = useBrandTabBarPadding();
  const brandName = useSelector((state: RootState) => state.auth.brandName);
  const { data: brand, isLoading: brandLoading, isError: brandError, refetch: refetchBrand } = useMyBrand();
  const { data: dashboard, isLoading: dashLoading, isError: dashError, refetch: refetchDash, isRefetching } =
    useBrandDashboard();
  const { data: roomList } = useRoomList();
  const { roomUpdatedReadCount } = useContext(ChatContext);

  const rooms = roomList?.data || [];
  let totalUnread = rooms.reduce((sum: number, r: any) => sum + (r.unreadCount || 0), 0);
  if (roomUpdatedReadCount?.roomIdDec) {
    const room = rooms.find((r: any) => r.roomIdDec === roomUpdatedReadCount.roomIdDec);
    if (room) {
      totalUnread = totalUnread - (room.unreadCount || 0) + roomUpdatedReadCount.count;
    }
  }
  const badgeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalUnread > 0) {
      Animated.sequence([
        Animated.timing(badgeScale, { toValue: 1.3, duration: 120, useNativeDriver: true }),
        Animated.spring(badgeScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
    }
  }, [totalUnread]);

  const loading = brandLoading || dashLoading;
  const hasError = brandError || dashError;
  const status = brand?.status;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <DashboardSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (hasError && !brand) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={false} onRefresh={() => { refetchBrand(); refetchDash(); }} />}
        >
          <ErrorView onRetry={() => { refetchBrand(); refetchDash(); }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (status === "PENDING_APPROVAL") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetchBrand(); refetchDash(); }} />}
        >
          <FadeInView delay={0}>
            <PendingApprovalCard submittedAt={brand?.submittedAt} />
          </FadeInView>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (status === "REJECTED") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetchBrand(); refetchDash(); }} />}
        >
          <FadeInView delay={0}>
            <RejectedCard
              rejectionReason={brand?.rejectionReason}
              lastFailedStep={brand?.lastFailedStep}
              onContinueRegistration={() => {}}
            />
          </FadeInView>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const d = dashboard;

  const statItems = [
    { icon: "cash-outline" as const, title: "Total Revenue", value: fmtCurrency(d?.totalRevenue ?? 0), trend: d?.revenueGrowthPercentage != null ? `${d.revenueGrowthPercentage > 0 ? "+" : ""}${d.revenueGrowthPercentage.toFixed(1)}%` : undefined, trendDirection: (d?.revenueGrowthPercentage ?? 0) >= 0 ? ("up" as const) : ("down" as const) },
    { icon: "cart-outline" as const, title: "Total Orders", value: fmt(d?.totalOrders ?? 0), trend: d?.ordersGrowthPercentage != null ? `${d.ordersGrowthPercentage > 0 ? "+" : ""}${d.ordersGrowthPercentage.toFixed(1)}%` : undefined, trendDirection: (d?.ordersGrowthPercentage ?? 0) >= 0 ? ("up" as const) : ("down" as const) },
    { icon: "people-outline" as const, title: "Active Customers", value: fmt(d?.activeCustomers ?? 0), trend: d?.customersGrowthPercentage != null ? `${d.customersGrowthPercentage > 0 ? "+" : ""}${d.customersGrowthPercentage.toFixed(1)}%` : undefined, trendDirection: (d?.customersGrowthPercentage ?? 0) >= 0 ? ("up" as const) : ("down" as const) },
    { icon: "eye-outline" as const, title: "Total Reel Views", value: fmt(d?.totalReelViews ?? 0) },
    { icon: "heart-outline" as const, title: "Total Reel Likes", value: fmt(d?.totalReelLikes ?? 0) },
    { icon: "videocam-outline" as const, title: "Published Reels", value: String(d?.reelCounts?.published ?? 0) },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarPadding }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => { refetchBrand(); refetchDash(); }} />}
      >
        <FadeInView delay={0}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greetingLabel}>{greeting},</Text>
                <Text style={styles.greetingName} numberOfLines={1}>
                  {brandName ?? "Brand"}
                </Text>
              </View>
              <View style={styles.headerActions}>
                <Pressable style={styles.notifBtn} onPress={() => navigation.getParent()?.navigate("BrandMessages")}>
                  <Ionicons name="chatbubble-ellipses-outline" size={s(22)} color={lightColors.textTitle} />
                  {totalUnread > 0 && (
                    <Animated.View style={[styles.msgBadge, { transform: [{ scale: badgeScale }] }]}>
                      <Text style={styles.msgBadgeText}>{totalUnread > 99 ? "99+" : totalUnread}</Text>
                    </Animated.View>
                  )}
                </Pressable>
                <Pressable style={styles.notifBtn} onPress={() => navigation.getParent()?.navigate("Notifications")}>
                  <Ionicons name="notifications-outline" size={s(22)} color={lightColors.textTitle} />
                </Pressable>
              </View>
            </View>
            <Text style={styles.subtitle}>Here's an overview of your brand performance.</Text>
          </View>
        </FadeInView>

        <View style={styles.statGrid}>
          {statItems.map((item, index) => (
            <View key={index} style={styles.statCol}>
              <FadeInView delay={100 + index * 60}>
                <StatCard {...item} />
              </FadeInView>
            </View>
          ))}
        </View>

        <FadeInView delay={500}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reels Analytics</Text>
              <PressableScale onPress={() => navigation.getParent()?.navigate("ReelAnalytics")}>
                <View style={styles.seeAllBtn}>
                  <Text style={styles.seeAllText}>See Analytics</Text>
                  <Ionicons name="arrow-forward" size={s(14)} color={lightColors.secondary} />
                </View>
              </PressableScale>
            </View>
            <View style={styles.analyticsRow}>
              <View style={styles.analyticsItem}>
                <Ionicons name="eye-outline" size={s(20)} color={lightColors.secondary} />
                <Text style={styles.analyticsValue}>{fmt(d?.totalReelViews ?? 0)}</Text>
                <Text style={styles.analyticsLabel}>Total Views</Text>
              </View>
              <View style={styles.analyticsDivider} />
              <View style={styles.analyticsItem}>
                <Ionicons name="heart-outline" size={s(20)} color={lightColors.textDanger} />
                <Text style={styles.analyticsValue}>{fmt(d?.totalReelLikes ?? 0)}</Text>
                <Text style={styles.analyticsLabel}>Total Likes</Text>
              </View>
              <View style={styles.analyticsDivider} />
              <View style={styles.analyticsItem}>
                <Ionicons name="play-circle-outline" size={s(20)} color="#10B981" />
                <Text style={styles.analyticsValue}>{d?.reelCounts?.published ?? 0}</Text>
                <Text style={styles.analyticsLabel}>Published</Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {d?.recentOrders && d.recentOrders.length > 0 && (
          <FadeInView delay={580}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Orders</Text>
              </View>
              {d.recentOrders.slice(0, 5).map((order) => (
                <OrderRow key={order.orderId} order={order} />
              ))}
            </View>
          </FadeInView>
        )}

        {d?.topViewedReels && d.topViewedReels.length > 0 && (
          <FadeInView delay={660}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Viewed Reels</Text>
                <PressableScale onPress={() => navigation.getParent()?.navigate("ReelAnalytics")}>
                  <Text style={styles.seeAllText}>See All</Text>
                </PressableScale>
              </View>
              {d.topViewedReels.slice(0, 5).map((reel, index) => (
                <TopReelCard key={reel.reelId} reel={reel} rank={index + 1} />
              ))}
            </View>
          </FadeInView>
        )}

        {d?.topProducts && d.topProducts.length > 0 && (
          <FadeInView delay={740}>
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Top Products</Text>
              </View>
              {d.topProducts.slice(0, 5).map((product, index) => (
                <View key={`topprod-${product.productId}-${index}`} style={styles.productRow}>
                  <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                    <Text style={styles.productMeta}>{product.totalSold} sold · {fmtCurrency(product.revenue)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </FadeInView>
        )}

        <View style={{ height: vs(20) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(8),
  },
  greetingSection: {
    marginBottom: vs(24),
  },
  greetingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greetingLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(15),
    color: lightColors.textSubtitle,
  },
  greetingName: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(22),
    color: lightColors.textTitle,
    marginTop: vs(2),
  },
  notifBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(12),
    backgroundColor: lightColors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: "relative",
  },
  headerActions: {
    flexDirection: "row",
    gap: s(8),
  },
  msgBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF3B30",
    borderRadius: s(9),
    minWidth: s(18),
    height: s(18),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(4),
    borderWidth: 1.5,
    borderColor: lightColors.white,
  },
  msgBadgeText: {
    color: "#FFF",
    fontSize: s(9),
    fontWeight: "700",
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textSubtitle,
    marginTop: vs(8),
    lineHeight: s(20),
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: s(-4),
    marginBottom: vs(8),
  },
  statCol: {
    width: "50%",
  },
  sectionCard: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(20),
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: vs(16),
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(4),
  },
  seeAllText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.secondary,
  },
  analyticsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: vs(8),
  },
  analyticsItem: {
    alignItems: "center",
    flex: 1,
  },
  analyticsDivider: {
    width: 1,
    height: vs(40),
    backgroundColor: lightColors.separator,
  },
  analyticsValue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginTop: vs(6),
  },
  analyticsLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rankBadge: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(10),
  },
  rankText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(11),
    color: lightColors.textSubtitle,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textTitle,
    marginBottom: vs(2),
  },
  productMeta: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textHint,
  },
});
