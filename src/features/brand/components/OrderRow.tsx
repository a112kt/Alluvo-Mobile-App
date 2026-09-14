import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import type { RecentOrder } from "../types/dashboard";

interface OrderRowProps {
  order: RecentOrder;
}

const ORDER_STATUS: Record<number, { label: string; color: string }> = {
  0: { label: "Pending", color: "#F59E0B" },
  1: { label: "Processing", color: "#3B82F6" },
  2: { label: "Shipped", color: "#8B5CF6" },
  3: { label: "Delivered", color: "#10B981" },
  4: { label: "Cancelled", color: "#EF4444" },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function OrderRow({ order }: OrderRowProps) {
  const statusInfo = ORDER_STATUS[order.status] ?? { label: "Unknown", color: "#6B7280" };

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>#{order.orderId}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.orderLabel} numberOfLines={1}>
            Order #{order.orderId}
          </Text>
          <Text style={styles.date}>{timeAgo(order.createdAt)}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.total}>EGP {order.totalAmount.toFixed(2)}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + "20" }]}>
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: s(8),
  },
  avatar: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: s(10),
  },
  avatarText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(11),
    color: lightColors.primary,
  },
  info: {
    flex: 1,
  },
  orderLabel: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.textTitle,
  },
  date: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textHint,
    marginTop: vs(1),
  },
  right: {
    alignItems: "flex-end",
  },
  total: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(15),
    color: lightColors.textTitle,
    marginBottom: vs(3),
  },
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: s(6),
  },
  statusText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(11),
  },
});
