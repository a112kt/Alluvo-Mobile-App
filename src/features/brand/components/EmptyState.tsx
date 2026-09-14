import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon = "file-tray-outline",
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <View style={styles.illustrationWrap}>
        <View style={styles.illustrationBg}>
          <Ionicons name={icon} size={s(48)} color={lightColors.primary + "40"} />
        </View>
        <View style={styles.illustrationRing} />
      </View>

      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}

      {actionLabel && onAction && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Ionicons name="add-circle-outline" size={s(16)} color="#fff" />
          <Text style={styles.actionBtnText}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: vs(50),
    paddingHorizontal: s(32),
  },
  illustrationWrap: {
    width: s(100),
    height: s(100),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(24),
  },
  illustrationBg: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: lightColors.primary + "08",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  illustrationRing: {
    position: "absolute",
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    borderWidth: 2,
    borderColor: lightColors.primary + "12",
    borderStyle: "dashed",
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(17),
    color: lightColors.textTitle,
    textAlign: "center",
    marginBottom: vs(8),
    lineHeight: s(24),
  },
  message: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textHint,
    textAlign: "center",
    lineHeight: s(20),
    marginBottom: vs(24),
    maxWidth: s(260),
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    backgroundColor: lightColors.primary,
    paddingHorizontal: s(20),
    paddingVertical: vs(12),
    borderRadius: s(14),
  },
  actionBtnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(14),
    color: "#fff",
  },
});
