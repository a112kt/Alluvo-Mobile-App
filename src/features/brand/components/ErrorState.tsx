import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Ionicons
          name="alert-circle-outline"
          size={s(48)}
          color={lightColors.textDanger}
        />
      </View>
      <Text style={styles.title}>Oops!</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh-outline" size={s(18)} color={lightColors.white} />
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(60),
    paddingHorizontal: s(24),
    backgroundColor: lightColors.bgLight,
  },
  iconWrap: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: lightColors.bgDanger,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(16),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(18),
    color: lightColors.textTitle,
    marginBottom: vs(6),
  },
  message: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(14),
    color: lightColors.textSubtitle,
    textAlign: "center",
    lineHeight: s(20),
    marginBottom: vs(20),
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    paddingHorizontal: s(24),
    paddingVertical: vs(12),
    borderRadius: s(12),
    backgroundColor: lightColors.primary,
  },
  retryText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: lightColors.white,
  },
});
