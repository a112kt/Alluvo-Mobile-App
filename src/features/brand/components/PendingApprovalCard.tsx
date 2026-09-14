import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface PendingApprovalCardProps {
  submittedAt?: string;
}

export default function PendingApprovalCard({ submittedAt }: PendingApprovalCardProps) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const formattedDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <View style={styles.card}>
      <Animated.View style={[styles.iconWrap, { transform: [{ scale: pulse }] }]}>
        <Ionicons name="time-outline" size={s(40)} color={lightColors.textWarning} />
      </Animated.View>

      <Text style={styles.title}>Pending Approval</Text>
      <Text style={styles.subtitle}>
        Your brand registration is under review. We'll notify you once it's approved.
      </Text>

      {formattedDate && (
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={s(16)} color={lightColors.textHint} />
          <Text style={styles.dateText}>Submitted on {formattedDate}</Text>
        </View>
      )}

      <View style={styles.stepsRow}>
        {["Registered", "Under Review", "Approved"].map((step, i) => (
          <View key={step} style={styles.stepItem}>
            <View style={[styles.stepDot, i === 1 && styles.stepDotActive]}>
              {i === 0 && <Ionicons name="checkmark" size={s(12)} color="#FFF" />}
              {i === 1 && <View style={styles.stepDotInner} />}
            </View>
            <Text style={[styles.stepLabel, i === 1 && styles.stepLabelActive]}>
              {step}
            </Text>
            {i < 2 && <View style={styles.stepLine} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: lightColors.white,
    borderRadius: s(24),
    padding: s(32),
    alignItems: "center",
    marginHorizontal: s(20),
    marginTop: vs(40),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  iconWrap: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: lightColors.bgWarning,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: vs(20),
  },
  title: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(22),
    color: lightColors.textTitle,
    marginBottom: vs(8),
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(14),
    color: lightColors.textSubtitle,
    textAlign: "center",
    lineHeight: s(22),
    marginBottom: vs(24),
    paddingHorizontal: s(12),
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    backgroundColor: lightColors.bgLight,
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: s(12),
    marginBottom: vs(28),
  },
  dateText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(13),
    color: lightColors.textSubtitle,
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
  },
  stepItem: {
    alignItems: "center",
    flexDirection: "row",
  },
  stepDot: {
    width: s(24),
    height: s(24),
    borderRadius: s(12),
    backgroundColor: lightColors.textSuccess,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: lightColors.textWarning,
  },
  stepDotInner: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: "#FFF",
  },
  stepLabel: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: s(11),
    color: lightColors.textHint,
    marginLeft: s(4),
  },
  stepLabelActive: {
    color: lightColors.textWarning,
    fontWeight: "600",
  },
  stepLine: {
    width: s(24),
    height: 2,
    backgroundColor: lightColors.separator,
    marginHorizontal: s(4),
    marginTop: s(2),
  },
});
