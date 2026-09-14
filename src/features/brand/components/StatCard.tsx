import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface StatCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
  trend?: string;
  trendDirection?: "up" | "down";
}

export default function StatCard({
  icon,
  title,
  value,
  trend,
  trendDirection,
}: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={s(20)} color={lightColors.primary} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      {trend && (
        <View style={styles.trendRow}>
          <Ionicons
            name={trendDirection === "up" ? "trending-up" : "trending-down"}
            size={s(12)}
            color={trendDirection === "up" ? "#10B981" : "#EF4444"}
          />
          <Text
            style={[
              styles.trendText,
              {
                color:
                  trendDirection === "up" ? "#10B981" : "#EF4444",
              },
            ]}
          >
            {trend}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: lightColors.white,
    borderRadius: s(16),
    padding: s(16),
    marginHorizontal: s(4),
    marginBottom: vs(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    minHeight: vs(120),
  },
  iconWrap: {
    width: s(36),
    height: s(36),
    borderRadius: s(10),
    backgroundColor: lightColors.bgLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(10),
  },
  value: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginBottom: vs(2),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(12),
    color: lightColors.textSubtitle,
  },
  trendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(6),
    gap: s(3),
  },
  trendText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(11),
  },
});
