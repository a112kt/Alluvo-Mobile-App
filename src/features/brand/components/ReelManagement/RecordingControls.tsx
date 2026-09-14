import React, { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { s, vs } from "react-native-size-matters";
import { lightColors } from "../../../../../theme";

interface RecordingControlsProps {
  isRecording: boolean;
  isPreviewMode: boolean;
  timerSeconds: number;
  onRecordPress: () => void;
  onFlipCamera: () => void;
  onFlashToggle: () => void;
  flashMode: "off" | "on" | "auto";
  onAccept: () => void;
  onRetake: () => void;
  onDiscard: () => void;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s_ = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s_.toString().padStart(2, "0")}`;
}

function RecordButton({
  isRecording,
  onPress,
}: {
  isRecording: boolean;
  onPress: () => void;
}) {
  const pulse = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0, { duration: 800 })
        ),
        -1,
        true
      );
      scale.value = withSpring(1.15);
    } else {
      pulse.value = withTiming(0);
      scale.value = withSpring(1);
    }
  }, [isRecording]);

  const outerRingStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.4, 0.9], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(pulse.value, [0, 1], [1, 1.3], Extrapolation.CLAMP),
      },
    ],
  }));

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} style={styles.recordBtnWrapper}>
      <Animated.View style={[styles.recordBtnPulse, outerRingStyle]} />
      <View style={styles.recordBtnOuterBorder}>
        <Animated.View
          style={[
            styles.recordBtnInner,
            isRecording && styles.recordingInner,
            innerStyle,
          ]}
        />
      </View>
    </Pressable>
  );
}

export default function RecordingControls({
  isRecording,
  isPreviewMode,
  timerSeconds,
  onRecordPress,
  onFlipCamera,
  onFlashToggle,
  flashMode,
  onAccept,
  onRetake,
  onDiscard,
}: RecordingControlsProps) {
  const flashIcons: Record<string, string> = {
    off: "flash-off-outline",
    on: "flash",
    auto: "flash-outline",
  };

  if (isPreviewMode) {
    return (
      <View style={styles.previewContainer}>
        {/* Top bar with a clean back / label */}
        <View style={styles.previewTopBar}>
          <Pressable onPress={onDiscard} style={styles.glassBtn}>
            <Ionicons name="chevron-back" size={s(20)} color="#fff" />
          </Pressable>
          <Text style={styles.previewTitle}>Preview Reel</Text>
          <View style={{ width: s(40) }} />
        </View>

        {/* Bottom controls panel */}
        <View style={styles.previewControls}>
          <Pressable onPress={onRetake} style={styles.actionBtn}>
            <View style={styles.actionIconWrap}>
              <Ionicons name="refresh-outline" size={s(22)} color="#fff" />
            </View>
            <Text style={styles.actionText}>Retake</Text>
          </Pressable>

          <Pressable onPress={onAccept} style={styles.useBtn}>
            <Ionicons name="checkmark-sharp" size={s(28)} color="#fff" />
          </Pressable>

          <Pressable onPress={onDiscard} style={styles.actionBtn}>
            <View style={[styles.actionIconWrap, styles.discardIconWrap]}>
              <Ionicons name="trash-outline" size={s(22)} color="#fff" />
            </View>
            <Text style={styles.actionText}>Discard</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.topControls}>
        <View style={styles.timerWrap}>
          <View
            style={[
              styles.timerDot,
              isRecording && styles.timerDotActive,
            ]}
          />
          <Text style={styles.timerText}>{formatTime(timerSeconds)}</Text>
        </View>
      </View>

      <View style={styles.bottomControls}>
        <RecordButton isRecording={isRecording} onPress={onRecordPress} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  topControls: {
    position: "absolute",
    top: vs(50),
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  timerWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: s(20),
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  timerDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: "#fff",
    marginRight: s(8),
  },
  timerDotActive: {
    backgroundColor: "#FF334B",
  },
  timerText: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(13),
    color: "#fff",
    letterSpacing: 0.5,
  },
  bottomControls: {
    position: "absolute",
    bottom: vs(35),
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  recordBtnWrapper: {
    width: s(84),
    height: s(84),
    alignItems: "center",
    justifyContent: "center",
  },
  recordBtnPulse: {
    position: "absolute",
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: "rgba(255, 51, 75, 0.35)",
  },
  recordBtnOuterBorder: {
    width: s(76),
    height: s(76),
    borderRadius: s(38),
    borderWidth: s(4),
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  recordBtnInner: {
    width: s(60),
    height: s(60),
    borderRadius: s(30),
    backgroundColor: "#FF334B",
  },
  recordingInner: {
    width: s(26),
    height: s(26),
    borderRadius: s(6),
    backgroundColor: "#FF334B",
  },
  previewContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    paddingBottom: vs(40),
    paddingTop: vs(50),
    zIndex: 10,
  },
  previewTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: s(20),
  },
  previewTitle: {
    fontFamily: "Inter",
    fontWeight: "700",
    fontSize: s(16),
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  glassBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: s(32),
    paddingHorizontal: s(20),
  },
  actionBtn: {
    alignItems: "center",
    gap: vs(6),
  },
  actionIconWrap: {
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  discardIconWrap: {
    backgroundColor: "rgba(255, 51, 75, 0.2)",
    borderColor: "rgba(255, 51, 75, 0.4)",
  },
  actionText: {
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: s(12),
    color: "rgba(255,255,255,0.9)",
  },
  useBtn: {
    width: s(72),
    height: s(72),
    borderRadius: s(36),
    backgroundColor: lightColors.secondary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: lightColors.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
