import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { SvgXml } from "react-native-svg";
import { scale } from "react-native-size-matters";
import GradientText from "../../../Components/GradientText";
import ProductCard from "../../../Components/cards/product cards/CartProduct";
import EmptyCart from "../../../iconComponent/EmptyCartIcon";
import { useCart, useClearCart } from "../hooks/useCart";
import { lightColors } from "../../../../theme";
import { showToast } from "../../../services/toastService";
import { trashSvg } from "../../../assests/icons/AllIcon";
import { UserStackParamList } from "../../../Navigation/types";
import { absoluteUrl } from "../../../config/env";

const SHIPPING_COST = 50;

type CartScreenRouteProp = RouteProp<UserStackParamList, "Cart">;

export default function CartUser() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<CartScreenRouteProp>();
  const brandId = route.params?.brandId;
  const brandName = route.params?.brandName;

  const { data, isLoading } = useCart();
  const clearCartMutation = useClearCart();
  const [showClearModal, setShowClearModal] = useState(false);

  const brands = data?.data?.brands ?? [];
  const brandGroup = brandId ? brands.find((b) => b.brandId === brandId) : undefined;
  const cartItems = brandGroup?.items ?? [];
  const empty = !isLoading && cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.productPrice * item.quantity,
    0
  );
  const total = subtotal + (cartItems.length > 0 ? SHIPPING_COST : 0);

  const brandLogoUrl = brandGroup?.brandLogoUrl;
  const logoUri = brandLogoUrl
    ? brandLogoUrl.startsWith("http")
      ? brandLogoUrl
      : absoluteUrl(brandLogoUrl)
    : null;

  const handleDeleteAll = () => {
    clearCartMutation.mutate(brandId, {
      onSuccess: () => {
        showToast("Cart", "All items removed from cart.");
        setShowClearModal(false);
      },
      onError: () => {
        setShowClearModal(false);
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.brandLogo} />
          ) : null}
          <View>
            <GradientText
              text={brandName || t("cart")}
              textStyle={styles.title}
            />
            {cartItems.length > 0 && (
              <Text style={styles.itemCount}>
                {cartItems.length}{" "}
                {cartItems.length === 1 ? "item" : "items"}
              </Text>
            )}
          </View>
        </View>
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.deleteAllBtn}
            onPress={() => setShowClearModal(true)}
            activeOpacity={0.7}
          >
            <SvgXml xml={trashSvg} width={16} height={16} />
            <Text style={styles.deleteAllText}>Delete All</Text>
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#47C0D2" />
        </View>
      ) : !empty ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => `${item.productId}-${item.color}-${item.size}`}
          renderItem={({ item }) => <ProductCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View>
              <View style={styles.statsBar}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>
                    {subtotal.toLocaleString("en")} EGP
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Shipping</Text>
                  <Text style={styles.summaryValue}>
                    {SHIPPING_COST} EGP
                  </Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>
                    {total.toLocaleString("en")} EGP
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate("Checkout", {
                    brandId: brandId,
                    brandName: brandName,
                  })
                }
              >
                <LinearGradient
                  colors={["#1B2351", "#47C0D2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutGradient}
                >
                  <Text style={styles.checkoutText}>{t("checkout")}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <EmptyCart />
          </View>
          <Text style={styles.emptyText}>{t("emptyCartMsg")}</Text>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              navigation.navigate("UserTabs", { screen: "Shop" })
            }
            style={styles.shopButtonWrapper}
          >
            <LinearGradient
              colors={["#1B2351", "#47C0D2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.shopGradient}
            >
              <Text style={styles.shopButtonText}>{t("shoppingNow")}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={showClearModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconContainer}>
              <SvgXml xml={trashSvg} width={28} height={28} />
            </View>
            <Text style={styles.modalTitle}>Delete All Items?</Text>
            <Text style={styles.modalSubtitle}>
              {brandName
                ? `Remove all items from ${brandName}?`
                : "This action cannot be undone."}
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => setShowClearModal(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalDeleteBtn]}
                onPress={handleDeleteAll}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#E41818", "#7E0D0D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.modalGradient}
                >
                  <Text style={styles.deleteBtnText}>Delete All</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  itemCount: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "Inter-Regular",
  },
  deleteAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  deleteAllText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
    color: "#EF4444",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  statsBar: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: "#6B7280",
  },
  summaryValue: {
    fontFamily: "Inter-SemiBold",
    fontSize: 14,
    color: "#1B2351",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    marginTop: 4,
    paddingTop: 12,
  },
  totalLabel: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#1B2351",
  },
  totalValue: {
    fontFamily: "Inter-Bold",
    fontSize: 16,
    color: "#1B2351",
  },
  checkoutGradient: {
    marginTop: 20,
    borderRadius: 12,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconCircle: {
    backgroundColor: "#FFFFFF",
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    color: "#6B7280",
    fontFamily: "Inter-Regular",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
  shopButtonWrapper: {
    marginTop: 20,
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  shopGradient: {
    paddingHorizontal: 32,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  modalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    color: "#1B2351",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 13,
    fontFamily: "Inter-Regular",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 18,
  },
  modalButtonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  modalCancelBtn: {
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#6B7280",
  },
  modalDeleteBtn: {
    overflow: "hidden",
  },
  modalGradient: {
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteBtnText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
    color: "#fff",
  },
});
