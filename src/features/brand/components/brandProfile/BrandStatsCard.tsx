import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: string;
}

export default function BrandStatsCard({ icon, label, value, color }: Props) {
  const iconColor = color || lightColors.secondary;
  const iconBg = color ? `${color}15` : `${lightColors.secondary}15`;

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 40,
      friction: 3,
    }).start();
  };

  return (
    <Animated.View style={[{ flex: 1 }, { transform: [{ scale: scaleAnim }] }]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.card}
      >
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={s(24)} color={iconColor} />
        </View>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.white,
    borderRadius: s(18),
    paddingVertical: s(20),
    paddingHorizontal: s(12),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  iconWrap: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(10),
  },
  value: {
    fontFamily: "Inter",
    fontWeight: "800",
    fontSize: s(24),
    color: lightColors.textTitle,
    textAlign: "center",
  },
  label: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(11),
    color: lightColors.textSubtitle,
    marginTop: vs(4),
    textAlign: "center",
  },
});
