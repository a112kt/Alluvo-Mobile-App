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
import GradientText from "../../../../Components/GradientText";
import { useTranslation } from "react-i18next";

import { useOrdersContext } from "./MyOrders";
import { ActivityIndicator } from "react-native";
import ProductImage from "../../../../Components/ProductImage";
import { useNavigation } from "@react-navigation/native";

const BlockedOrdersTab = () => {
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

  // Filter blocked/cancelled orders
  const blockedOrders = orders.filter((order: any) => {
    const status = (order.status || '').toLowerCase();
    return status === 'cancelled' || status === 'blocked' || status === 'rejected';
  });

  return (
    <ScrollView style={styles.container}>
      {blockedOrders.length > 0 ? (
        blockedOrders.map((order: any) => {
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
              <View style={styles.imagesBox}>
                <ProductImage
                  item={firstItem}
                  style={styles.imgFull}
                />
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.orderName}>Order #{order.orderNumber || order.id}</Text>
                <Text style={styles.delivery}>{order.deliveryMethod || "Standard Delivery"}</Text>

                <View style={styles.Btns}>
                  <TouchableOpacity>
                    <GradientText textStyle={styles.record} text={t("reorder") || "Reorder"}/>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <GradientText textStyle={styles.record} text={t("contactSupport") || "Support"}/>
                  </TouchableOpacity>
                </View>
              </View>    
              
              <View style={styles.itemsBubble}>
                <Text style={styles.itemsText}>{itemCount} {t("itemsTxt")}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text style={styles.noOrdersText}>{t("noBlockedOrders") || "No blocked/cancelled orders."}</Text>
      )}
    </ScrollView>
  );
};

export default BlockedOrdersTab;

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },

  card: {
    flexDirection: "row",
    borderRadius: scale(14),
    padding: scale(10),
    marginBottom: verticalScale(10),
    alignItems: "flex-start", 
    position: 'relative', 
  },

  imagesBox: {
    width: scale(89),
    height: scale(89),
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

  imgFull: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  infoBox: {
    flex: 1,
  },

  orderName: {
    fontSize: scale(14),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
  },

  delivery: {
    fontSize: scale(12),
    color: lightColors.subtitle,
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
    color: lightColors.primary,
  },

  check: {
    width: scale(16),
    height: scale(16),
    marginStart: scale(4),
  },

  itemsBubble: {
    position: 'absolute',
    top: verticalScale(10), 
    right: scale(10),    
    backgroundColor: lightColors.white, 
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
  },

  itemsText: {
    fontSize: scale(12), 
    color: lightColors.primary,
    fontFamily: "Poppins-Regular",
  },
  Btns:{
    flexDirection:'row',
    gap:scale(4),
    paddingBottom:verticalScale(2), 
    marginTop:verticalScale(8), 
  },
  record:{
    borderWidth:2,
    padding:scale(4),
    borderRadius:scale(10),
  },
  center: {
    padding: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersText: {
    fontSize: scale(14),
    fontFamily: 'Poppins-Regular',
    color: lightColors.subtitle,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});