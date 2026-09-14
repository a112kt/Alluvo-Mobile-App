import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { s } from "react-native-size-matters";
import { lightColors } from "../../../../../../theme";
import { ShippingAddressData } from "../../../services/Profile";

interface SavedAddressCardProps {
  address: ShippingAddressData;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}

const SavedAddressCard = ({
  address,
  isSelected,
  onSelect,
  disabled,
}: SavedAddressCardProps) => {
  const borderColor = isSelected ? lightColors.secondary : "#E5E7EB";
  const bgColor = isSelected ? lightColors.secondary + "0D" : "#FFFFFF";

  const fullAddress = [address.street, address.building, address.apartment]
    .filter(Boolean)
    .join(", ");

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.7}
      onPress={disabled ? undefined : onSelect}
      style={[styles.card, { borderColor, backgroundColor: bgColor }]}
    >
      <View style={styles.radioRow}>
        <View style={[styles.radio, isSelected && styles.radioSelected]}>
          {isSelected && <View style={styles.radioDot} />}
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {address.name}
          {address.lastName ? ` ${address.lastName}` : ""}
        </Text>
      </View>

      {fullAddress ? (
        <Text style={styles.address} numberOfLines={2}>
          {fullAddress}
        </Text>
      ) : null}

      {address.city || address.country ? (
        <Text style={styles.cityCountry} numberOfLines={1}>
          {[address.city, address.country].filter(Boolean).join(", ")}
        </Text>
      ) : null}

      {address.phoneNumber ? (
        <Text style={styles.phone}>{address.phoneNumber}</Text>
      ) : null}

      {address.isDefault && (
        <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SavedAddressCard;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: s(12),
    padding: s(14),
    minWidth: s(160),
    maxWidth: s(220),
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: s(8),
  },
  radio: {
    width: s(18),
    height: s(18),
    borderRadius: s(9),
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginEnd: s(8),
  },
  radioSelected: {
    borderColor: lightColors.secondary,
  },
  radioDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: lightColors.secondary,
  },
  name: {
    fontSize: s(13),
    fontWeight: "700",
    color: "#1B2351",
    fontFamily: "Inter-Bold",
    flex: 1,
  },
  address: {
    fontSize: s(11),
    color: "#6B7280",
    fontFamily: "Inter-Regular",
    marginBottom: s(4),
    lineHeight: s(16),
  },
  cityCountry: {
    fontSize: s(11),
    color: "#6B7280",
    fontFamily: "Inter-Regular",
    marginBottom: s(4),
  },
  phone: {
    fontSize: s(11),
    color: "#6B7280",
    fontFamily: "Inter-Regular",
  },
  defaultBadge: {
    marginTop: s(8),
    backgroundColor: lightColors.secondary + "20",
    borderRadius: s(4),
    paddingVertical: s(2),
    paddingHorizontal: s(8),
    alignSelf: "flex-start",
  },
  defaultBadgeText: {
    fontSize: s(10),
    fontWeight: "600",
    color: lightColors.secondary,
    fontFamily: "Inter-SemiBold",
  },
});
