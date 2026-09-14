import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";
import type { TopProduct } from "../types/dashboard";

interface ProductRowProps {
  product: TopProduct;
  rank: number;
}

export default function ProductRow({ product, rank }: ProductRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.rank}>#{rank}</Text>
      {product.imageUrl ? (
        <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="cube-outline" size={s(18)} color={lightColors.textInactive} />
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.sales}>{product.totalSold} units sold</Text>
      </View>
      <View style={styles.revenueWrap}>
        <Text style={styles.revenue}>EGP {product.revenue.toFixed(2)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: lightColors.white,
    borderRadius: s(12),
    padding: s(10),
    marginBottom: vs(8),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rank: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(12),
    color: lightColors.textHint,
    width: s(28),
  },
  image: {
    width: s(40),
    height: s(40),
    borderRadius: s(8),
    backgroundColor: lightColors.bgHeavy,
    marginRight: s(10),
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    marginRight: s(8),
  },
  name: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textTitle,
    marginBottom: vs(2),
  },
  sales: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(11),
    color: lightColors.textHint,
  },
  revenueWrap: {
    backgroundColor: lightColors.bgSuccess,
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: s(8),
  },
  revenue: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(12),
    color: lightColors.textSuccess,
  },
});
