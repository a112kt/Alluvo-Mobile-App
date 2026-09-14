import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import { useBrandTabBarPadding } from "../../navigation/useBrandTabBarPadding";

export default function ReelsScreen() {
  const tabBarPadding = useBrandTabBarPadding();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={[styles.content, { paddingBottom: tabBarPadding }]}>
        <Ionicons
          name="videocam-outline"
          size={s(56)}
          color={lightColors.textInactive}
        />
        <Text style={styles.title}>Reels</Text>
        <Text style={styles.subtitle}>Coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: lightColors.bgLight,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: s(24),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(22),
    color: lightColors.textTitle,
    marginTop: vs(16),
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(15),
    color: lightColors.textSubtitle,
    marginTop: vs(6),
  },
});
