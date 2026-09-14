import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, ViewStyle, TextStyle } from "react-native";
import { TextInput } from "react-native-paper";
import { lightColors } from "../../../theme";
import { s } from "react-native-size-matters";

interface AuthInputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e: any) => void;
  error?: string;
  touched?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  right?: React.ReactNode;
  style?: ViewStyle;
  inputStyle?: ViewStyle;
  labelStyle?: TextStyle;
  contentStyle?: ViewStyle;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  error,
  touched,
  secureTextEntry,
  keyboardType = "default",
  right,
  style,
  inputStyle,
  labelStyle,
  contentStyle,
  autoCapitalize = "none",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [lightColors.inputBorder || "#E4E8EE", lightColors.textInfo || lightColors.primary],
  });

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, { color: lightColors.primary }, labelStyle]}>
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: lightColors.inputBackground,
            borderColor,
          },
        ]}
      >
        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          mode="flat"
          right={right}
          autoCapitalize={autoCapitalize}
          style={[styles.input, inputStyle]}
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          dense={true}
          selectionColor={lightColors.primary}
          cursorColor={lightColors.primary}
          contentStyle={[styles.inputContent, contentStyle]}
          theme={{
            colors: {
              placeholder: "#A0A5B0",
              text: "#111",
              primary: lightColors.primary,
            },
          }}
        />
      </Animated.View>
      {touched && error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

export default AuthInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: s(16),
  },
  label: {
    fontSize: s(14),
    fontWeight: "600",
    marginBottom: s(8),
    fontFamily: "Inter",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: s(16),
    height: s(52),
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    backgroundColor: "transparent",
    flex: 1,
    height: s(52),
  },
  inputContent: {
    fontFamily: "Inter",
    fontSize: s(15),
    paddingHorizontal: s(16),
    paddingTop: 0,
    paddingBottom: 0,
    textAlignVertical: "center",
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: s(6),
  },
  errorText: {
    color: "#EF4444",
    fontSize: s(12),
    fontFamily: "Inter",
    fontWeight: "500",
  },
});
