import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";
import HtmlText from "../../../../Components/HtmlText";

interface Props {
  html: string;
}

export default function BrandPolicies({ html }: Props) {
  if (!html) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Brand Policies</Text>
      <HtmlText html={html} />
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
  policyText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textBody,
    lineHeight: s(21),
  },
});
