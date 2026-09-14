import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type { SocialLinkDto } from "../../types/brandProfile";

interface Props {
  links: SocialLinkDto[];
}

export default function BrandSocialLinks({ links }: Props) {
  if (!links || links.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Social Links</Text>
      <View style={styles.linksRow}>
        {links.map((link) => (
          <Pressable
            key={link.id}
            style={styles.linkChip}
            onPress={() => Linking.openURL(link.url)}
          >
            <Ionicons
              name="link-outline"
              size={s(14)}
              color={lightColors.primary}
            />
            <Text style={styles.linkText}>{link.platform}</Text>
          </Pressable>
        ))}
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
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(8),
  },
  linkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(5),
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: s(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
  },
  linkText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(12),
    color: lightColors.primary,
  },
});
