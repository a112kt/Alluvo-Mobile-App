import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import CheckIcon from "./CheckIcon";
import GradientText from "../../../../Components/GradientText";
import { useTranslation } from "react-i18next";

import { useOrdersContext } from "./MyOrders";
import { ActivityIndicator } from "react-native";
import ProductImage from "../../../../Components/ProductImage";
import { useNavigation } from "@react-navigation/native";

const CompletedOrdersTab = () => {
  const { t } = useTranslation();
  const { orders, isLoading } = useOrdersContext();
  const navigation = useNavigation<any>();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color={lightColors.primary} />
      </View>
    );
  }

  // Filter completed/delivered orders
  const completedOrders = orders.filter((order: any) => {
    const status = (order.status || '').toLowerCase();
    return status === 'completed' || status === 'delivered' || status === 'done';
  });

  return (
    <View style={styles.container}>
      {completedOrders.length > 0 ? (
        completedOrders.map((order: any) => {
          const items = order.orderItems || order.items || [];
          const itemCount = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          const firstItem = items[0] || {};

          return (
            <TouchableOpacity
              key={order.id || order.orderNumber}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("OrderDetails", { orderId: order.id })}
              style={styles.card}
            >
              {/* Left Images */}
              <View style={styles.imagesBox}>
                <ProductImage
                  item={firstItem}
                  style={styles.imgFull}
                />
              </View>

              {/* Middle Text Content */}
              <View style={styles.infoBox}>
                <Text style={[styles.orderName, { color: lightColors.primary }]}>Order #{order.orderNumber || order.id}</Text>
                <Text style={[styles.delivery, { color: lightColors.subtitle }]}>{order.deliveryMethod || "Standard Delivery"}</Text>

                <View style={styles.statusRow}>
                  <Text style={[styles.status, { color: lightColors.primary }]}>{order.status || "Delivered"}</Text>
                  <CheckIcon />
                </View>
              </View>

              {/* Right Side */}
              <View style={styles.rightSide}>
                <View style={styles.itemsBubble}>
                  <Text style={[styles.itemsText, { color: lightColors.primary }]}>{itemCount} {t("itemsTxt")}</Text>
                </View>

                <TouchableOpacity style={[styles.reviewBtn, { borderColor: lightColors.primary }]}>
                  <GradientText text={t("review")} textStyle={styles.reviewTxt} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={[styles.noOrdersText, { color: lightColors.subtitle }]}>{t("noCompletedOrders") || "No completed orders yet."}</Text>
      )}
    </View>
  );
};

export default CompletedOrdersTab;

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },

  card: {
    flexDirection: "row",
    borderRadius: scale(14),
    padding: scale(10),
    marginBottom: verticalScale(10),
    alignItems: "center",
  },

  imagesBox: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(12),
    overflow: "hidden",
    marginEnd: scale(10),
    flexDirection: "row",
  },

  img: {
    width: "50%",
    height: "100%",
    resizeMode: "cover",
  },

  infoBox: {
    flex: 1,
  },

  orderName: {
    fontSize: scale(14),
    fontFamily: "Poppins-Bold",
  },

  delivery: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    marginVertical: scale(2),
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  status: {
    fontSize: scale(18),
    fontFamily: "Poppins-Bold",
  },

  check: {
    width: scale(16),
    height: scale(16),
    marginStart: scale(4),
  },

  rightSide: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  itemsBubble: {
    backgroundColor: "#F4F4F4",
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(10),
  },

  itemsText: {
    fontSize: scale(13),
    fontFamily: "Poppins-Regular",
  },

  reviewBtn: {
    marginTop: verticalScale(6),
    borderWidth: 1,
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(10),
  },

  reviewTxt: {
    fontSize: scale(12),
    fontFamily: "Poppins-Bold",
  },
  center: {
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgFull: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noOrdersText: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});
