import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, vs } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

interface AuthDividerProps {
  text?: string;
}

const AuthDivider: React.FC<AuthDividerProps> = ({ text }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.dividerContainer}>
      <View style={styles.line} />
      <Text style={styles.textLine}>{text || t("orWith")}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default AuthDivider;

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: vs(24),
    marginBottom: vs(4),
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E4E8EE",
  },
  textLine: {
    marginHorizontal: s(16),
    fontFamily: "Inter",
    fontSize: s(13),
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
});
