import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useTranslation } from "react-i18next";
import { useMyOrdersGrouped } from "../../hooks/useOrders";
import { useNavigation } from "@react-navigation/native";
import { OrderInfo, OrderItemInfo } from "../../services/order";
import { getProductImageUri } from "../../../../utils/imageUtils";
import EmptyOrdersIcon from "./EmptyOrdersIcon";

type TabId = "active" | "completed" | "issues";

const TABS: { id: TabId; labelKey: string }[] = [
  { id: "active", labelKey: "active" },
  { id: "completed", labelKey: "completed" },
  { id: "issues", labelKey: "issues" },
];

const GRID_SIZE = scale(140);
const GRID_GAP = 2;

const OrderImageGrid = ({ items }: { items: OrderItemInfo[] }) => {
  const visible = items.slice(0, 4);
  const count = visible.length;

  const Cell = ({
    item,
    flexStyle,
  }: {
    item: OrderItemInfo;
    flexStyle: object;
  }) => {
    const uri = getProductImageUri(item);
    return (
      <View style={[styles.gridCell, flexStyle]}>
        {uri ? (
          <Image
            source={{ uri }}
            style={styles.gridImage}
            resizeMode="cover"
          />
        ) : null}
      </View>
    );
  };

  if (count === 1)
    return (
      <View style={styles.gridContainer}>
        <Cell item={visible[0]} flexStyle={StyleSheet.absoluteFill} />
      </View>
    );

  if (count === 2)
    return (
      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <Cell item={visible[0]} flexStyle={{ flex: 1 }} />
          <View style={{ width: GRID_GAP }} />
          <Cell item={visible[1]} flexStyle={{ flex: 1 }} />
        </View>
      </View>
    );

  if (count === 3)
    return (
      <View style={styles.gridContainer}>
        <View style={[styles.gridRow, { height: (GRID_SIZE - GRID_GAP) / 2 }]}>
          <Cell item={visible[0]} flexStyle={{ flex: 1 }} />
          <View style={{ width: GRID_GAP }} />
          <Cell item={visible[1]} flexStyle={{ flex: 1 }} />
        </View>
        <View style={{ height: GRID_GAP }} />
        <Cell
          item={visible[2]}
          flexStyle={{ width: "100%", height: (GRID_SIZE - GRID_GAP) / 2 }}
        />
      </View>
    );

  return (
    <View style={styles.gridContainer}>
      <View style={[styles.gridRow, { height: (GRID_SIZE - GRID_GAP) / 2 }]}>
        <Cell item={visible[0]} flexStyle={{ flex: 1 }} />
        <View style={{ width: GRID_GAP }} />
        <Cell item={visible[1]} flexStyle={{ flex: 1 }} />
      </View>
      <View style={{ height: GRID_GAP }} />
      <View style={[styles.gridRow, { height: (GRID_SIZE - GRID_GAP) / 2 }]}>
        <Cell item={visible[2]} flexStyle={{ flex: 1 }} />
        <View style={{ width: GRID_GAP }} />
        <Cell item={visible[3]} flexStyle={{ flex: 1 }} />
      </View>
    </View>
  );
};

const OrderCard = ({ order }: { order: OrderInfo }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const items = order.items ?? [];
  const itemCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const amount = order.totalAmount ?? 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("OrderDetails", { orderId: order.id })
      }
      style={styles.card}
    >
      <View style={styles.cardTop}>
        <View style={styles.cardTopLeft}>
          <Text style={styles.orderId}>
            {t("orderHeader", { id: order.orderNumber || order.id })}
          </Text>
          <Text style={styles.orderDate}>
            {order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : ""}
          </Text>
        </View>
        {/* <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{order.status || t("na")}</Text>
        </View> */}
      </View>

      <OrderImageGrid items={items as OrderItemInfo[]} />

      <View style={styles.cardBottom}>
        <Text style={styles.bottomLeft}>
          {itemCount} {t("itemsTxt")}
        </Text>
        <Text style={styles.bottomRight}>
          {amount > 0 ? `${t("egp")} ${amount.toFixed(2)}` : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyState = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.emptyWrap}>
      <EmptyOrdersIcon />
      <Text style={styles.emptyTitle}>{t("noOrdersYet")}</Text>
      <Text style={styles.emptySub}>{t("noOrdersDesc")}</Text>
    </View>
  );
};

export const useOrdersContext = () => ({
  orders: [] as any[],
  isLoading: false,
});

const MyOrders = () => {
  const { t } = useTranslation();
  const { data: groupedOrders, isLoading } = useMyOrdersGrouped();
  const [activeTab, setActiveTab] = useState<TabId>("active");

  const currentOrders =
    activeTab === "active"
      ? (groupedOrders?.active ?? [])
      : activeTab === "completed"
        ? (groupedOrders?.completed ?? [])
        : (groupedOrders?.issues ?? []);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{t("myOrders")}</Text>

      <View style={styles.tabRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
            >
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                {t(tab.labelKey)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={lightColors.primary} />
        </View>
      ) : currentOrders.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.list}>
          {currentOrders.map((order: OrderInfo) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </View>
      )}
    </View>
  );
};

export default MyOrders;

const styles = StyleSheet.create({
  section: {
    paddingTop: verticalScale(6),
    paddingBottom: verticalScale(4),
  },
  sectionTitle: {
    fontSize: scale(20),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
    marginBottom: verticalScale(10),
    paddingHorizontal: scale(16),
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: lightColors.bgLight,
    borderRadius: scale(10),
    padding: scale(3),
    marginHorizontal: scale(16),
    marginBottom: verticalScale(12),
  },
  tabBtn: {
    flex: 1,
    paddingVertical: verticalScale(7),
    alignItems: "center",
    borderRadius: scale(8),
  },
  tabBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  tabLabel: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
    color: lightColors.subtitle,
  },
  tabLabelActive: {
    color: lightColors.primary,
    fontFamily: "Poppins-SemiBold",
  },
  loadingBox: {
    paddingVertical: verticalScale(60),
    alignItems: "center",
  },
  list: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(8),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: scale(14),
    padding: scale(14),
    marginBottom: verticalScale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: verticalScale(10),
  },
  cardTopLeft: {
    flex: 1,
  },
  orderId: {
    fontSize: scale(14),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
  },
  orderDate: {
    fontSize: scale(11),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    marginTop: verticalScale(1),
  },
  statusPill: {
    backgroundColor: "rgba(71, 192, 210, 0.12)",
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(3),
    borderRadius: scale(20),
  },
  statusPillText: {
    fontSize: scale(11),
    fontFamily: "Poppins-Medium",
    color: lightColors.primary,
  },
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    borderRadius: scale(10),
    overflow: "hidden",
    backgroundColor: lightColors.bgLight,
    alignSelf: "center",
  },
  gridRow: {
    flexDirection: "row",
    flex: 1,
  },
  gridCell: {
    overflow: "hidden",
    backgroundColor: lightColors.bgLight,
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: verticalScale(8),
  },
  bottomLeft: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
  },
  bottomRight: {
    fontSize: scale(14),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
  },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: verticalScale(32),
    paddingHorizontal: scale(32),
  },
  emptyTitle: {
    fontSize: scale(16),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
    marginTop: verticalScale(16),
    textAlign: "center",
  },
  emptySub: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    textAlign: "center",
    marginTop: verticalScale(6),
    lineHeight: scale(18),
  },
});
