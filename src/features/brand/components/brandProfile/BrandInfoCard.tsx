import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import type { BrandDetailsResponse } from "../../types/brandProfile";
import HtmlText from "../../../../Components/HtmlText";

interface Props {
  brand: BrandDetailsResponse;
}

export default function BrandInfoCard({ brand }: Props) {
  return (
    <View style={styles.card}>
      {brand.coverImageUrl ? (
        <Image
          source={{ uri: brand.coverImageUrl }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.coverPlaceholder} />
      )}

      <View style={styles.logoRow}>
        {brand.logoUrl ? (
          <Image source={{ uri: brand.logoUrl }} style={styles.logo} />
        ) : (
          <View style={[styles.logo, styles.logoPlaceholder]}>
            <Ionicons
              name="business-outline"
              size={s(28)}
              color={lightColors.textInactive}
            />
          </View>
        )}
      </View>

      <View style={styles.infoSection}>
        <View style={styles.nameRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.brandName}>{brand.displayName}</Text>
            <Text style={styles.meta}>
              {brand.category} {"\u2022"} {brand.country}, {brand.governorate}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            {brand.isVerified && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <Ionicons
                  name="checkmark-circle"
                  size={s(12)}
                  color={lightColors.primary}
                />
                <Text style={styles.badgeTextVerified}>Verified</Text>
              </View>
            )}
            <View
              style={[
                styles.badge,
                brand.status === "APPROVED"
                  ? styles.statusApproved
                  : styles.statusPending,
              ]}
            >
              <Text style={styles.badgeText}>
                {brand.status.replace("_", " ")}
              </Text>
            </View>
          </View>
        </View>

        {brand.description ? (
          <View style={{ marginTop: vs(12) }}>
            <HtmlText html={brand.description} />
          </View>
        ) : null}

        <View style={styles.divider} />

        <View style={styles.metaRow}>
          <MetaItem
            label="Created"
            value={new Date(brand.createdAt).toLocaleDateString("en")}
          />
          {brand.submittedAt && (
            <MetaItem
              label="Submitted"
              value={new Date(brand.submittedAt).toLocaleDateString("en")}
            />
          )}
          <MetaItem
            label="Employees"
            value={brand.numberOfEmployees.toLocaleString("en")}
          />
          <MetaItem
            label="Rating"
            value={`${brand.averageRating.toFixed(1)} (${brand.numOfReviews.toLocaleString("en")})`}
          />
        </View>
      </View>
    </View>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.white,
    borderRadius: s(20),
    marginBottom: vs(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: vs(140),
  },
  coverPlaceholder: {
    width: "100%",
    height: vs(100),
    backgroundColor: lightColors.secondary,
    opacity: 0.2,
  },
  logoRow: {
    paddingHorizontal: s(20),
    marginTop: -s(36),
  },
  logo: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    borderWidth: 3,
    borderColor: lightColors.white,
  },
  logoPlaceholder: {
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    paddingHorizontal: s(20),
    paddingTop: vs(12),
    paddingBottom: s(20),
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  brandName: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(20),
    color: lightColors.textTitle,
  },
  meta: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textSubtitle,
    marginTop: vs(2),
  },
  badgeRow: {
    flexDirection: "row",
    gap: s(6),
    flexShrink: 1,
    marginLeft: s(8),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: s(8),
    gap: s(3),
  },
  verifiedBadge: {
    backgroundColor: lightColors.bgInfo,
  },
  statusApproved: {
    backgroundColor: lightColors.bgSuccess,
  },
  statusPending: {
    backgroundColor: lightColors.bgWarning,
  },
  badgeTextVerified: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(10),
    color: lightColors.primary,
  },
  badgeText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(10),
    color: lightColors.textTitle,
  },
  description: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textBody,
    lineHeight: s(20),
    marginTop: vs(12),
  },
  divider: {
    height: 1,
    backgroundColor: lightColors.separator,
    marginVertical: vs(14),
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: s(16),
  },
  metaItem: {},
  metaLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(10),
    color: lightColors.textHint,
  },
  metaValue: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
    marginTop: vs(1),
  },
});
