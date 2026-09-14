import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface RejectedCardProps {
  rejectionReason?: string;
  lastFailedStep?: number;
  onContinueRegistration: () => void;
}

const STEP_NAMES = ["Account Details", "Brand Info", "Verification", "Complete"];

export default function RejectedCard({
  rejectionReason,
  lastFailedStep,
  onContinueRegistration,
}: RejectedCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="close-circle-outline" size={s(40)} color={lightColors.textDanger} />
      </View>

      <Text style={styles.title}>Registration Rejected</Text>
      <Text style={styles.subtitle}>
        Unfortunately, your brand registration was not approved. Please review the feedback below and try again.
      </Text>

      {rejectionReason && (
        <View style={styles.reasonBox}>
          <View style={styles.reasonHeader}>
            <Ionicons name="alert-circle-outline" size={s(18)} color={lightColors.textDanger} />
            <Text style={styles.reasonLabel}>Rejection Reason</Text>
          </View>
          <Text style={styles.reasonText}>{rejectionReason}</Text>
        </View>
      )}

      {lastFailedStep != null && (
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Last Completed Step</Text>
          <View style={styles.stepsRow}>
            {STEP_NAMES.map((step, i) => {
              const isCompleted = lastFailedStep != null && i < lastFailedStep;
              const isFailed = i === lastFailedStep;
              return (
                <React.Fragment key={step}>
                  <View style={styles.stepItem}>
                    <View
                      style={[
                        styles.stepDot,
                        isCompleted && styles.stepDotCompleted,
                        isFailed && styles.stepDotFailed,
                      ]}
                    >
                      {isCompleted && <Ionicons name="checkmark" size={s(10)} color="#FFF" />}
                      {isFailed && <Ionicons name="close" size={s(10)} color="#FFF" />}
                    </View>
                    <Text
                      style={[
                        styles.stepLabel,
                        isCompleted && styles.stepLabelCompleted,
                        isFailed && styles.stepLabelFailed,
                      ]}
                    >
                      {step}
                    </Text>
                  </View>
                  {i < STEP_NAMES.length - 1 && (
                    <View
                      style={[
                        styles.stepLine,
                        isCompleted && styles.stepLineCompleted,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
        </View>
      )}

      <Pressable style={styles.btn} onPress={onContinueRegistration}>
        <Ionicons name="arrow-forward" size={s(18)} color="#FFF" />
        <Text style={styles.btnText}>Continue Registration</Text>
      </Pressable>
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
    backgroundColor: lightColors.bgDanger,
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
    paddingHorizontal: s(8),
  },
  reasonBox: {
    width: "100%",
    backgroundColor: lightColors.bgDanger,
    borderRadius: s(14),
    padding: s(16),
    marginBottom: vs(20),
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: s(6),
    marginBottom: vs(8),
  },
  reasonLabel: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textDanger,
  },
  reasonText: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(13),
    color: lightColors.textBody,
    lineHeight: s(20),
  },
  stepsContainer: {
    width: "100%",
    marginBottom: vs(24),
  },
  stepsTitle: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(13),
    color: lightColors.textSubtitle,
    marginBottom: vs(12),
    textAlign: "center",
  },
  stepsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepItem: {
    alignItems: "center",
  },
  stepDot: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: lightColors.bgHeavy,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotCompleted: {
    backgroundColor: lightColors.textSuccess,
  },
  stepDotFailed: {
    backgroundColor: lightColors.textDanger,
  },
  stepLabel: {
    fontFamily: "Inter",
    fontWeight: "400",
    fontSize: s(9),
    color: lightColors.textHint,
    marginTop: vs(4),
  },
  stepLabelCompleted: {
    color: lightColors.textSuccess,
  },
  stepLabelFailed: {
    color: lightColors.textDanger,
    fontWeight: "600",
  },
  stepLine: {
    width: s(16),
    height: 2,
    backgroundColor: lightColors.separator,
    marginHorizontal: s(2),
    marginBottom: vs(16),
  },
  stepLineCompleted: {
    backgroundColor: lightColors.textSuccess,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: s(8),
    width: "100%",
    backgroundColor: lightColors.primary,
    paddingVertical: vs(14),
    borderRadius: s(14),
  },
  btnText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(15),
    color: "#FFFFFF",
  },
});
