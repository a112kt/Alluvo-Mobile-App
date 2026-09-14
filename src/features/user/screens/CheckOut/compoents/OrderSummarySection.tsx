import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { s } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { useTranslation } from "react-i18next";
import ProductImage from "../../../../../Components/ProductImage";
import { OrderSummaryProduct } from "../../../services/order";

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shipping: number;
  total: number;
  serverItems?: OrderSummaryProduct[];
  serverSubTotal?: number;
  serverDiscountAmount?: number;
  serverShippingPrice?: number;
  serverTotal?: number;
  serverPaymentMethod?: string;
  discountCode?: string;
  onDiscountCodeChange?: (val: string) => void;
  onApplyDiscount?: () => void;
  isDiscountLoading?: boolean;
}

function mapPaymentMethod(paymentMethod: string) {
  if (paymentMethod === "CashOnDelivery") return "Cash On Delivery";
  return paymentMethod;
}

const OrderSummarySection = ({
  cartItems,
  subtotal,
  shipping,
  total,
  serverItems,
  serverSubTotal,
  serverDiscountAmount,
  serverShippingPrice,
  serverTotal,
  serverPaymentMethod,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscount,
  isDiscountLoading,
}: OrderSummaryProps) => {
  const { t } = useTranslation();

  const hasServerData = serverItems && serverItems.length > 0;
  const displayItems = hasServerData ? serverItems : cartItems;
  const displaySubTotal = hasServerData && serverSubTotal != null ? serverSubTotal : subtotal;
  const displayShipping = hasServerData && serverShippingPrice != null ? serverShippingPrice : shipping;
  const displayTotal = hasServerData && serverTotal != null ? serverTotal : total;
  const displayDiscount = hasServerData && serverDiscountAmount != null ? serverDiscountAmount : 0;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: lightColors.primary }]}>{t("orderSummary")}</Text>

      {displayItems.map((item: any, index: number) => {
        const isServerItem = hasServerData;
        const key = isServerItem
          ? `${item.productId}-${index}`
          : `${item.productId}-${item.color}-${item.size}-${index}`;
        const imageUri = isServerItem
          ? item.productImages?.[0]
          : undefined;
        const name = isServerItem ? item.productName : item.productName;
        const size = isServerItem ? item.size : item.size;
        const color = isServerItem ? item.color : undefined;
        const qty = item.quantity;
        const itemTotal = isServerItem ? item.totalItemPrice : item.productPrice * item.quantity;

        return (
          <View key={key} style={styles.productContainer}>
            <View style={styles.imageContainer}>
              {isServerItem && imageUri ? (
                <ProductImage item={{ productMediaUrls: [imageUri] }} style={styles.productImage} />
              ) : (
                <ProductImage item={item} style={styles.productImage} />
              )}
            </View>
            <View style={styles.productInfo}>
              <Text style={[styles.productName, { color: lightColors.primary }]} numberOfLines={2}>
                {name}
              </Text>
              {(size != null || color) && (
                <Text style={styles.productSize}>
                  {isServerItem
                    ? `Size: ${size}${color ? ` • Color: ${color}` : ""}`
                    : item.size
                    ? `${t("size")}: ${item.size}`
                    : ""}
                </Text>
              )}
              <Text style={[styles.productPrice, { color: lightColors.primary }]}>
                {qty} x {isServerItem ? item.unitPrice : item.productPrice} EGP
              </Text>
            </View>
          </View>
        );
      })}

      <View style={styles.discountContainer}>
        <TextInput
          placeholder={t("discountCode") || "Discount Code"}
          placeholderTextColor="#9CA3AF"
          style={[styles.discountInput, { backgroundColor: lightColors.secondary + "33" }]}
          value={discountCode}
          onChangeText={onDiscountCodeChange}
          editable={!isDiscountLoading}
          selectionColor="#47C0D2"
        />
        <Text
          style={[
            styles.applyBtn,
            {
              backgroundColor: "#B5E4EA",
              opacity: isDiscountLoading || !discountCode?.trim() ? 0.5 : 1,
            },
          ]}
          onPress={() => {
            if (!isDiscountLoading && discountCode?.trim()) {
              onApplyDiscount?.();
            }
          }}
        >
          {isDiscountLoading ? "..." : t("apply") || "Apply"}
        </Text>
      </View>

      <View style={styles.summaryTotals}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: lightColors.primary }]}>{t("subtotal")}</Text>
          <Text style={[styles.summaryValue, { color: lightColors.primary }]}>
            {displaySubTotal.toLocaleString("en")} EGP
          </Text>
        </View>

        {displayDiscount > 0 && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: lightColors.primary }]}>
              {t("discount") || "Discount"}
            </Text>
            <Text style={[styles.summaryValue, { color: "#EF4444" }]}>
              -{displayDiscount.toLocaleString("en")} EGP
            </Text>
          </View>
        )}

        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: lightColors.primary }]}>{t("shipping")}</Text>
          <Text style={[styles.summaryValue, { color: lightColors.primary }]}>
            {displayShipping.toLocaleString("en")} EGP
          </Text>
        </View>

        {hasServerData && serverPaymentMethod && (
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: lightColors.primary }]}>
              {t("paymentMethod") || "Payment Method"}
            </Text>
            <Text style={[styles.summaryValue, { color: lightColors.primary }]}>
              {mapPaymentMethod(serverPaymentMethod)}
            </Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={[styles.totalLabel, { color: lightColors.primary }]}>{t("total")}</Text>
          <Text style={[styles.totalValue, { color: lightColors.primary }]}>
            {displayTotal.toLocaleString("en")} EGP
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OrderSummarySection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: s(16),
    marginTop: s(20),
    marginBottom: s(20),
  },
  title: {
    fontSize: s(20),
    fontWeight: "700",
    marginBottom: s(15),
  },
  productContainer: {
    flexDirection: "row",
    marginBottom: s(20),
  },
  imageContainer: {
    width: s(80),
    height: s(80),
    backgroundColor: "#F3F4F6",
    borderRadius: s(8),
    alignItems: "center",
    justifyContent: "center",
    marginEnd: s(15),
    overflow: "hidden",
  },
  productImage: {
    width: "80%",
    height: "80%",
  },
  productInfo: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: s(12),
    fontWeight: "500",
    marginBottom: s(5),
  },
  productSize: {
    fontSize: s(12),
    color: "#666",
    marginBottom: s(5),
    textTransform: "uppercase",
  },
  productPrice: {
    fontSize: s(12),
    fontWeight: "600",
  },
  discountContainer: {
    flexDirection: "row",
    marginBottom: s(20),
    alignItems: "center",
  },
  discountInput: {
    flex: 1,
    height: s(40),
    borderRadius: s(8),
    marginEnd: s(10),
    paddingHorizontal: s(12),
    fontSize: s(12),
    fontFamily: "Inter",
    color: "#1B2351",
  },
  applyBtn: {
    height: s(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: s(8),
    paddingHorizontal: s(16),
    fontSize: s(12),
    fontWeight: "600",
    color: "#1B2351",
    overflow: "hidden",
  },
  summaryTotals: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: s(15),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: s(10),
  },
  summaryLabel: {
    fontSize: s(14),
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: s(14),
    fontWeight: "500",
  },
  totalRow: {
    marginTop: s(10),
    paddingTop: s(10),
  },
  totalLabel: {
    fontSize: s(16),
    fontWeight: "700",
  },
  totalValue: {
    fontSize: s(16),
    fontWeight: "700",
  },
});
