import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StepIndicator from "react-native-step-indicator";
import { scale, verticalScale } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";
import { lightColors } from "../../../../../theme";

interface TrackStep {
  id: number;
  label: string;
  status: "completed" | "active" | "pending";
}

interface TrackBarProps {
  steps?: TrackStep[];
  activeStep?: number;
}

const TrackBar: React.FC<TrackBarProps> = ({
  steps = [
    { id: 1, label: "Order", status: "completed" },
    { id: 2, label: "Packed", status: "active" },
    { id: 3, label: "Shipped", status: "pending" },
  ],
  activeStep = 2,
}) => {
  const labels = steps.map((s) => s.label);
  const currentPosition = activeStep - 1;
  const isTerminal = steps.every((s) => s.status === "pending");

  const customStyles = {
    stepIndicatorSize: scale(22),
    currentStepIndicatorSize: scale(26),
    separatorStrokeWidth: 2,
    stepStrokeCurrentColor: "#47C0D2",
    stepStrokeFinishedColor: "#47C0D2",
    stepStrokeUnFinishedColor: "#D0D5E0",
    separatorFinishedColor: "#47C0D2",
    separatorUnFinishedColor: "#E8ECF4",
    stepIndicatorFinishedColor: "#47C0D2",
    stepIndicatorUnFinishedColor: "#FFFFFF",
    stepIndicatorCurrentColor: "#FFFFFF",
    currentStepStrokeWidth: 2,
    labelColor: lightColors.subtitle,
    currentStepLabelColor: lightColors.primary,
    labelSize: scale(10),
    labelFontFamily: "Poppins-Medium",
    labelAlign: "center" as const,
  };

  const renderStepIndicator = ({
    stepStatus,
  }: {
    position: number;
    stepStatus: string;
  }) => {
    const status = isTerminal ? "unfinished" : stepStatus;
    switch (status) {
      case "finished":
        return (
          <Ionicons name="checkmark" size={scale(13)} color="#fff" />
        );
      case "current":
        return <View style={styles.activeDot} />;
      case "unfinished":
      default:
        return <View style={styles.pendingDot} />;
    }
  };

  const renderLabel = ({
    stepStatus,
    label,
  }: {
    position: number;
    stepStatus: string;
    label: string;
    currentPosition: number;
  }) => {
    const status = isTerminal ? "unfinished" : stepStatus;
    const isActiveOrFinished =
      status === "finished" || status === "current";
    return (
      <View style={styles.labelWrap}>
        <Text
          style={[styles.label, { color: lightColors.subtitle }, isActiveOrFinished && { color: lightColors.primary }]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={Math.max(0, currentPosition)}
        labels={labels}
        stepCount={labels.length}
        direction="horizontal"
        renderStepIndicator={renderStepIndicator}
        renderLabel={renderLabel}
      />
    </View>
  );
};

export default TrackBar;

const styles = StyleSheet.create({
  container: {
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(8),
  },
  labelWrap: {
    paddingHorizontal: scale(6),
  },
  activeDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#47C0D2",
  },
  pendingDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#D0D5E0",
  },
  label: {
    fontSize: scale(10),
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  labelActive: {
    fontFamily: "Poppins-SemiBold",
  },
});
