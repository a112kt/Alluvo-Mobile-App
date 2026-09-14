import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Platform,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { scale, verticalScale } from "react-native-size-matters";
import { lightColors } from "../../../../theme";

interface AnimatedInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  placeholder?: string;
  keyboardType?: "default" | "phone-pad" | "numeric";
  multiline?: boolean;
  editable?: boolean;
  required?: boolean;
  half?: boolean;
  isRTL?: boolean;
}

const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  placeholder,
  keyboardType = "default",
  multiline = false,
  editable = true,
  required = false,
  half = false,
  isRTL = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = useSharedValue(0);
  const shadowOpacity = useSharedValue(0);
  const scaleVal = useSharedValue(1);
  const shakeTranslate = useSharedValue(0);
  const successOpacity = useSharedValue(0);

  const hasValue = value.length > 0;
  const hasError = !!error;

  const borderColorStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      borderColor.value,
      [0, 1, 2],
      [
        `${lightColors.border}50`,
        lightColors.secondary,
        lightColors.textDanger,
      ]
    ),
    borderWidth: hasError ? 1.5 : 1,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    shadowColor: hasError ? lightColors.textDanger : lightColors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: shadowOpacity.value,
    shadowRadius: 8,
    elevation: shadowOpacity.value * 4,
  }));

  const scaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleVal.value }],
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeTranslate.value }],
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: successOpacity.value }],
  }));

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(1, { duration: 200 });
    shadowOpacity.value = withTiming(0.15, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!hasError) {
      borderColor.value = withTiming(0, { duration: 200 });
      shadowOpacity.value = withTiming(0, { duration: 200 });
    }
  };

  const triggerShake = useCallback(() => {
    shakeTranslate.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const triggerSuccess = useCallback(() => {
    successOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(800, withTiming(0, { duration: 300 }))
    );
  }, []);

  React.useEffect(() => {
    if (hasError) {
      borderColor.value = withTiming(2, { duration: 200 });
      triggerShake();
    } else if (!isFocused) {
      borderColor.value = withTiming(0, { duration: 200 });
      shadowOpacity.value = withTiming(0, { duration: 200 });
    } else {
      borderColor.value = withTiming(1, { duration: 200 });
    }
  }, [hasError]);

  React.useEffect(() => {
    if (hasValue && !hasError && !isFocused) {
      triggerSuccess();
    }
  }, [value]);

  const textAlign = isRTL ? "right" : "left";

  return (
    <View style={[half ? styles.halfField : styles.fullField]}>
      <Animated.View
        style={[
          styles.inputContainer,
          borderColorStyle,
          shadowStyle,
          scaleStyle,
          shakeStyle,
          multiline && styles.inputContainerMultiline,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { textAlign },
            multiline && styles.inputMultiline,
          ]}
          placeholder={placeholder || label}
          placeholderTextColor={lightColors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          editable={editable}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />

        <Animated.View style={[styles.successIndicator, successStyle]}>
          <View style={styles.successDot} />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[
          styles.errorContainer,
          {
            opacity: hasError ? 1 : 0,
            transform: [
              {
                translateY: hasError
                  ? withTiming(0, { duration: 200 })
                  : -8,
              },
            ],
          },
        ]}
        pointerEvents="none"
      >
        {hasError && (
          <Text style={[styles.errorText, { textAlign }]}>{error}</Text>
        )}
      </Animated.View>
    </View>
  );
};

export default AnimatedInput;

const styles = StyleSheet.create({
  fullField: {
    marginBottom: verticalScale(14),
    flex: 1,
  },
  halfField: {
    flex: 1,
    marginBottom: verticalScale(14),
  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${lightColors.border}50`,
    minHeight: verticalScale(48),
    justifyContent: "center",
    shadowColor: lightColors.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 8,
    elevation: 0,
  },
  inputContainerMultiline: {
    minHeight: verticalScale(80),
  },
  input: {
    paddingHorizontal: scale(14),
    paddingVertical: Platform.OS === "ios" ? verticalScale(13) : verticalScale(10),
    fontSize: scale(15),
    color: lightColors.primary,
    fontFamily: "Inter",
  },
  inputMultiline: {
    minHeight: verticalScale(80),
    textAlignVertical: "top",
    paddingTop: verticalScale(12),
  },
  errorContainer: {
    overflow: "hidden",
    marginTop: verticalScale(2),
  },
  errorText: {
    color: lightColors.textDanger,
    fontSize: scale(11),
    fontFamily: "Inter",
  },
  successIndicator: {
    position: "absolute",
    right: scale(12),
    top: "50%",
    marginTop: -6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: lightColors.textSuccess + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  successDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: lightColors.textSuccess,
  },
});
