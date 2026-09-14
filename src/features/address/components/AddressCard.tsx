import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import { Address } from "../types";
import { SvgXml } from "react-native-svg";
import { useTranslation } from "react-i18next";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language.startsWith("ar");

  if (!address) return null;

  const editSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 2.00001C11.5083 1.82501 11.7155 1.68598 11.9433 1.59076C12.1711 1.49554 12.4153 1.44629 12.662 1.44629C12.9086 1.44629 13.1528 1.49554 13.3806 1.59076C13.6085 1.68598 13.8156 1.82501 13.9907 2.00001C14.1657 2.17501 14.3047 2.38219 14.3999 2.61001C14.4951 2.83783 14.5444 3.08201 14.5444 3.32868C14.5444 3.57534 14.4951 3.81952 14.3999 4.04734C14.3047 4.27516 14.1657 4.48234 13.9907 4.65734L5.32399 13.324L2.66666 14L3.34266 11.3427L11.3333 2.00001Z" stroke="${lightColors.iconGray}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const deleteSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 4H3.33333H14" stroke="${lightColors.textDanger}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.33333 4V2.66667C5.33333 2.31304 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31304 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31304 10.6667 2.66667V4M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31304 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4H12.6667Z" stroke="${lightColors.textDanger}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M6.66667 7.33333V11.3333" stroke="${lightColors.textDanger}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.33333 7.33333V11.3333" stroke="${lightColors.textDanger}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  const locationSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="${lightColors.hint}"/>
  </svg>`;

  const phoneSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 16.92V19.92C22 20.4504 21.7893 20.9591 21.4142 21.3342C21.0391 21.7093 20.5304 21.92 20 21.92C16.7501 21.4964 13.6539 20.2001 11.06 18.18C8.62401 16.3735 6.60649 14.0787 5.11 11.45C3.07 8.81999 1.79497 5.69999 1.39 2.38999C1.38782 2.18844 1.42997 1.98911 1.51373 1.80609C1.59749 1.62308 1.72064 1.46065 1.87448 1.33017C2.02831 1.19969 2.20901 1.10449 2.4039 1.05123C2.59878 0.997975 2.8034 0.988064 3.002 0.999986H6.002C6.59584 0.957949 7.17363 1.18203 7.58076 1.61102C7.98789 2.04 8.18388 2.63052 8.117 3.22499C7.95527 4.64544 7.61828 6.0397 7.112 7.37299C6.94319 7.82433 6.92236 8.31737 7.0525 8.78057C7.18264 9.24378 7.4572 9.65315 7.836 9.94699L13.384 15.495C13.6959 15.8139 14.1115 16.0074 14.5574 16.0406C15.0033 16.0738 15.4443 15.9444 15.8 15.675C17.0244 15.1936 18.3278 14.9379 19.647 14.92C20.2415 14.8565 20.8308 15.0524 21.2598 15.4575C21.6888 15.8626 21.915 16.4383 21.876 17.034L22 16.92Z" fill="${lightColors.hint}"/>
  </svg>`;

  const fullName = [address.name, address.lastName].filter(Boolean).join(" ");

  const addressLines = [
    [address.country, address.city].filter(Boolean).join(", "),
    address.street,
    [address.building && `${isArabic ? "مبنى" : "Bldg"} ${address.building}`, address.floor && `${isArabic ? "دور" : "Floor"} ${address.floor}`, address.apartment && `${isArabic ? "شقة" : "Apt"} ${address.apartment}`]
      .filter(Boolean)
      .join(" | "),
  ].filter(Boolean);

  const initial = (address.name || "?").charAt(0).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.topRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <View style={styles.nameSection}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {fullName || (isArabic ? "بدون اسم" : "Unnamed")}
              </Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>
                    {isArabic ? "افتراضي" : "Default"}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => onEdit(address)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <SvgXml xml={editSvg} width={16} height={16} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => onDelete(address)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <SvgXml xml={deleteSvg} width={16} height={16} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.addressSection}>
          {addressLines.map((line, index) => (
            <View key={index} style={styles.addressLine}>
              {index === 0 && <SvgXml xml={locationSvg} width={14} height={14} />}
              {index > 0 && <View style={styles.addressIndent} />}
              <Text
                style={[styles.addressText, index > 0 && styles.addressSubText]}
                numberOfLines={2}
              >
                {line}
              </Text>
            </View>
          ))}
          {address.postcode ? (
            <View style={styles.addressLine}>
              <View style={styles.addressIndent} />
              <Text style={styles.addressSubText}>
                {isArabic ? "الرمز البريدي" : "Postal Code"}: {address.postcode}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.phoneRow}>
          <SvgXml xml={phoneSvg} width={14} height={14} />
          <Text style={styles.phoneText}>{address.phoneNumber}</Text>
        </View>
      </View>
    </View>
  );
};

export default AddressCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 3,
    position: "relative",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(8),
  },
  deleteBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: lightColors.bgDanger + "50",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    padding: scale(16),
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: lightColors.secondary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginEnd: scale(12),
  },
  avatarText: {
    fontSize: scale(17),
    fontWeight: "700",
    color: lightColors.secondary,
    fontFamily: "Inter-Bold",
  },
  nameSection: {
    flex: 1,
    marginEnd: scale(8),
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  name: {
    fontSize: scale(15),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter-SemiBold",
    flexShrink: 1,
  },
  defaultBadge: {
    backgroundColor: lightColors.secondary + "15",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: 6,
    marginStart: scale(6),
  },
  defaultBadgeText: {
    fontSize: scale(9),
    fontWeight: "700",
    color: lightColors.secondary,
    fontFamily: "Inter-Bold",
    letterSpacing: 0.3,
  },
  editBtn: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: lightColors.bgLight,
    justifyContent: "center",
    alignItems: "center",
  },
  addressSection: {
    marginTop: verticalScale(10),
    gap: verticalScale(4),
  },
  addressLine: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: scale(6),
  },
  addressIndent: {
    width: scale(14),
  },
  addressText: {
    fontSize: scale(13),
    color: lightColors.subtitle,
    fontFamily: "Inter",
    flex: 1,
    lineHeight: verticalScale(18),
  },
  addressSubText: {
    fontSize: scale(12),
    color: lightColors.hint,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
    borderTopWidth: 1,
    borderTopColor: lightColors.border + "25",
  },
  phoneText: {
    fontSize: scale(13),
    color: lightColors.primary,
    fontWeight: "500",
    fontFamily: "Inter-Medium",
  },
});
