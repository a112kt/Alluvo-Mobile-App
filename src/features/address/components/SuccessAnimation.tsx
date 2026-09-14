import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface SuccessAnimationProps {
  visible: boolean;
  message: string;
  onComplete: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  visible,
  message,
  onComplete,
}) => {
  const overlayOpacity = useSharedValue(0);
  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkStroke = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      overlayOpacity.value = withTiming(1, { duration: 300 });

      circleScale.value = withDelay(
        150,
        withSpring(1, {
          damping: 12,
          stiffness: 100,
          mass: 0.5,
        })
      );
      circleOpacity.value = withDelay(150, withTiming(1, { duration: 200 }));

      checkStroke.value = withDelay(
        400,
        withTiming(1, { duration: 400, easing: Easing.out(Easing.ease) })
      );

      textOpacity.value = withDelay(
        600,
        withTiming(1, { duration: 300 })
      );

      const timeout = setTimeout(() => {
        runOnJS(onComplete)();
      }, 2000);

      return () => clearTimeout(timeout);
    } else {
      overlayOpacity.value = withTiming(0, { duration: 200 });
      circleScale.value = 0;
      circleOpacity.value = 0;
      checkStroke.value = 0;
      textOpacity.value = 0;
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    pointerEvents: visible ? "auto" : "none" as any,
  }));

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
    opacity: circleOpacity.value,
  }));

  const checkContainerStyle = useAnimatedStyle(() => ({
    opacity: checkStroke.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      {
        translateY: withTiming(textOpacity.value * 0, { duration: 300 }),
      },
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]}>
      <View style={styles.content}>
        <Animated.View style={[styles.circleOuter, circleStyle]}>
          <View style={styles.circleInner}>
            <Animated.View style={checkContainerStyle}>
              <View style={styles.checkmark}>
                <View style={styles.checkLeft} />
                <View style={styles.checkRight} />
              </View>
            </Animated.View>
          </View>
        </Animated.View>
        <Animated.Text style={[styles.message, textStyle]}>
          {message}
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

export default SuccessAnimation;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: {
    alignItems: "center",
  },
  circleOuter: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    backgroundColor: lightColors.textSuccess + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  circleInner: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: lightColors.textSuccess,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    width: scale(24),
    height: scale(18),
    position: "relative",
  },
  checkLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: scale(10),
    height: scale(3),
    backgroundColor: "#fff",
    borderRadius: 2,
    transform: [{ rotate: "-45deg" }, { translateY: -1 }],
  },
  checkRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: scale(18),
    height: scale(3),
    backgroundColor: "#fff",
    borderRadius: 2,
    transform: [{ rotate: "45deg" }, { translateX: 2 }, { translateY: -5 }],
  },
  message: {
    fontSize: scale(17),
    fontWeight: "600",
    color: lightColors.primary,
    fontFamily: "Inter-SemiBold",
    marginTop: verticalScale(20),
    textAlign: "center",
    paddingHorizontal: scale(20),
  },
});
