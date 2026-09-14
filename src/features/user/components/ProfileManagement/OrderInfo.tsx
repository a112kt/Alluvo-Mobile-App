import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { OrderInfo as OrderInfoType } from "../../services/order";

interface OrderInfoProps {
  orderData?: OrderInfoType | null;
}

const OrderInfo = ({ orderData }: OrderInfoProps) => {
  return (
    <View style={styles.container}>
      {/* Payment Status */}
      <View style={styles.row}>
        <Text style={styles.label}>Payment Status:</Text>
        <Text style={styles.value}>
          {orderData?.paymentStatus || "N/A"}
        </Text>
      </View>

      {/* Order Status */}
      <View style={styles.row}>
        <Text style={styles.label}>Order Status:</Text>
        <Text style={styles.value}>
          {orderData?.status || "N/A"}
        </Text>
      </View>

      {/* Payment method */}
      <View style={styles.row}>
        <Text style={styles.label}>Payment method:</Text>
        <Text style={styles.value}>
          {orderData?.paymentMethod || "N/A"}
        </Text>
      </View>

      {/* Delivery method */}
      <View style={styles.row}>
        <Text style={styles.label}>Delivery method:</Text>
        <Text style={styles.value}>
          {orderData?.deliveryMethod || "N/A"}
        </Text>
      </View>

      {/* Total */}
      <View style={styles.totalRow}>
        <Text style={styles.label}>Total Amount:</Text>
        <Text style={styles.total}>
          {orderData?.totalAmount ? `EGP ${orderData.totalAmount.toFixed(2)}` : "N/A"}
        </Text>
      </View>
    </View>
  );
};

export default OrderInfo;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(10),
    paddingHorizontal: scale(5),
    borderRadius: scale(12),
    padding: scale(16),
    marginHorizontal: scale(16),
  },

  row: {
    flexDirection: "row",
    marginBottom: verticalScale(10),
  },

  totalRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  label: {
    fontSize: scale(13),
    fontWeight: "600",
    color: lightColors.subtitle,
    fontFamily: "Poppins-SemiBold",
  },

  value: {
    fontSize: scale(14),
    color: lightColors.primary,
    fontFamily: "Poppins-Regular",
    marginStart: scale(8),
    flexShrink: 1,
    flexWrap: "wrap",
  },

  paymentValue: {
    flexDirection: "row",
    alignItems: "center",
    marginStart: scale(4),
  },

  mastercard: {
    width: scale(35),
    height: verticalScale(22),
    marginEnd: scale(4),
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  total: {
    fontSize: scale(16),
    fontWeight: "700",
    fontFamily: "Poppins-Bold",
  },
});
