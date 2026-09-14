import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import SafeAreaWrapper from "../../../../Components/SafeAreaView";
import Header from "./compoents/Header";
import DeliverySection from "./compoents/DeliverySection";
import PaymentSection from "./compoents/PaymentSection";
import OrderSummarySection from "./compoents/OrderSummarySection";
import SavedAddressCard from "./compoents/SavedAddressCard";
import { s, verticalScale } from "react-native-size-matters";
import GradientButton from "../../../../Components/buttons/GradientButton";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import {
  useCreateOrder,
  useOrderSummary,
  usePayWithCard,
  usePayWithWallet,
} from "../../hooks/useOrders";
import { useCart } from "../../hooks/useCart";
import { showToast } from "../../../../services/toastService";
import {
  useShippingAddress,
  useShippingAddressList,
} from "../../hooks/UserProfile/useProfile";
import { LinearGradient } from "expo-linear-gradient";
import { lightColors } from "../../../../../theme";
import { WebView } from "react-native-webview";
import { UserStackParamList } from "../../../../Navigation/types";
import { validateCheckoutFields } from "./validation";
import { OrderSummaryData } from "../../services/order";
import PaymentResultModal from "./compoents/PaymentResultModal";

const PAYMENT_CARD = 1;
const PAYMENT_WALLET = 2;
const PAYMENT_COD = 3;

type CheckoutScreenRouteProp = RouteProp<UserStackParamList, "Checkout">;

const Checkout = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<CheckoutScreenRouteProp>();
  const brandId = route.params?.brandId;
  const brandName = route.params?.brandName;
  const { t } = useTranslation();

  const { data: cartData } = useCart();
  const orderSummaryMutation = useOrderSummary();
  const createOrderMutation = useCreateOrder();
  const payMutation = usePayWithCard();
  const payWalletMutation = usePayWithWallet();
  const { data: defaultAddress } = useShippingAddress();
  const { data: savedAddresses } = useShippingAddressList();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [showPaymentWebView, setShowPaymentWebView] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [paymentResultStatus, setPaymentResultStatus] = useState<
    "success" | "error" | null
  >(null);
  const [showPaymentResult, setShowPaymentResult] = useState(false);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [country, setCountry] = useState("Egypt");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [governorate, setGovernorate] = useState("Cairo");
  const [postcode, setPostcode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [building, setBuilding] = useState("");
  const [floor, setFloor] = useState("");
  const [apartment, setApartment] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_COD);
  const [walletPhone, setWalletPhone] = useState("");
  const [discountCode, setDiscountCode] = useState("");

  const [serverSummary, setServerSummary] = useState<OrderSummaryData | null>(
    null
  );

  const brands = cartData?.data?.brands ?? [];
  const brandGroup = brandId
    ? brands.find((b: any) => b.brandId === brandId)
    : undefined;
  const cartItems = brandGroup?.items ?? [];

  const SHIPPING_COST = 60;
  const subtotal = cartItems.reduce(
    (sum: number, item: any) => sum + item.productPrice * item.quantity,
    0
  );
  const total = subtotal + (cartItems.length > 0 ? SHIPPING_COST : 0);

  useEffect(() => {
    if (!defaultAddress) return;
    if (selectedAddressId !== null || useNewAddress) return;

    setSelectedAddressId(defaultAddress.id ?? null);
    setFirstName(defaultAddress.name || "");
    setLastName(defaultAddress.lastName || "");
    setPhoneNumber(defaultAddress.phoneNumber || "");
    setCountry(defaultAddress.country || "Egypt");
    setCity(defaultAddress.city || "");
    setBuilding(defaultAddress.building || "");
    setFloor(defaultAddress.floor || "");
    setApartment(defaultAddress.apartment || "");
    setPostcode(defaultAddress.postcode || "");
    const fullAddress = [
      defaultAddress.street,
      defaultAddress.building,
      defaultAddress.floor ? `Floor ${defaultAddress.floor}` : "",
      defaultAddress.apartment ? `Apt ${defaultAddress.apartment}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    setAddress(fullAddress);
  }, [defaultAddress]);

  useEffect(() => {
    if (orderSummaryMutation.isSuccess && orderSummaryMutation.data) {
      const res = orderSummaryMutation.data;
      const summaryData = res?.data ?? res;
      if (summaryData?.items && summaryData?.summary) {
        setServerSummary(summaryData);
      }
      setIsReviewMode(true);
    }
  }, [orderSummaryMutation.isSuccess, orderSummaryMutation.data]);

  const buildPayload = useCallback(() => {
    const hasSelectedSavedAddress = selectedAddressId && !useNewAddress;

    const base = {
      paymentMethod,
      deliveryMethod: 0,
      discountCode: discountCode.trim() === "" ? null : discountCode.trim(),
      brandId: brandId ?? null,
    };

    if (hasSelectedSavedAddress) {
      return {
        ...base,
        addressId: selectedAddressId,
      };
    }

    return {
      ...base,
      address: {
        name: firstName.trim(),
        shippingLastName: lastName.trim(),
        postalCode: postcode.trim() || "N/A",
        country: country.trim() || "N/A",
        street: address.trim() || "N/A",
        city: city.trim() || "N/A",
        phoneNumber: phoneNumber.trim(),
        shippingBuilding: building.trim() || "N/A",
        shippingFloor: floor.trim() || "N/A",
        shippingApartment: apartment.trim() || "N/A",
        saveAddress: saveInfo,
        setAsDefault: false,
      },
    };
  }, [
    selectedAddressId,
    useNewAddress,
    paymentMethod,
    discountCode,
    brandId,
    firstName,
    lastName,
    postcode,
    country,
    address,
    city,
    phoneNumber,
    building,
    floor,
    apartment,
    saveInfo,
  ]);

  const handleSelectAddress = (addressId: number) => {
    if (isReviewMode) return;
    setSelectedAddressId(addressId);
    setUseNewAddress(false);

    const addr = savedAddresses?.find((a: any) => a.id === addressId);
    if (addr) {
      setFirstName(addr.name || "");
      setLastName(addr.lastName || "");
      setPhoneNumber(addr.phoneNumber || "");
      setCountry(addr.country || "Egypt");
      setCity(addr.city || "");
      setBuilding(addr.building || "");
      setFloor(addr.floor || "");
      setApartment(addr.apartment || "");
      setPostcode(addr.postcode || "");
      const fullAddress = [
        addr.street,
        addr.building,
        addr.floor ? `Floor ${addr.floor}` : "",
        addr.apartment ? `Apt ${addr.apartment}` : "",
      ]
        .filter(Boolean)
        .join(", ");
      setAddress(fullAddress);
    }
  };

  const handleAddNewAddress = () => {
    if (isReviewMode) return;
    setSelectedAddressId(null);
    setUseNewAddress(true);
    setFirstName("");
    setLastName("");
    setPhoneNumber("");
    setCountry("Egypt");
    setCity("");
    setBuilding("");
    setFloor("");
    setApartment("");
    setPostcode("");
    setAddress("");
  };

  const handleContinueToReview = async () => {
    if (isProcessing) return;

    if (useNewAddress || !selectedAddressId) {
      const validation = validateCheckoutFields({
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        country,
      });

      if (!validation.isValid) {
        showToast(
          "Checkout",
          validation.errors[0],
          undefined,
          "warning"
        );
        return;
      }
    }

    if (paymentMethod === PAYMENT_WALLET && !walletPhone.trim()) {
      showToast(
        "Checkout",
        "Please enter your wallet phone number.",
        undefined,
        "warning"
      );
      return;
    }

    setIsProcessing(true);
    try {
      const payload = buildPayload();
      await orderSummaryMutation.mutateAsync(payload);
    } catch (err: any) {
      const apiMessage = err?.friendlyMessage;
      showToast(
        "Checkout",
        apiMessage || "Something went wrong. Please try again.",
        undefined,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReapplyDiscount = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const payload = buildPayload();
      await orderSummaryMutation.mutateAsync(payload);
    } catch (err: any) {
      const apiMessage = err?.friendlyMessage;
      showToast(
        "Checkout",
        apiMessage || "Failed to apply discount code.",
        undefined,
        "error"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const payload = buildPayload();
      const orderResponse =
        await createOrderMutation.mutateAsync(payload);
      const orderId =
        orderResponse?.data?.id ||
        orderResponse?.data?.orderId ||
        orderResponse?.id ||
        null;

      if (!orderId) {
        showToast(
          "Checkout",
          "Order was created but we could not retrieve the order ID.",
          undefined,
          "error"
        );
        return;
      }

      setCurrentOrderId(orderId);

      if (paymentMethod === PAYMENT_CARD) {
        const paymentResponse = await payMutation.mutateAsync(orderId);
        const url = paymentResponse?.data?.paymentUrl;
        if (url) {
          setPaymentUrl(url);
          setShowPaymentWebView(true);
          return;
        }
        setPaymentResultStatus("success");
        setShowPaymentResult(true);
        return;
      }

      if (paymentMethod === PAYMENT_WALLET) {
        const paymentResponse = await payWalletMutation.mutateAsync({
          orderId,
          phone: walletPhone,
        });
        const url = paymentResponse?.data?.paymentUrl;
        if (url) {
          setPaymentUrl(url);
          setShowPaymentWebView(true);
          return;
        }
        setPaymentResultStatus("success");
        setShowPaymentResult(true);
        return;
      }

      setPaymentResultStatus("success");
      setShowPaymentResult(true);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      const apiMessage = err?.friendlyMessage;
      let errorText = "Something went wrong. Please try again.";
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        errorText = apiErrors
          .map((e: any) => e.en || e.field || e)
          .join("\n");
      } else if (apiMessage && typeof apiMessage === "string") {
        errorText = apiMessage;
      }
      showToast("Checkout", errorText, undefined, "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentWebView(false);
    setPaymentUrl(null);
    setPaymentResultStatus("success");
    setShowPaymentResult(true);
  };

  const handlePaymentFailure = () => {
    setShowPaymentWebView(false);
    setPaymentUrl(null);
    setPaymentResultStatus("error");
    setShowPaymentResult(true);
  };

  const handleTrackOrder = () => {
    setShowPaymentResult(false);
    setPaymentResultStatus(null);
    if (currentOrderId) {
      navigation.navigate("OrderDetails", { orderId: currentOrderId });
    }
  };

  const handleTryAgain = () => {
    setShowPaymentResult(false);
    setPaymentResultStatus(null);
  };

  const handleChangePayment = () => {
    setShowPaymentResult(false);
    setPaymentResultStatus(null);
    setIsReviewMode(false);
  };

  const isCardOrWallet =
    paymentMethod === PAYMENT_CARD || paymentMethod === PAYMENT_WALLET;
  const isLoading =
    isProcessing ||
    orderSummaryMutation.isPending ||
    createOrderMutation.isPending ||
    payMutation.isPending ||
    payWalletMutation.isPending;

  return (
    <SafeAreaWrapper>
      <Header />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {brandName ? (
            <View style={styles.brandBanner}>
              <Text style={styles.brandBannerText}>
                Checking out from{" "}
                <Text style={styles.brandBannerName}>{brandName}</Text>
              </Text>
            </View>
          ) : null}

          <View style={styles.addressSection}>
            <Text
              style={[styles.sectionTitle, { color: lightColors.primary }]}
            >
              {t("deliverTo") || "Deliver to"}
            </Text>

            {savedAddresses && savedAddresses.length > 0 && (
              <View style={styles.addressCardsRow}>
                {savedAddresses.map((addr: any) => (
                  <View key={addr.id} style={styles.addressCardWrapper}>
                    <SavedAddressCard
                      address={addr}
                      isSelected={selectedAddressId === addr.id && !useNewAddress}
                      onSelect={() => handleSelectAddress(addr.id)}
                      disabled={isReviewMode}
                    />
                  </View>
                ))}
                {!useNewAddress && (
                  <TouchableOpacity
                    style={[
                      styles.addNewCard,
                      isReviewMode && styles.addNewCardDisabled,
                    ]}
                    activeOpacity={isReviewMode ? 1 : 0.7}
                    onPress={handleAddNewAddress}
                    disabled={isReviewMode}
                  >
                    <Text style={styles.addNewCardText}>+ Add New</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <DeliverySection
            country={country}
            setCountry={setCountry}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            address={address}
            setAddress={setAddress}
            city={city}
            setCity={setCity}
            governorate={governorate}
            setGovernorate={setGovernorate}
            postcode={postcode}
            setPostcode={setPostcode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            saveInfo={saveInfo}
            setSaveInfo={setSaveInfo}
            building={building}
            setBuilding={setBuilding}
            floor={floor}
            setFloor={setFloor}
            apartment={apartment}
            setApartment={setApartment}
          />
          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            walletPhone={walletPhone}
            setWalletPhone={setWalletPhone}
            disabled={isReviewMode}
          />
          <OrderSummarySection
            cartItems={cartItems}
            subtotal={subtotal}
            shipping={cartItems.length > 0 ? SHIPPING_COST : 0}
            total={total}
            serverItems={serverSummary?.items}
            serverSubTotal={serverSummary?.summary?.subTotal}
            serverDiscountAmount={serverSummary?.summary?.discountAmount}
            serverShippingPrice={serverSummary?.summary?.shippingPrice}
            serverTotal={serverSummary?.summary?.total}
            serverPaymentMethod={serverSummary?.summary?.paymentMethod}
            discountCode={discountCode}
            onDiscountCodeChange={setDiscountCode}
            onApplyDiscount={handleReapplyDiscount}
            isDiscountLoading={orderSummaryMutation.isPending}
          />
          <View style={{ height: verticalScale(100) }} />
        </ScrollView>

        <View style={styles.bottomBar}>
          {!isReviewMode ? (
            <GradientButton
              text={t("continueToReview") || "Continue to Review"}
              onPress={handleContinueToReview}
              disabled={isLoading}
            />
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handlePlaceOrder}
                disabled={isLoading}
                style={styles.payBtnWrapper}
              >
                <LinearGradient
                  colors={["#1B2351", "#47C0D2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.payBtn}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.payBtnText}>
                      {isCardOrWallet ? "PAY NOW" : "CONFIRM ORDER"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsReviewMode(false);
                  setServerSummary(null);
                }}
                disabled={isLoading}
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>Edit Order</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>

      <PaymentResultModal
        visible={showPaymentResult}
        status={paymentResultStatus}
        onTrackOrder={handleTrackOrder}
        onTryAgain={handleTryAgain}
        onChangePayment={handleChangePayment}
      />

      <WebViewPaymentModal
        visible={showPaymentWebView}
        paymentUrl={paymentUrl}
        onSuccess={handlePaymentSuccess}
        onFailure={handlePaymentFailure}
      />
    </SafeAreaWrapper>
  );
};

function WebViewPaymentModal({
  visible,
  paymentUrl,
  onSuccess,
  onFailure,
}: {
  visible: boolean;
  paymentUrl: string | null;
  onSuccess: () => void;
  onFailure: () => void;
}) {
  return (
    <View style={{ display: visible ? "flex" : "none", position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}>
      {visible && (
        <View style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Secure Payment</Text>
            <TouchableOpacity onPress={onFailure} style={styles.webViewClose}>
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
                  onSuccess();
                } else if (url.includes("cancel") || url.includes("failed")) {
                  onFailure();
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
      )}
    </View>
  );
}

export default Checkout;

const styles = StyleSheet.create({
  brandBanner: {
    marginHorizontal: s(16),
    marginTop: s(12),
    backgroundColor: "#E8EDFF",
    borderRadius: 10,
    paddingVertical: s(10),
    paddingHorizontal: s(14),
  },
  brandBannerText: {
    fontFamily: "Inter-Regular",
    fontSize: s(13),
    color: "#6B7280",
  },
  brandBannerName: {
    fontFamily: "Inter-Bold",
    color: "#1B2351",
  },
  addressSection: {
    marginHorizontal: s(16),
    marginTop: s(16),
  },
  sectionTitle: {
    fontSize: s(18),
    fontWeight: "700",
    fontFamily: "Inter-Bold",
    marginBottom: s(12),
  },
  addressCardsRow: {
    flexDirection: "row",
    gap: s(10),
    marginBottom: s(8),
  },
  addressCardWrapper: {
    flexShrink: 0,
  },
  addNewCard: {
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: lightColors.secondary,
    borderRadius: s(12),
    padding: s(14),
    minWidth: s(100),
    justifyContent: "center",
    alignItems: "center",
  },
  addNewCardDisabled: {
    opacity: 0.5,
  },
  addNewCardText: {
    fontSize: s(13),
    fontWeight: "600",
    color: lightColors.secondary,
    fontFamily: "Inter-SemiBold",
  },
  bottomBar: {
    padding: s(16),
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  payBtnWrapper: {
    borderRadius: s(12),
    height: s(48),
    overflow: "hidden",
    marginBottom: s(8),
  },
  payBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  payBtnText: {
    color: "#fff",
    fontSize: s(15),
    fontWeight: "700",
  },
  editBtn: {
    alignItems: "center",
    paddingVertical: s(8),
  },
  editBtnText: {
    fontSize: s(13),
    color: "#47C0D2",
    fontWeight: "600",
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
    paddingHorizontal: s(16),
    paddingVertical: s(12),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  webViewTitle: {
    fontSize: s(16),
    fontWeight: "700",
    color: "#1B2351",
  },
  webViewClose: {
    padding: s(4),
  },
  webViewCloseText: {
    fontSize: s(14),
    color: "#EF4444",
    fontWeight: "600",
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
