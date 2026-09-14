import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  I18nManager,
  Platform,
} from "react-native";
import React, { useState, useMemo, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale, verticalScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { lightColors } from "../../../../../theme";
import Header from "../../components/ProfileManagement/Header";
import TrackBar from "../../components/ProfileManagement/TrackBar";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useOrderDetails, useCancelOrder, useUpdateOrderStatus, usePayWithCard } from "../../hooks/useOrders";
import {
  useOrderStatuses,
  usePaymentStatuses,
  usePaymentMethods,
  useDeliveryMethods,
  useSizes,
} from "../../hooks/useLookups";
import ProductImage from "../../../../Components/ProductImage";
import { showToast } from "../../../../services/toastService";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { ORDERS_QUERY_KEY } from "../../hooks/useOrders";
import { WebView } from "react-native-webview";

type OrderDetailsRouteParams = {
  OrderDetails: { orderId: number };
};

const TERMINAL_STATUS_NAMES = ["Cancelled", "Returned", "Refunded", "Failed"];

const buildSteps = (
  orderStatusesRaw: any,
  orderStatus: number | undefined | null,
  orderStatusName: string,
) => {
  const list = orderStatusesRaw?.data ?? [];
  const progressionStatuses = list.filter(
    (s: any) => !TERMINAL_STATUS_NAMES.includes(s.name),
  );
  if (progressionStatuses.length === 0) {
    return [{ id: 1, label: "Pending", status: "active" as const }];
  }

  const currentIdx = progressionStatuses.findIndex(
    (s: any) => s.id === orderStatus,
  );
  const isTerminal = TERMINAL_STATUS_NAMES.includes(orderStatusName);
  const atLastStep = currentIdx === progressionStatuses.length - 1;

  return progressionStatuses.map((s: any, idx: number) => {
    let status: "completed" | "active" | "pending";
    if (isTerminal) {
      status = "pending";
    } else if (idx < currentIdx) {
      status = "completed";
    } else if (idx === currentIdx && !atLastStep) {
      status = "active";
    } else if (idx <= currentIdx) {
      status = "completed";
    } else {
      status = "pending";
    }
    return { id: idx + 1, label: s.name, status };
  });
};

const getLookupName = (
  data: any,
  id: number | undefined | null,
  fallback: string,
): string => {
  if (id == null) return fallback;
  const list = data?.data ?? [];
  const item = list.find((x: any) => x.id === id);
  return item?.name ?? String(id);
};

const Divider = () => <View style={styles.divider} />;

const OrderDetailsScreen = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");
  const rtlRow: "row" | "row-reverse" = isArabic ? "row-reverse" : "row";
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<OrderDetailsRouteParams, "OrderDetails">>();
  const orderId = route.params?.orderId;

  const { data: rawResponse, isLoading } = useOrderDetails(orderId);
  const { data: orderStatusesRaw } = useOrderStatuses();
  const { data: paymentStatusesRaw } = usePaymentStatuses();
  const { data: paymentMethodsRaw } = usePaymentMethods();
  const { data: deliveryMethodsRaw } = useDeliveryMethods();
  const { data: sizesRaw } = useSizes();
  const cancelMutation = useCancelOrder();
  const updateStatusMutation = useUpdateOrderStatus();
  const payMutation = usePayWithCard();
  const queryClient = useQueryClient();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);

  const orderData = rawResponse?.data?.data || rawResponse?.data || rawResponse;

  const items = orderData?.items ?? [];
  const info = orderData?.orderInfo;
  const na = t("na");

  const orderStatusName = useMemo(
    () => getLookupName(orderStatusesRaw, orderData?.orderStatus, na),
    [orderStatusesRaw, orderData?.orderStatus, na],
  );
  const paymentStatusName = useMemo(
    () => getLookupName(paymentStatusesRaw, info?.paymentStatus, na),
    [paymentStatusesRaw, info?.paymentStatus, na],
  );
  const paymentMethodName = useMemo(
    () => getLookupName(paymentMethodsRaw, info?.paymentMethod, na),
    [paymentMethodsRaw, info?.paymentMethod, na],
  );
  const deliveryMethodName = useMemo(
    () => getLookupName(deliveryMethodsRaw, info?.deliveryMethod, na),
    [deliveryMethodsRaw, info?.deliveryMethod, na],
  );

  const steps = useMemo(
    () => buildSteps(orderStatusesRaw, orderData?.orderStatus, orderStatusName),
    [orderStatusesRaw, orderData?.orderStatus, orderStatusName],
  );

  const activeStep = useMemo(() => {
    const activeIdx = steps.findIndex((s: any) => s.status === "active");
    if (activeIdx >= 0) return activeIdx + 1;
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status === "completed") return i + 1;
    }
    return 1;
  }, [steps]);

  const needsPayment = useMemo(() => {
    const name = paymentStatusName.toLowerCase();
    return name === "pending" || name === "failed" || name === "unpaid";
  }, [paymentStatusName]);

  const handlePayNow = useCallback(async () => {
    if (isPaying || !orderId) return;
    setIsPaying(true);
    try {
      const paymentResponse = await payMutation.mutateAsync(orderId);
      const url = paymentResponse?.data?.paymentUrl;
      if (url) {
        setPaymentUrl(url);
        setShowPaymentWebView(true);
        return;
      }
      showToast(
        t("payment") || "Payment",
        t("paymentSuccess") || "Payment processed successfully.",
        undefined,
        "success"
      );
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, "details", orderId] });
    } catch (err: any) {
      const apiMessage = err?.friendlyMessage;
      showToast(
        t("paymentFailed") || "Payment Failed",
        apiMessage || "Payment could not be processed. Please try again.",
        undefined,
        "error"
      );
    } finally {
      setIsPaying(false);
    }
  }, [isPaying, orderId, payMutation, t, queryClient]);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentWebView(false);
    setPaymentUrl(null);
    setIsPaying(false);
    showToast(
      t("payment") || "Payment",
      t("paymentSuccess") || "Payment was successful.",
      undefined,
      "success"
    );
    if (orderId) {
      queryClient.invalidateQueries({ queryKey: [...ORDERS_QUERY_KEY, "details", orderId] });
    }
  }, [orderId, queryClient, t]);

  const handlePaymentFailure = useCallback(() => {
    setShowPaymentWebView(false);
    setPaymentUrl(null);
    setIsPaying(false);
    showToast(
      t("paymentFailed") || "Payment Failed",
      t("paymentFailedMsg") || "Payment was not completed. You can try again.",
      undefined,
      "error"
    );
  }, [t]);

  const handleCancel = async () => {
    setCancelModalVisible(false);
    setIsUpdating(true);
    try {
      await cancelMutation.mutateAsync(orderId);
      showToast(t("orderCancelled"), t("orderCancelledMsg"), undefined, "success");
      navigation.goBack();
    } catch (err: any) {
      showToast(t("orderError"), err?.message || t("orderCancelError"), undefined, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const nextStatus = orderData?.orderStatus === 0 ? "confirmed" : "processing";
      await updateStatusMutation.mutateAsync({ id: orderId, status: nextStatus });
      showToast(t("orderUpdated"), t("orderUpdatedMsg", { status: nextStatus }), undefined, "success");
    } catch (err: any) {
      showToast(t("orderError"), err?.message || t("orderUpdateError"), undefined, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !orderData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header text={t("orderDetails")} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={lightColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header text={t("orderHeader", { id: orderData.id })} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ─── Stepper ─── */}
        <View style={styles.stepperWrapper}>
          <TrackBar steps={steps} activeStep={activeStep} />
        </View>

        {/* ─── Order Info Card ─── */}
        <View style={styles.card}>
          <View style={[styles.cardHeaderRow, { flexDirection: "row" }]}>
            <Text style={styles.sectionTitle}>{t("orderSummary")}</Text>
            <Text style={styles.dateText}>
              {orderData.createdAt
                ? new Date(orderData.createdAt).toLocaleDateString(
                    isArabic ? "ar-EG" : "en-US",
                    { month: "short", day: "numeric", year: "numeric" },
                  )
                : ""}
            </Text>
          </View>

          <Divider />

          {orderData.trackingNumber && (
            <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
              <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
                <Ionicons name="scan-outline" size={14} color={lightColors.subtitle} />
                <Text style={styles.label}>{t("tracking")}</Text>
              </View>
              <Text style={styles.value}>{orderData.trackingNumber}</Text>
            </View>
          )}

          <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
            <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
              <Ionicons name="flag-outline" size={14} color={lightColors.subtitle} />
              <Text style={styles.label}>{t("status")}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{orderStatusName}</Text>
            </View>
          </View>

          <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
            <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
              <Ionicons name="card-outline" size={14} color={lightColors.subtitle} />
              <Text style={styles.label}>{t("payment")}</Text>
            </View>
            <Text style={styles.value}>{paymentStatusName}</Text>
          </View>

          <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
            <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
              <Ionicons name="wallet-outline" size={14} color={lightColors.subtitle} />
              <Text style={styles.label}>{t("method")}</Text>
            </View>
            <Text style={styles.value}>{paymentMethodName}</Text>
          </View>

          <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
            <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
              <Ionicons name="car-outline" size={14} color={lightColors.subtitle} />
              <Text style={styles.label}>{t("delivery")}</Text>
            </View>
            <Text style={styles.value}>{deliveryMethodName}</Text>
          </View>

          {info?.discount != null && info.discount > 0 && (
            <View style={[styles.infoRow, { flexDirection: rtlRow }]}>
              <View style={[styles.infoLabelRow, { flexDirection: rtlRow }]}>
                <Ionicons name="pricetag-outline" size={14} color={lightColors.subtitle} />
                <Text style={styles.label}>{t("discount")}</Text>
              </View>
              <Text style={styles.discountValue}>-{t("egp")} {info.discount}</Text>
            </View>
          )}

          <Divider />

          <View style={[styles.totalRow, { flexDirection: rtlRow }]}>
            <Text style={styles.totalLabel}>{t("total")}</Text>
            <Text style={styles.totalValue}>
              {info?.totalAmount != null ? `${t("egp")} ${info.totalAmount.toFixed(2)}` : na}
            </Text>
          </View>
        </View>

        {/* ─── Shipping Details Card ─── */}
        <View style={styles.card}>
          <View style={[styles.cardHeaderRow, { flexDirection: rtlRow }]}>
            <Ionicons name="location-outline" size={16} color={lightColors.primary} />
            <Text style={[styles.sectionTitle, { marginHorizontal: scale(6) }]}>{t("shippingAddress")}</Text>
          </View>

          <Divider />

          <View style={styles.shippingBlock}>
            <Text style={styles.shippingName}>{info?.shippingName || na}</Text>
            <Text style={styles.shippingAddressLine}>
              {[info?.shippingStreet, info?.shippingCity].filter(Boolean).join(", ") || na}
            </Text>
            <Text style={styles.shippingAddressLine}>
              {[info?.shippingCountry, info?.shippingPostalCode].filter(Boolean).join(" ") || ""}
            </Text>
          </View>

          <View style={[styles.shippingContactRow, { flexDirection: rtlRow }]}>
            <Ionicons name="call-outline" size={14} color={lightColors.subtitle} />
            <Text style={styles.shippingPhone}>{info?.shippingPhoneNumber || na}</Text>
          </View>
        </View>

        {/* ─── Items Section ─── */}
        <View style={[styles.itemsHeader, { flexDirection: rtlRow }]}>
          <Ionicons name="cube-outline" size={16} color={lightColors.primary} />
          <Text style={[styles.sectionTitle, { marginHorizontal: scale(6) }]}>
            {t("orderItems", { count: items.length })}
          </Text>
        </View>

        {items.map((item: any, idx: number) => {
          const sizeName = getLookupName(sizesRaw, item.size, na);
          return (
            <View key={idx} style={[styles.itemCard, { flexDirection: rtlRow }]}>
              <View style={styles.itemImageBox}>
                <ProductImage item={item} style={styles.itemImage} />
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name || `Item ${idx + 1}`}</Text>

                <View style={styles.itemAttrs}>
                  {item.color ? (
                    <View style={styles.attrChip}>
                      <Text style={styles.attrChipText}>{item.color}</Text>
                    </View>
                  ) : null}
                  {sizeName !== na ? (
                    <View style={styles.attrChip}>
                      <Text style={styles.attrChipText}>{sizeName}</Text>
                    </View>
                  ) : null}
                </View>

                {item.description ? (
                  <Text style={styles.itemDesc} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}

                <Divider />

                <View style={[styles.itemBottomRow, { flexDirection: rtlRow }]}>
                  <View style={[styles.itemQtyRow, { flexDirection: rtlRow }]}>
                    <Text style={styles.itemQtyLabel}>{t("qty")}</Text>
                    <Text style={styles.itemQtyValue}>{item.quantity ?? 1}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {item.price != null ? `${t("egp")} ${item.price}` : ""}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}

        {/* ─── Action Buttons ─── */}
        {needsPayment && (
          <View style={styles.actionsSection}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handlePayNow}
              disabled={isPaying}
            >
              <LinearGradient
                colors={["#1B2351", "#47C0D2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.payNowBtn}
              >
                {isPaying ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="card-outline" size={18} color="#fff" style={{ marginEnd: 8 }} />
                    <Text style={styles.payNowBtnText}>{t("payNow") || "Pay Now"}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {orderStatusName !== "Cancelled" &&
          orderStatusName !== "Completed" &&
          orderStatusName !== "Delivered" && (
            <View style={styles.actionsSection}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleUpdateStatus}
                disabled={isUpdating}
              >
                <LinearGradient
                  colors={["#47C0D2", "#1B2351"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryBtn}
                >
                  <Ionicons name="refresh-outline" size={18} color="#fff" style={{ marginEnd: 8 }} />
                  <Text style={styles.primaryBtnText}>
                    {isUpdating ? t("updating") : t("updateStatus")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelModalVisible(true)}
                style={styles.cancelBtn}
              >
                <Ionicons name="close-outline" size={18} color="#EF4444" style={{ marginEnd: 6 }} />
                <Text style={styles.cancelBtnText}>{t("cancelOrder")}</Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>

      {/* ─── Cancel Confirmation Modal ─── */}
      <Modal visible={cancelModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="alert-circle-outline" size={36} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>{t("cancelOrderTitle")}</Text>
            <Text style={styles.modalMessage}>
              {t("cancelOrderMsg")}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setCancelModalVisible(false)}
                style={styles.modalSecondaryBtn}
              >
                <Text style={styles.modalSecondaryText}>{t("keepOrder")}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCancel}
                style={styles.modalDangerBtn}
              >
                <Text style={styles.modalDangerText}>{t("confirmCancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Payment WebView Modal ─── */}
      {showPaymentWebView && (
        <View style={styles.webViewOverlay}>
          <View style={styles.webViewContainer}>
            <View style={styles.webViewHeader}>
              <Text style={styles.webViewTitle}>Secure Payment</Text>
              <TouchableOpacity onPress={handlePaymentFailure} style={styles.webViewClose}>
                <Text style={styles.webViewCloseText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {paymentUrl && (
              <WebView
                source={{ uri: paymentUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={(navState) => {
                  const { url } = navState;
                  if (url.includes("success") || url.includes("completed")) {
                    handlePaymentSuccess();
                  } else if (url.includes("cancel") || url.includes("failed")) {
                    handlePaymentFailure();
                  }
                }}
                javaScriptEnabled
                domStorageEnabled
                startInLoadingState
                renderLoading={() => (
                  <View style={styles.webViewLoader}>
                    <ActivityIndicator size="large" color="#47C0D2" />
                  </View>
                )}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
    paddingHorizontal: scale(15),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  stepperWrapper: {
    marginTop: verticalScale(4),
    marginHorizontal: -scale(15),
  },

  // ─── Card ───
  card: {
    backgroundColor: "#fff",
    borderRadius: scale(14),
    padding: scale(16),
    marginBottom: verticalScale(10),
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: scale(15),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
  },
  dateText: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F2F6",
    marginVertical: verticalScale(10),
  },

  // ─── Info Rows ───
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  infoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
  },
  label: {
    fontSize: scale(13),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
  },
  value: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
    color: lightColors.primary,
    textAlign: "left",
  },
  statusBadge: {
    backgroundColor: "rgba(71, 192, 210, 0.12)",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(20),
  },
  statusText: {
    fontSize: scale(12),
    fontFamily: "Poppins-SemiBold",
    color: "#47C0D2",
  },
  discountValue: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
    color: "#EF4444",
    textAlign: "left",
  },

  // ─── Total ───
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: scale(15),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
  },
  totalValue: {
    fontSize: scale(18),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
  },

  // ─── Shipping ───
  shippingBlock: {
    marginBottom: verticalScale(8),
  },
  shippingName: {
    fontSize: scale(14),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
    marginBottom: verticalScale(4),
  },
  shippingAddressLine: {
    fontSize: scale(13),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    lineHeight: scale(18),
  },
  shippingContactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(4),
  },
  shippingPhone: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
    color: lightColors.primary,
  },

  // ─── Items Header ───
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
    marginTop: verticalScale(4),
  },

  // ─── Item Card ───
  itemCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: scale(14),
    padding: scale(12),
    marginBottom: verticalScale(10),
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImageBox: {
    width: scale(80),
    height: scale(100),
    borderRadius: scale(10),
    overflow: "hidden",
    marginEnd: scale(12),
    backgroundColor: lightColors.bgLight,
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: scale(14),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
  },
  itemAttrs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: scale(6),
    marginTop: verticalScale(4),
  },
  attrChip: {
    backgroundColor: "#F0F2F6",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
  },
  attrChipText: {
    fontSize: scale(11),
    fontFamily: "Poppins-Medium",
    color: lightColors.subtitle,
  },
  itemDesc: {
    fontSize: scale(11),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    marginTop: verticalScale(4),
    lineHeight: scale(15),
  },
  itemBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemQtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  itemQtyLabel: {
    fontSize: scale(12),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
  },
  itemQtyValue: {
    fontSize: scale(13),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
  },
  itemPrice: {
    fontSize: scale(14),
    fontFamily: "Poppins-Bold",
    color: lightColors.primary,
  },

  // ─── Action Buttons ───
  actionsSection: {
    marginTop: verticalScale(16),
    gap: verticalScale(12),
  },
  primaryBtn: {
    height: verticalScale(48),
    borderRadius: scale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: scale(15),
    fontFamily: "Poppins-SemiBold",
  },
  cancelBtn: {
    height: verticalScale(46),
    borderRadius: scale(12),
    borderWidth: 1.5,
    borderColor: "#FDE8E8",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#EF4444",
    fontSize: scale(14),
    fontFamily: "Poppins-Medium",
  },

  // ─── Modal ───
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: scale(24),
  },
  modalCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: scale(20),
    padding: scale(24),
    alignItems: "center",
  },
  modalIconWrap: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(12),
  },
  modalTitle: {
    fontSize: scale(18),
    fontFamily: "Poppins-SemiBold",
    color: lightColors.primary,
    marginBottom: verticalScale(6),
  },
  modalMessage: {
    fontSize: scale(13),
    fontFamily: "Poppins-Regular",
    color: lightColors.subtitle,
    textAlign: "center",
    lineHeight: scale(19),
    marginBottom: verticalScale(22),
  },
  modalActions: {
    flexDirection: "row",
    gap: scale(12),
    width: "100%",
  },
  modalSecondaryBtn: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: scale(12),
    backgroundColor: lightColors.bgLight,
    justifyContent: "center",
    alignItems: "center",
  },
  modalSecondaryText: {
    fontSize: scale(13),
    fontFamily: "Poppins-Medium",
    color: lightColors.primary,
  },
  modalDangerBtn: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: scale(12),
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDangerText: {
    fontSize: scale(13),
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
  },

  // ─── Pay Now Button ───
  payNowBtn: {
    height: verticalScale(50),
    borderRadius: scale(12),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#1B2351",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  payNowBtnText: {
    color: "#fff",
    fontSize: scale(16),
    fontFamily: "Poppins-Bold",
  },

  // ─── Payment WebView ───
  webViewOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
  },
  webViewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  webViewTitle: {
    fontSize: scale(16),
    fontFamily: "Poppins-SemiBold",
    color: "#1B2351",
  },
  webViewClose: {
    padding: scale(4),
  },
  webViewCloseText: {
    fontSize: scale(14),
    fontFamily: "Poppins-Medium",
    color: "#EF4444",
  },
  webViewLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});
