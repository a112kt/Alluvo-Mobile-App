import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type { BrandOwnerDetails } from "../../types/brandProfile";

interface Props {
  owner: BrandOwnerDetails;
}

export default function BrandOwnerCard({ owner }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Brand Owner</Text>
      <View style={styles.row}>
        {owner.imageUrl ? (
          <Image source={{ uri: owner.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Ionicons
              name="person-outline"
              size={s(24)}
              color={lightColors.textInactive}
            />
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{owner.displayName}</Text>
          {owner.email ? (
            <View style={styles.contactRow}>
              <Ionicons
                name="mail-outline"
                size={s(13)}
                color={lightColors.textHint}
              />
              <Text style={styles.contactText}>{owner.email}</Text>
            </View>
          ) : null}
          {owner.phoneNumber ? (
            <View style={styles.contactRow}>
              <Ionicons
                name="call-outline"
                size={s(13)}
                color={lightColors.textHint}
              />
              <Text style={styles.contactText}>{owner.phoneNumber}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    padding: s(20),
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: lightColors.textTitle,
    marginBottom: vs(14),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(14),
  },
  avatar: {
    width: s(52),
    height: s(52),
    borderRadius: s(26),
  },
  avatarPlaceholder: {
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: lightColors.textTitle,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    marginTop: vs(4),
  },
  contactText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },
});
