import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";

interface EmptyStateProps {
  onAddPress: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddPress }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  const illustration = `<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="56" fill="${lightColors.secondary}08" stroke="${lightColors.secondary}20" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="40" fill="${lightColors.secondary}06"/>
    <rect x="30" y="42" width="60" height="44" rx="8" fill="#fff" stroke="${lightColors.secondary}25" stroke-width="1.5"/>
    <rect x="36" y="48" width="48" height="10" rx="4" fill="${lightColors.secondary}12"/>
    <rect x="36" y="62" width="36" height="4" rx="2" fill="${lightColors.secondary}10"/>
    <rect x="36" y="70" width="28" height="4" rx="2" fill="${lightColors.secondary}10"/>
    <rect x="36" y="78" width="42" height="4" rx="2" fill="${lightColors.secondary}10"/>
    <circle cx="82" cy="78" r="14" fill="${lightColors.secondary}" opacity="0.12"/>
    <path d="M76 78H88M82 72V84" stroke="${lightColors.secondary}" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;

  return (
    <View style={styles.container}>
      <SvgXml xml={illustration} width={120} height={120} />
      <Text style={styles.title}>
        {isArabic ? "لا توجد عناوين بعد" : "No addresses yet"}
      </Text>
      <Text style={styles.subtitle}>
        {isArabic
          ? "أضف عنوان شحن جديد لبدء التسوق"
          : "Add a shipping address to start shopping"}
      </Text>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={onAddPress}
        activeOpacity={0.85}
      >
        <Text style={styles.addBtnText}>
          {isArabic ? "إضافة عنوان جديد" : "Add New Address"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(60),
  },
  title: {
    fontSize: scale(18),
    fontWeight: "600",
    color: lightColors.primary,
    marginTop: verticalScale(20),
    fontFamily: "Inter-SemiBold",
  },
  subtitle: {
    fontSize: scale(13),
    color: lightColors.subtitle,
    marginTop: verticalScale(8),
    textAlign: "center",
    fontFamily: "Inter",
    lineHeight: verticalScale(20),
  },
  addBtn: {
    marginTop: verticalScale(24),
    backgroundColor: lightColors.primary,
    paddingHorizontal: scale(28),
    paddingVertical: verticalScale(13),
    borderRadius: 12,
    shadowColor: lightColors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: "#fff",
    fontSize: scale(15),
    fontWeight: "600",
    fontFamily: "Inter-SemiBold",
  },
});
