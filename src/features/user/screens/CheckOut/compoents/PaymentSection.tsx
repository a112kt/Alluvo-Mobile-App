import { StyleSheet, Text, View, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { s } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { RadioButton } from "react-native-paper";
import { SvgXml } from "react-native-svg";
import { paymentInfoIcon } from "../../../../../assests/icons/AllIcon";
import { useTranslation } from "react-i18next";

interface PaymentSectionProps {
  paymentMethod: number;
  setPaymentMethod: (val: number) => void;
  walletPhone?: string;
  setWalletPhone?: (val: string) => void;
  disabled?: boolean;
}

const PaymentSection = ({ paymentMethod, setPaymentMethod, walletPhone, setWalletPhone, disabled }: PaymentSectionProps) => {
  const { t } = useTranslation();
  const walletSvg = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${lightColors.primary}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M17 14h.01"/></svg>`;

  const paymentOptions = [
    { value: 1, label: t("payViaCard"), icons: ["AMEX", "MC", "VISA"] },
    { value: 2, label: "Wallet", iconSvg: walletSvg },
    { value: 3, label: t("cashOnDelivery") },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: lightColors.primary }]}>{t("payment")}</Text>
      <Text style={styles.subTitle}>
        {t("secureTransactions")}
      </Text>

      <View style={styles.paymentBox}>
        {/* Credit / Debit Card */}
        <TouchableOpacity
          style={styles.optionContainer}
          activeOpacity={0.7}
          onPress={() => setPaymentMethod(1)}
        >
          <RadioButton
            value="card"
            status={paymentMethod === 1 ? "checked" : "unchecked"}
            onPress={() => setPaymentMethod(1)}
            color={lightColors.secondary}
            disabled={disabled}
          />
          <Text style={[styles.optionText, { color: lightColors.primary }]}>
            {t("payViaCard")}
          </Text>
          <View style={styles.iconsContainer}>
            <Text style={[styles.logoText, { color: lightColors.primary }]}>AMEX</Text>
            <Text style={[styles.logoText, { color: "red" }]}>MC</Text>
            <Text style={[styles.logoText, { color: "blue" }]}>VISA</Text>
          </View>
        </TouchableOpacity>

        {paymentMethod === 1 && (
          <View style={styles.infoContainer}>
            <View style={styles.infoIconWrapper}>
              <SvgXml xml={paymentInfoIcon} />
            </View>
            <Text style={styles.infoText}>
              {t("cardInfo")}
            </Text>
          </View>
        )}

        {/* Wallet */}
        <TouchableOpacity
          style={[styles.optionContainer, styles.borderTop]}
          activeOpacity={0.7}
          onPress={() => setPaymentMethod(2)}
        >
          <RadioButton
            value="wallet"
            status={paymentMethod === 2 ? "checked" : "unchecked"}
            onPress={() => setPaymentMethod(2)}
            color={lightColors.secondary}
            disabled={disabled}
          />
          <Text style={[styles.optionText, { color: lightColors.primary }]}>Wallet</Text>
          <View style={styles.iconsContainer}>
            <SvgXml xml={walletSvg} width={22} height={22} />
          </View>
        </TouchableOpacity>

        {paymentMethod === 2 && (
          <View style={styles.walletPhoneContainer}>
            <Text style={styles.walletPhoneLabel}>
              {t("walletPhoneNumber") || "Wallet Phone Number"}
            </Text>
            <TextInput
              style={styles.walletPhoneInput}
              placeholder="e.g. 01012345678"
              placeholderTextColor="#9CA3AF"
              value={walletPhone}
              onChangeText={setWalletPhone}
              keyboardType="phone-pad"
              editable={!disabled}
              selectionColor="#47C0D2"
            />
          </View>
        )}

        {/* Cash on Delivery */}
        <TouchableOpacity
          style={[styles.optionContainer, styles.borderTop]}
          activeOpacity={0.7}
          onPress={() => setPaymentMethod(3)}
        >
          <RadioButton
            value="cod"
            status={paymentMethod === 3 ? "checked" : "unchecked"}
            onPress={() => setPaymentMethod(3)}
            color={lightColors.secondary}
            disabled={disabled}
          />
          <Text style={[styles.optionText, { color: lightColors.primary }]}>{t("cashOnDelivery")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: s(16),
    marginTop: s(20),
  },
  title: {
    fontSize: s(20),
    fontWeight: "700",
    marginBottom: s(5),
  },
  subTitle: {
    fontSize: s(12),
    color: "#666",
    marginBottom: s(15),
  },
  paymentBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: s(8),
    overflow: "hidden",
    backgroundColor: "#F9FAFB",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: s(12),
    backgroundColor: "#F9FAFB",
  },
  borderTop: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
  },
  optionText: {
    fontSize: s(13),
    fontWeight: "500",
    marginStart: s(5),
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  logoText: {
    fontSize: s(10),
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#F3F4F6",
    padding: s(20),
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  infoIconWrapper: {
    marginBottom: s(15),
  },
  infoText: {
    fontSize: s(12),
    color: "#4B5563",
    textAlign: "center",
    lineHeight: s(18),
  },
  walletPhoneContainer: {
    backgroundColor: "#F3F4F6",
    padding: s(16),
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  walletPhoneLabel: {
    fontSize: s(13),
    fontWeight: "600",
    color: "#1B2351",
    marginBottom: s(8),
  },
  walletPhoneInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: s(8),
    paddingHorizontal: s(14),
    paddingVertical: s(12),
    fontSize: s(13),
    fontFamily: "Inter",
    color: "#1B2351",
  },
});
